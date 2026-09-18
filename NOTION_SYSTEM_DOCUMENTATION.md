# ⌚ The Trend Seller — Automated Marketing & Instagram Publishing System

> **Status:** 🟢 Active / Running  
> **Last Updated:** September 17, 2026  
> **Repository:** `The-Trend-Seller`  
> **Target Platform:** Instagram Feed (@thetrendseller) via Meta Graph API v21.0  
> **Timezone:** Asia/Karachi (PKT / UTC+5)  

---

## 📌 Executive Summary

This document serves as the complete operational handbook and architecture documentation for **The Trend Seller's Automated Instagram Content & Publishing Engine**. The system generates brand-aligned luxury watch ad creatives, maintains a deduplication registry of catalog items, hosts assets on public CDNs, and autonomously publishes scheduled posts to Instagram without manual intervention.

---

## 🎨 1. Brand Template Standards

All feed creatives strictly adhere to The Trend Seller official visual template:

| Element | Specification |
|---|---|
| **Aspect Ratio** | 1:1 Square (1024 × 1024 px) |
| **Product Staging** | Strapped around a plush black velvet watch cushion/pillow |
| **Surface & Backdrop** | Angled 3/4 pose resting on a natural dark slate slab over warm dark mahogany wood |
| **Lighting** | Moody luxury ambient illumination with warm amber rim light on wood and slate edges |
| **Framing** | Fine metallic gold hairline border inset around the full perimeter |
| **Header (Top-Left)** | Metallic gold circular `TS` monogram crest + `THE TREND SELLER` + `Premium Mens Accessories` |
| **Header (Top-Right)** | Clean, negative dark space (no distracting tags or badges) |
| **Footer (Bottom-Left)** | Bold gold serif typography (Brand & Model name) + 1-2 lines of pipe-delimited specs (`Feature 1 \| Feature 2 \| Feature 3`) |
| **Footer (Bottom-Right)** | Rounded gold gradient pill button with bold text: `ORDER NOW` |
| **Price Tag Policy** | No discount or price boxes on creatives (maintained clean, timeless, and luxury-first) |

---

## 🗂️ 2. Catalog Deduplication Registry

To prevent fatigue and duplicate posts on the Instagram feed, every product is cross-referenced against the live Instagram account history:

### 🚫 Already Published Products (Blacklisted from Reposting)
* `TTS-PW-035` — TAG Heuer Aquaracer Calibre 5 GMT *(Published Sep 17)*
* `TTS-CW-039` — Tissot PRX Powermatic 80 Ice Blue *(Published Sep 17)*
* `TTS-PW-062` — Rolex Datejust Two-Tone Blue Diamond *(Published Sep 15)*
* `TTS-PW-061` — Omega Seamaster Aqua Terra Worldtimer *(Published Sep 14 & 15)*
* `TTS-PW-063` — Iced-Out Skeleton Chronograph Diamond *(Published Sep 15)*
* `TTS-SW-056` — Cartier A-Grade Tank Roman Dial *(Published Sep 15)*
* `TTS-CW-064` — Seastar Integrated PRX Two-Tone Blue *(Published Sep 14)*
* `TTS-SW-060` — Bestwin Two-Tone Royal Blue Diamond *(Published Sep 13)*
* `TTS-WW-067` — OLIYA Diamond Emerald-Cut Luxury *(Published Sep 13)*
* `TTS-WL-021` — Executive Leather Card Holder *(Published Sep 14)*
* `TTS-BT-019` — Reversible Formal Leather Dress Belt *(Published Sep 14)*

### ✅ Fresh Unposted Products Selected & Generated
* `TTS-PW-036` — Audemars Piguet Royal Oak Rose Gold
* `TTS-PW-057` — Rado True Square Automatic Black Ceramic
* `TTS-PW-002` — Rolex Cosmograph Daytona Black Dial
* `TTS-WW-054` — Cartier Panthère Gold Edition
* `TTS-WW-066` — IEKE Vintage Tank Burgundy & Gold
* `TTS-WW-053` — Truworth Baguette Crystal Luxury (Gold & Silver)

---

## 🖼️ 3. Active Creatives & CDN Asset Inventory

| Product Code | Watch Name | Category | CDN Public Image URL | Local File Path |
|---|---|---|---|---|
| `TTS-PW-036` | Audemars Piguet Royal Oak Rose Gold | Men's Premium | `https://files.catbox.moe/t29zo4.jpg` | `public/images/ads/tts-pw-036-ap-royaloak-rosegold.jpg` |
| `TTS-PW-057` | Rado True Square Black Ceramic | Men's Premium | `https://files.catbox.moe/cd4lks.jpg` | `public/images/ads/tts-pw-057-rado-true-square.jpg` |
| `TTS-PW-002` | Rolex Cosmograph Daytona Black | Men's Premium | `https://files.catbox.moe/ck2ows.jpg` | `public/images/ads/tts-pw-002-rolex-daytona-black.jpg` |
| `TTS-WW-054` | Cartier Panthère Gold Edition | Women's Luxury | `https://files.catbox.moe/3nyu2r.jpg` | `public/images/ads/tts-ww-054-cartier-panthere-gold.jpg` |
| `TTS-WW-066` | IEKE Vintage Tank Burgundy & Gold | Women's Luxury | `https://files.catbox.moe/5tuko0.jpg` | `public/images/ads/tts-ww-066-ieke-vintage-tank-burgundy.jpg` |
| `TTS-WW-053` | Truworth Baguette Crystal (Gold) | Women's Luxury | `https://files.catbox.moe/ghcrah.jpg` | `public/images/ads/tts-ww-053-truworth-baguette-gold.jpg` |
| `TTS-WW-053` | Truworth Baguette Crystal (Silver) | Women's Luxury | `https://files.catbox.moe/o3fk3e.jpg` | `public/images/ads/tts-ww-053-truworth-baguette-silver.jpg` |

---

## 📅 4. Automated 3-Day Posting Schedule

Posts are timed for peak audience engagement in Pakistan (**14:00 PKT** afternoon window and **20:30 PKT** prime evening window):

```
Friday, Sep 18
├── 14:00 PKT ─ [TTS-PW-036] Audemars Piguet Royal Oak Rose Gold (Men's)
└── 20:30 PKT ─ [TTS-WW-054] Cartier Panthère Gold Edition (Women's)

Saturday, Sep 19
├── 14:00 PKT ─ [TTS-PW-057] Rado True Square Black Ceramic (Men's)
└── 20:30 PKT ─ [TTS-WW-066] IEKE Vintage Tank Burgundy & Gold (Women's)

Sunday, Sep 20
├── 14:00 PKT ─ [TTS-PW-002] Rolex Cosmograph Daytona Black Dial (Men's)
└── 20:30 PKT ─ [TTS-WW-053] Truworth Baguette Crystal Luxury Gold (Women's)
```

---

## ⚙️ 5. Technical Architecture & File Structure

```
The-Trend-Seller/
├── scheduled_posts.json           # Master queue with target timestamps, CDN URLs, and captions
├── live_published_results.json    # Live log of all published Instagram media IDs & permalinks
├── scheduler_execution.log        # Real-time timestamped audit log of daemon executions
├── start-auto-publisher.bat       # Windows 1-click batch launcher for background service
├── scripts/
│   ├── auto-schedule-publisher.py # Core Python daemon engine (checks schedule & calls Meta API)
│   ├── upload-all-catbox.py       # CDN uploader for fresh ad images
│   ├── print-recent-instagram.py  # Instagram live account auditor via Graph API
│   └── check-instagram-posts.py   # Feed crawler and deduplication helper
└── public/images/ads/             # Local master directory of 1024x1024 brand ad graphics
```

### Automation Workflow
1. **Daemon Polling:** `auto-schedule-publisher.py` wakes every 60 seconds and inspects `scheduled_posts.json`.
2. **Trigger Condition:** If `current_time >= scheduled_time` and `status == "PENDING"`.
3. **Step 1 (Media Container):** Sends `POST https://graph.instagram.com/v21.0/{ACCOUNT_ID}/media` with CDN image URL and formatted caption.
4. **Step 2 (Feed Publish):** Sends `POST https://graph.instagram.com/v21.0/{ACCOUNT_ID}/media_publish` with `creation_id`.
5. **Step 3 (Verification & Log):** Fetches live permalink (`https://www.instagram.com/p/...`), updates `scheduled_posts.json` to `"PUBLISHED"`, logs to `live_published_results.json`, and records entry in `scheduler_execution.log`.

---

## 📱 6. Mobile Remote Control Roadmap

To control and monitor this system from a smartphone, the planned architecture consists of:

### Component A: Mobile Web Hub (`/admin/marketing`)
* Integrated into the Next.js admin dashboard.
* Responsive dark-luxury mobile view.
* Live countdown timers, touch toggle switches, and 1-tap `[Post Immediately]` buttons.
* Upload photos directly from phone camera/gallery to queue.

### Component B: Telegram Remote Bot (`@TrendSellerAdminBot`)
* Instant native push notifications to phone 15 minutes before any scheduled post goes live.
* Interactive inline buttons: `[ ✅ Publish Now ]`, `[ ⏸️ Delay 2 Hours ]`, `[ ❌ Skip ]`.
* Commands: `/status`, `/queue`, `/pause`, `/resume`, `/post <id>`.

---

## 🛠️ 7. Operational Cheat-Sheet

* **View live schedule and countdowns:**
  ```powershell
  python scripts/auto-schedule-publisher.py --status
  ```
* **Manually run or restart background daemon:**
  ```powershell
  python scripts/auto-schedule-publisher.py --daemon
  ```
  *(Or double-click `start-auto-publisher.bat`)*
* **Check Instagram feed history:**
  ```powershell
  python scripts/print-recent-instagram.py
  ```
