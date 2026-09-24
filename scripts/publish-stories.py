import urllib.request
import json
import time
import sys

sys.stdout.reconfigure(encoding='utf-8')

TOKEN = "IGAAoQCwwUk5ZABZAFloUDFqc0Q5Ym9wU2tvbk1tdGhvb1N3Nl8ySkdXdlhCclE4R1Bqa2tJN21XN3ZA6bVdmcndrSlNHLUE3a2hubnN0Nnhlb1lRbHVaMkxoZATNvQ3UzcU1sa0ZARVHZA5RGN6a25FY3ZAEd0lNSldjeHFXQW9RcXdJTQZDZD"
ACCOUNT_ID = "17841404898221435"

# 6 Stories ready for the "Authenticity" Highlight (Featuring Official Logo)
stories = [
    {
        "name": "Story 1: Nano Banana 100% Open Parcel Policy (Official Logo)",
        "url": "https://raw.githubusercontent.com/HeroCode007/The-Trend-Seller/main/public/images/ads/story-nano-open-parcel.jpg"
    },
    {
        "name": "Story 2: Nano Banana Client Reviews & 4.9/5 Rating (Official Logo)",
        "url": "https://raw.githubusercontent.com/HeroCode007/The-Trend-Seller/main/public/images/ads/story-nano-mens-reviews.jpg"
    },
    {
        "name": "Story 3: Men's Luxury Client Reviews with Product Thumbs (Official Logo)",
        "url": "https://raw.githubusercontent.com/HeroCode007/The-Trend-Seller/main/public/images/ads/story-reviews-mens.jpg"
    },
    {
        "name": "Story 4: Women's Luxury & Gift Sets Reviews (Official Logo)",
        "url": "https://raw.githubusercontent.com/HeroCode007/The-Trend-Seller/main/public/images/ads/story-reviews-womens.jpg"
    },
    {
        "name": "Story 5: Real WhatsApp Unboxing & Client Chat Proof (Official Logo)",
        "url": "https://raw.githubusercontent.com/HeroCode007/The-Trend-Seller/main/public/images/ads/story-reviews-whatsapp.jpg"
    }
]

def publish_all_stories():
    for s in stories:
        print(f"\n==========================================")
        print(f"Publishing: {s['name']}")
        print(f"Image URL: {s['url']}")
        print(f"==========================================")

        # Step 1: Create Stories container
        payload = {
            "image_url": s["url"],
            "media_type": "STORIES",
            "access_token": TOKEN
        }
        req = urllib.request.Request(
            f"https://graph.instagram.com/v21.0/{ACCOUNT_ID}/media",
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                res = json.loads(resp.read().decode("utf-8"))
                container_id = res["id"]
                print(f"Story container created! ID: {container_id}")

            time.sleep(3)

            # Step 2: Publish Story container
            pub_payload = {
                "creation_id": container_id,
                "access_token": TOKEN
            }
            pub_req = urllib.request.Request(
                f"https://graph.instagram.com/v21.0/{ACCOUNT_ID}/media_publish",
                data=json.dumps(pub_payload).encode("utf-8"),
                headers={"Content-Type": "application/json"}
            )
            with urllib.request.urlopen(pub_req, timeout=30) as pub_resp:
                pub_res = json.loads(pub_resp.read().decode("utf-8"))
                media_id = pub_res["id"]
                print(f"🎉 STORY PUBLISHED LIVE! Story Media ID: {media_id}")
        except Exception as e:
            print(f"Error publishing {s['name']}: {e}")
            if hasattr(e, 'read'):
                print("API Details:", e.read().decode('utf-8'))

    print("\nAll 4 Authenticity Stories have been published!")

if __name__ == "__main__":
    publish_all_stories()
