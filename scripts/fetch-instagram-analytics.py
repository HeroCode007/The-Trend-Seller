import urllib.request
import urllib.parse
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

TOKEN = "IGAAoQCwwUk5ZABZAFloUDFqc0Q5Ym9wU2tvbk1tdGhvb1N3Nl8ySkdXdlhCclE4R1Bqa2tJN21XN3ZA6bVdmcndrSlNHLUE3a2hubnN0Nnhlb1lRbHVaMkxoZATNvQ3UzcU1sa0ZARVHZA5RGN6a25FY3ZAEd0lNSldjeHFXQW9RcXdJTQZDZD"
ACCOUNT_ID = "17841404898221435"

def get_json(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=20) as resp:
        return json.loads(resp.read().decode('utf-8'))

print("=" * 80)
print("       THE TREND SELLER — INSTAGRAM PROFESSIONAL DASHBOARD REPORT")
print("=" * 80)

# 1. Profile Overview
profile_url = f"https://graph.instagram.com/v21.0/{ACCOUNT_ID}?fields=id,username,name,account_type,media_count,followers_count,follows_count&access_token={TOKEN}"
try:
    p = get_json(profile_url)
    print("\n[👤 PROFILE OVERVIEW]")
    print(f" • Handle         : @{p.get('username')}")
    print(f" • Business Name  : {p.get('name')}")
    print(f" • Account Type   : {p.get('account_type')}")
    print(f" • Total Followers: {p.get('followers_count'):,}")
    print(f" • Following      : {p.get('follows_count')}")
    print(f" • Total Posts    : {p.get('media_count')}")
except Exception as e:
    print(f"Profile error: {e}")

# 2. Account Insights (Professional Dashboard)
print("\n[📈 PROFESSIONAL DASHBOARD METRICS]")
try:
    u_28d = f"https://graph.instagram.com/v21.0/{ACCOUNT_ID}/insights?metric=reach&period=days_28&access_token={TOKEN}"
    r_28d = get_json(u_28d)
    val_28d = r_28d['data'][0]['values'][-1]['value']
    print(f" • 28-Day Total Reach      : {val_28d:,} Unique Accounts")
except Exception as e:
    print(f" • 28-Day Total Reach      : Error ({e})")

try:
    u_day = f"https://graph.instagram.com/v21.0/{ACCOUNT_ID}/insights?metric=reach&period=day&access_token={TOKEN}"
    r_day = get_json(u_day)
    val_day_prev = r_day['data'][0]['values'][-2]['value']
    val_day_now = r_day['data'][0]['values'][-1]['value']
    print(f" • Sep 23 Daily Reach      : {val_day_prev} Accounts (Tissot PRX Reel Launch)")
    print(f" • Sep 24 Daily Reach      : {val_day_now} Accounts (Ongoing)")
except Exception as e:
    pass

# 3. Media Items Performance
print("\n[🎥 VIDEO REELS PERFORMANCE (VIEWS & WATCH TIME)]")
media_url = f"https://graph.instagram.com/v21.0/{ACCOUNT_ID}/media?fields=id,caption,media_type,like_count,comments_count,permalink,timestamp&limit=15&access_token={TOKEN}"
try:
    m_data = get_json(media_url)
    items = m_data.get("data", [])
    
    reels = [m for m in items if m.get("media_type") == "VIDEO"]
    posts = [m for m in items if m.get("media_type") != "VIDEO"]

    for idx, r in enumerate(reels, 1):
        mid = r["id"]
        cap = (r.get("caption") or "").split("\n")[0][:45]
        link = r.get("permalink", "")
        ts = r.get("timestamp", "")[:10]
        likes = r.get("like_count", 0)
        comments = r.get("comments_count", 0)

        # Insights
        views = "N/A"
        reach = "N/A"
        shares = "N/A"
        watch_time_sec = "N/A"
        avg_watch_time_sec = "N/A"

        for met in ['views', 'reach', 'shares', 'ig_reels_video_view_total_time', 'ig_reels_avg_watch_time']:
            try:
                iu = f"https://graph.instagram.com/v21.0/{mid}/insights?metric={met}&access_token={TOKEN}"
                ires = get_json(iu)
                v = ires['data'][0]['values'][0]['value']
                if met == 'views': views = v
                elif met == 'reach': reach = v
                elif met == 'shares': shares = v
                elif met == 'ig_reels_video_view_total_time': watch_time_sec = f"{v / 1000:.1f}s"
                elif met == 'ig_reels_avg_watch_time': avg_watch_time_sec = f"{v / 1000:.1f}s"
            except:
                pass

        print(f"#{idx:02d} | Date: {ts} | {cap}")
        print(f"     👀 Views (Plays)   : {views} plays")
        print(f"     👥 Unique Reach    : {reach} accounts")
        print(f"     ⏱️ Total Watch Time: {watch_time_sec} (Avg: {avg_watch_time_sec}/viewer)")
        print(f"     ❤️ Likes: {likes} | 💬 Comments: {comments} | ↗️ Shares: {shares}")
        print(f"     🔗 Link: {link}")
        print("-" * 80)

    print("\n[🖼️ STATIC PHOTO CREATIVES PERFORMANCE]")
    for idx, p in enumerate(posts[:8], 1):
        mid = p["id"]
        cap = (p.get("caption") or "").split("\n")[0][:45]
        link = p.get("permalink", "")
        ts = p.get("timestamp", "")[:10]
        likes = p.get("like_count", 0)
        comments = p.get("comments_count", 0)

        reach = "N/A"
        shares = "N/A"
        for met in ['reach', 'shares']:
            try:
                iu = f"https://graph.instagram.com/v21.0/{mid}/insights?metric={met}&access_token={TOKEN}"
                ires = get_json(iu)
                v = ires['data'][0]['values'][0]['value']
                if met == 'reach': reach = v
                elif met == 'shares': shares = v
            except:
                pass

        print(f"#{idx:02d} | Date: {ts} | {cap}")
        print(f"     👥 Reach: {reach} | ❤️ Likes: {likes} | 💬 Comments: {comments} | ↗️ Shares: {shares}")
        print(f"     🔗 Link: {link}")
        print("-" * 80)

except Exception as e:
    print(f"Error fetching media list: {e}")

print("=" * 80)
