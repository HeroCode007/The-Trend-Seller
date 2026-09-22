import datetime
import time
import urllib.request
import urllib.parse
import json
import os
import sys

# Ensure UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCHEDULE_FILE = os.path.join(BASE_DIR, "scheduled_posts.json")
RESULTS_FILE = os.path.join(BASE_DIR, "live_published_results.json")
LOG_FILE = os.path.join(BASE_DIR, "scheduler_execution.log")

DEFAULT_TOKEN = "IGAAoQCwwUk5ZABZAFloUDFqc0Q5Ym9wU2tvbk1tdGhvb1N3Nl8ySkdXdlhCclE4R1Bqa2tJN21XN3ZA6bVdmcndrSlNHLUE3a2hubnN0Nnhlb1lRbHVaMkxoZATNvQ3UzcU1sa0ZARVHZA5RGN6a25FY3ZAEd0lNSldjeHFXQW9RcXdJTQZDZD"
DEFAULT_ACCOUNT_ID = "17841404898221435"

TOKEN = (os.environ.get("IG_ACCESS_TOKEN") or "").strip() or DEFAULT_TOKEN
ACCOUNT_ID = (os.environ.get("IG_ACCOUNT_ID") or "").strip() or DEFAULT_ACCOUNT_ID

def log(msg):
    ts = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{ts}] {msg}"
    print(line, flush=True)
    try:
        with open(LOG_FILE, "a", encoding="utf-8") as f:
            f.write(line + "\n")
    except Exception as e:
        print(f"Failed writing log: {e}")

def load_schedule():
    if not os.path.exists(SCHEDULE_FILE):
        return []
    with open(SCHEDULE_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def save_schedule(items):
    with open(SCHEDULE_FILE, "w", encoding="utf-8") as f:
        json.dump(items, f, indent=2)

def record_live_published(item, media_id, permalink):
    results = []
    if os.path.exists(RESULTS_FILE):
        try:
            with open(RESULTS_FILE, "r", encoding="utf-8") as f:
                results = json.load(f)
        except:
            results = []
    results.append({
        "title": item["product_name"],
        "product_code": item["product_code"],
        "media_id": media_id,
        "permalink": permalink,
        "published_at": datetime.datetime.now().isoformat()
    })
    with open(RESULTS_FILE, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)

def make_request_with_retries(req, timeout=45, max_retries=5, retry_delay=5):
    last_err = None
    for attempt in range(1, max_retries + 1):
        try:
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            err_body = e.read().decode('utf-8') if hasattr(e, 'read') else str(e)
            log(f"HTTP ERROR {e.code} on attempt {attempt}/{max_retries}: {err_body}")
            last_err = Exception(f"HTTP {e.code}: {err_body}")
            # If rate limited (code 4) or 5xx, retry
            if e.code not in (400, 401, 403, 404):
                time.sleep(retry_delay)
                continue
            raise last_err
        except Exception as e:
            log(f"Network/API warning on attempt {attempt}/{max_retries}: {e}. Retrying in {retry_delay}s...")
            last_err = e
            if attempt < max_retries:
                time.sleep(retry_delay)
    raise last_err

def publish_item(item):
    log(f"Initiating publication for [{item['product_code']}] {item['product_name']}...")
    try:
        # Step 1: Create Container
        is_reel = item.get("media_type") == "REELS" or bool(item.get("video_url"))
        
        if is_reel:
            log("Step 1: Creating Instagram REEL media container...")
            payload = {
                "media_type": "REELS",
                "video_url": item["video_url"],
                "caption": item["caption"],
                "share_to_feed": True,
                "access_token": TOKEN
            }
        else:
            log("Step 1: Creating Instagram photo media container...")
            payload = {
                "image_url": item["image_url"],
                "caption": item["caption"],
                "access_token": TOKEN
            }
            
        req = urllib.request.Request(
            f"https://graph.instagram.com/v21.0/{ACCOUNT_ID}/media",
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )
        res = make_request_with_retries(req)
        container_id = res["id"]
        log(f"Container created successfully! ID: {container_id}")

        if is_reel:
            log("Waiting for Instagram video encoding/processing...")
            for attempt in range(15):
                time.sleep(4)
                status_req = urllib.request.Request(
                    f"https://graph.instagram.com/v21.0/{container_id}?fields=status_code,status&access_token={TOKEN}"
                )
                s_res = make_request_with_retries(status_req)
                code = s_res.get("status_code")
                log(f"Reel Status Check {attempt+1}: {code}")
                if code == "FINISHED":
                    break
                elif code == "ERROR":
                    raise Exception(f"Instagram video encoding error: {s_res}")
        else:
            # Small safety pause for Instagram photo processing
            time.sleep(4)

        # Step 2: Publish Container
        log("Step 2: Publishing container to feed...")
        pub_payload = {
            "creation_id": container_id,
            "access_token": TOKEN
        }
        pub_req = urllib.request.Request(
            f"https://graph.instagram.com/v21.0/{ACCOUNT_ID}/media_publish",
            data=json.dumps(pub_payload).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )
        pub_res = make_request_with_retries(pub_req)
        media_id = pub_res["id"]
        log(f"Published successfully! Media ID: {media_id}")

        # Step 3: Fetch Permalink
        log("Step 3: Fetching live permalink...")
        get_req = urllib.request.Request(
            f"https://graph.instagram.com/v21.0/{media_id}?fields=permalink&access_token={TOKEN}"
        )
        info = make_request_with_retries(get_req)
        permalink = info.get("permalink")
        log(f"🎉 LIVE POST URL: {permalink}")
        return media_id, permalink
    except Exception as e:
        log(f"API ERROR: {e}")
        raise e

def check_and_publish_due_posts(wait_threshold_sec=300):
    items = load_schedule()
    now = datetime.datetime.now().astimezone()
    changed = False

    for item in items:
        if item.get("status") != "PENDING":
            continue
        sched_dt = datetime.datetime.fromisoformat(item["scheduled_time"])
        diff_sec = (sched_dt - now).total_seconds()

        # If due within the next wait_threshold_sec (e.g. 5 mins), wait until exact scheduled time
        if 0 < diff_sec <= wait_threshold_sec:
            log(f"Post [{item['product_code']}] is due in {int(diff_sec)} seconds. Waiting {int(diff_sec)}s until {sched_dt.strftime('%H:%M:%S')}...")
            time.sleep(diff_sec)
            now = datetime.datetime.now().astimezone()

        if now >= sched_dt:
            log(f"Due post detected: [{item['product_code']}] scheduled for {item['scheduled_time']} (Now is {now.isoformat()})")
            try:
                media_id, permalink = publish_item(item)
                item["status"] = "PUBLISHED"
                item["media_id"] = media_id
                item["permalink"] = permalink
                item["published_at"] = datetime.datetime.now().isoformat()
                record_live_published(item, media_id, permalink)
                changed = True
            except Exception as e:
                log(f"ERROR publishing [{item['product_code']}]: {e}")
                item["last_error"] = str(e)
                item["last_attempt"] = datetime.datetime.now().isoformat()
                changed = True

    if changed:
        save_schedule(items)

def print_status():
    items = load_schedule()
    now = datetime.datetime.now().astimezone()
    print("\n" + "="*85)
    print("THE TREND SELLER — 3-DAY AUTOMATED INSTAGRAM SCHEDULE")
    print(f"Current System Time: {now.strftime('%Y-%m-%d %H:%M:%S %Z')}")
    print("="*85)
    for idx, it in enumerate(items, 1):
        sched_dt = datetime.datetime.fromisoformat(it["scheduled_time"])
        diff = (sched_dt - now).total_seconds()
        if it["status"] == "PUBLISHED":
            status_str = f"✅ PUBLISHED ({it.get('permalink')})"
        elif diff <= 0:
            status_str = "⏳ DUE NOW (Pending Trigger)"
        else:
            hours = int(diff // 3600)
            mins = int((diff % 3600) // 60)
            status_str = f"⏰ In {hours}h {mins}m"

        print(f"#{idx:02d} | {it['day']:<16} | {sched_dt.strftime('%b %d, %I:%M %p')} | [{it['product_code']}] {it['product_name'][:28]:<28}")
        print(f"     Status: {status_str}")
        print(f"     CDN URL: {it.get('video_url') or it.get('image_url')}")
        print("-" * 85)
    print("="*85 + "\n")

def run_daemon(poll_interval_sec=60):
    log("==================================================")
    log("AUTO SCHEDULE PUBLISHER DAEMON STARTED")
    log(f"Poll interval: {poll_interval_sec}s")
    log("==================================================")
    try:
        while True:
            check_and_publish_due_posts()
            time.sleep(poll_interval_sec)
    except KeyboardInterrupt:
        log("Daemon stopped by user.")

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--status":
        print_status()
    elif len(sys.argv) > 1 and sys.argv[1] == "--daemon":
        run_daemon()
    else:
        check_and_publish_due_posts()
