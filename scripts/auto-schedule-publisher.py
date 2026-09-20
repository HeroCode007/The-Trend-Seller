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

TOKEN = os.environ.get(
    "IG_ACCESS_TOKEN", 
    "IGAAoQCwwUk5ZABZAFloUDFqc0Q5Ym9wU2tvbk1tdGhvb1N3Nl8ySkdXdlhCclE4R1Bqa2tJN21XN3ZA6bVdmcndrSlNHLUE3a2hubnN0Nnhlb1lRbHVaMkxoZATNvQ3UzcU1sa0ZARVHZA5RGN6a25FY3ZAEd0lNSldjeHFXQW9RcXdJTQZDZD"
)
ACCOUNT_ID = os.environ.get("IG_ACCOUNT_ID", "17841404898221435")

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

def publish_item(item):
    log(f"Initiating publication for [{item['product_code']}] {item['product_name']}...")
    try:
        # Step 1: Create Container
        log("Step 1: Creating Instagram media container...")
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
        with urllib.request.urlopen(req, timeout=45) as resp:
            res = json.loads(resp.read().decode("utf-8"))
            container_id = res["id"]
            log(f"Container created successfully! ID: {container_id}")

        # Small safety pause for Instagram asset processing
        time.sleep(3)

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
        with urllib.request.urlopen(pub_req, timeout=45) as pub_resp:
            pub_res = json.loads(pub_resp.read().decode("utf-8"))
            media_id = pub_res["id"]
            log(f"Published successfully! Media ID: {media_id}")

        # Step 3: Fetch Permalink
        log("Step 3: Fetching live permalink...")
        get_req = urllib.request.Request(
            f"https://graph.instagram.com/v21.0/{media_id}?fields=permalink&access_token={TOKEN}"
        )
        with urllib.request.urlopen(get_req, timeout=45) as get_resp:
            info = json.loads(get_resp.read().decode("utf-8"))
            permalink = info.get("permalink")
            log(f"🎉 LIVE POST URL: {permalink}")
            return media_id, permalink
    except urllib.error.HTTPError as e:
        err_body = e.read().decode('utf-8') if hasattr(e, 'read') else str(e)
        log(f"HTTP ERROR {e.code}: {err_body}")
        raise Exception(f"HTTP {e.code}: {err_body}")
    except Exception as e:
        log(f"API ERROR: {e}")
        raise e

def check_and_publish_due_posts():
    items = load_schedule()
    now = datetime.datetime.now().astimezone()
    changed = False

    for item in items:
        if item.get("status") != "PENDING":
            continue
        sched_dt = datetime.datetime.fromisoformat(item["scheduled_time"])
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
        print(f"     CDN URL: {it['image_url']}")
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
