import urllib.request
import urllib.parse
import json
import time
import datetime
import os
import sys

# Ensure UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RESULTS_FILE = os.path.join(BASE_DIR, "live_published_results.json")
LOG_FILE = os.path.join(BASE_DIR, "scheduler_execution.log")

TOKEN = "IGAAoQCwwUk5ZABZAFloUDFqc0Q5Ym9wU2tvbk1tdGhvb1N3Nl8ySkdXdlhCclE4R1Bqa2tJN21XN3ZA6bVdmcndrSlNHLUE3a2hubnN0Nnhlb1lRbHVaMkxoZATNvQ3UzcU1sa0ZARVHZA5RGN6a25FY3ZAEd0lNSldjeHFXQW9RcXdJTQZDZD"
ACCOUNT_ID = "17841404898221435"

REEL_ITEM = {
    "title": "TOMI Dual-Dial Minimalist Gold & Navy (Reel AD)",
    "product_code": "TTS-CW-068",
    "video_url": "https://files.catbox.moe/v09lvn.mp4",
    "caption": """Is TOMI watch ka dial aur build check karein! ⏱️✨

Sleek, minimal, aur ultra-classy wrist presence. Warm gold bezel paired with a deep midnight navy dial and stitched leather strap — perfect balance between boardroom elegance and everyday casual wear.

🔹 Case: 18k Yellow Gold-Plated Slim Round Case
🔹 Dial: Deep Midnight Navy with Sub-Dial Complication
🔹 Movement: High-Precision Japanese Quartz Movement
🔹 Strap: Ultra-Supple Stitched Black Genuine Leather
🔹 Packaging: Official Branded TOMI Presentation Box Included

💰 Special Price: Rs. 3,450 (Compare at: Rs. 4,800 — 28% OFF)
📦 Official TOMI Presentation Box
🚚 Free Cash on Delivery Nationwide • Open Parcel Verification at Doorstep

📲 Order on WhatsApp: 0334-6438806 (Quote code: TTS-CW-068)
🔗 Shop Direct Online: https://thetrendseller.com/watches/casual/tomi-dual-dial-minimalist-gold-navy

#TheTrendSeller #TOMIWatch #TOMIWatches #MinimalistWatch #MensWatchesPK #WatchesInPakistan #KarachiFashion #LahoreStyle #PakistaniMen #MensAccessoriesPK #LuxuryOnABudget #WatchReels #WatchTokPK #PakistanEcommerce #TrendingReelsPK"""
}

STATIC_ITEM = {
    "title": "TOMI Dual-Dial Minimalist Gold & Navy (Static Creative)",
    "product_code": "TTS-CW-068",
    "image_url": "https://files.catbox.moe/gyxtyx.jpg",
    "caption": """Minimalism defined in Gold & Navy. ⌚✨

The all-new TOMI Dual-Dial edition brings executive aesthetics right to your wrist. Deep midnight blue sunburst dial accented with precision gold hour markers, off-center sub-dial complication, and finished with a comfortable stitched black leather strap.

🔹 18k Gold-Plated Slim Profile Casing
🔹 Deep Midnight Navy Dial with Sub-Dial Complication
🔹 Hardened Scratch-Resistant Mineral Crystal Glass
🔹 Precision Japanese Quartz Movement
🔹 Free Official Black & Gold TOMI Gift Box

💰 Special Launch Price: Rs. 3,450
🚚 Free Nationwide Express Delivery • Cash on Delivery with 100% Parcel Checking Before Payment

📲 Order on WhatsApp: 0334-6438806 (Quote code: TTS-CW-068)
🔗 Order Online: https://thetrendseller.com/watches/casual/tomi-dual-dial-minimalist-gold-navy

#TheTrendSeller #TOMIWatch #MensStylePK #WatchesOfInstagram #PakistaniFashion #FashionPK #LahoreShopping #KarachiShopping #IslamabadGram #WatchAddictPK #ExecutiveStyle #MenFashionPakistan #WristGamePK #OOTDPakistan"""
}

def log(msg):
    ts = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{ts}] {msg}"
    print(line, flush=True)
    try:
        with open(LOG_FILE, "a", encoding="utf-8") as f:
            f.write(line + "\n")
    except Exception as e:
        print(f"Failed writing log: {e}")

def record_live_published(item, media_id, permalink):
    results = []
    if os.path.exists(RESULTS_FILE):
        try:
            with open(RESULTS_FILE, "r", encoding="utf-8") as f:
                results = json.load(f)
        except:
            results = []
    results.append({
        "title": item["title"],
        "product_code": item["product_code"],
        "media_id": media_id,
        "permalink": permalink,
        "published_at": datetime.datetime.now().isoformat()
    })
    with open(RESULTS_FILE, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)

def publish_reel(item):
    log(f"🎬 Initiating REEL publication for [{item['product_code']}] {item['title']}...")
    
    # Step 1: Create Container
    payload = {
        "media_type": "REELS",
        "video_url": item["video_url"],
        "caption": item["caption"],
        "share_to_feed": True,
        "access_token": TOKEN
    }
    req = urllib.request.Request(
        f"https://graph.instagram.com/v21.0/{ACCOUNT_ID}/media",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req, timeout=40) as resp:
        res = json.loads(resp.read().decode("utf-8"))
        container_id = res["id"]
        log(f"Reel Container created! ID: {container_id}")

    # Step 2: Poll for video processing completion
    log("Waiting for Instagram video processing...")
    for attempt in range(15):
        time.sleep(4)
        status_req = urllib.request.Request(
            f"https://graph.instagram.com/v21.0/{container_id}?fields=status_code,status&access_token={TOKEN}"
        )
        with urllib.request.urlopen(status_req, timeout=20) as s_resp:
            s_res = json.loads(s_resp.read().decode("utf-8"))
            code = s_res.get("status_code")
            log(f"Reel Status Check {attempt+1}: {code}")
            if code == "FINISHED":
                break
            elif code == "ERROR":
                raise Exception(f"Instagram video encoding error: {s_res}")

    # Step 3: Publish Container
    log("Publishing Reel container to live feed...")
    pub_payload = {
        "creation_id": container_id,
        "access_token": TOKEN
    }
    pub_req = urllib.request.Request(
        f"https://graph.instagram.com/v21.0/{ACCOUNT_ID}/media_publish",
        data=json.dumps(pub_payload).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(pub_req, timeout=40) as pub_resp:
        pub_res = json.loads(pub_resp.read().decode("utf-8"))
        media_id = pub_res["id"]
        log(f"Reel Published Successfully! Media ID: {media_id}")

    # Step 4: Fetch Permalink
    get_req = urllib.request.Request(
        f"https://graph.instagram.com/v21.0/{media_id}?fields=permalink&access_token={TOKEN}"
    )
    with urllib.request.urlopen(get_req, timeout=20) as p_resp:
        p_res = json.loads(p_resp.read().decode("utf-8"))
        permalink = p_res.get("permalink")
        log(f"🎉 LIVE REEL URL: {permalink}")
        record_live_published(item, media_id, permalink)
        return media_id, permalink

def publish_static(item):
    log(f"📸 Initiating STATIC IMAGE publication for [{item['product_code']}] {item['title']}...")
    
    # Step 1: Create Container
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
    with urllib.request.urlopen(req, timeout=40) as resp:
        res = json.loads(resp.read().decode("utf-8"))
        container_id = res["id"]
        log(f"Static Container created! ID: {container_id}")

    time.sleep(3)

    # Step 2: Publish Container
    log("Publishing static container to feed...")
    pub_payload = {
        "creation_id": container_id,
        "access_token": TOKEN
    }
    pub_req = urllib.request.Request(
        f"https://graph.instagram.com/v21.0/{ACCOUNT_ID}/media_publish",
        data=json.dumps(pub_payload).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(pub_req, timeout=40) as pub_resp:
        pub_res = json.loads(pub_resp.read().decode("utf-8"))
        media_id = pub_res["id"]
        log(f"Static Post Published Successfully! Media ID: {media_id}")

    # Step 3: Fetch Permalink
    get_req = urllib.request.Request(
        f"https://graph.instagram.com/v21.0/{media_id}?fields=permalink&access_token={TOKEN}"
    )
    with urllib.request.urlopen(get_req, timeout=20) as p_resp:
        p_res = json.loads(p_resp.read().decode("utf-8"))
        permalink = p_res.get("permalink")
        log(f"🎉 LIVE POST URL: {permalink}")
        record_live_published(item, media_id, permalink)
        return media_id, permalink

if __name__ == "__main__":
    action = sys.argv[1] if len(sys.argv) > 1 else "all"
    if action in ("reel", "all"):
        publish_reel(REEL_ITEM)
        time.sleep(5)
    if action in ("static", "all"):
        publish_static(STATIC_ITEM)
    print("\n✅ All requested campaign assets published successfully!")
