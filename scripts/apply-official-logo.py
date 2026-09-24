import os
import shutil
from PIL import Image, ImageDraw, ImageFont

def get_font(name, size):
    paths = [
        f"C:/Windows/Fonts/{name}.ttf",
        f"C:/Windows/Fonts/{name}.otf",
        f"C:/Windows/Fonts/georgiab.ttf",
        f"C:/Windows/Fonts/segoeuib.ttf",
        f"C:/Windows/Fonts/arial.ttf"
    ]
    for p in paths:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except:
                pass
    return ImageFont.load_default()

# Load official logo and monogram
logo_trans = Image.open("public/images/official-logo-transparent.png").convert("RGBA")
mono_trans = Image.open("public/images/official-monogram-transparent.png").convert("RGBA")

# ==============================================================================
# 1. GENERATE OFFICIAL "AUTHENTICITY" HIGHLIGHT COVER (1080x1080)
# ==============================================================================
def create_official_highlight_cover():
    print("Creating official Highlight Cover...")
    # Base circular background from AI generated luxury laurel cover
    ai_cover_path = r"C:\Users\user\.gemini\antigravity-ide\brain\92676b39-28d1-45a4-88e8-48d7e054b2f3\authenticity_highlight_cover_1790253823877.jpg"
    base = Image.open(ai_cover_path).convert("RGBA")
    w, h = base.size
    
    # We want to replace the shield in the center with the OFFICIAL interlocking T-S monogram!
    # Center is (w//2, h//2) ~ (512, 512)
    # The shield is roughly within radius 180 of the center.
    # Let's create a black circle mask with soft gradient to cover the inner shield
    draw = ImageDraw.Draw(base)
    cx, cy = w // 2, h // 2
    
    # Soft black velvet patch over inner shield
    r_patch = 160
    for r in range(r_patch, 0, -2):
        draw.ellipse([cx - r, cy - r + 15, cx + r, cy + r + 15], fill=(12, 10, 8, 255))
        
    # Scale and paste official monogram in exact center
    mono_size = 280
    mono_scaled = mono_trans.resize((mono_size, int(mono_size * mono_trans.height / mono_trans.width)), Image.Resampling.LANCZOS)
    mw, mh = mono_scaled.size
    base.paste(mono_scaled, (cx - mw // 2, cy - mh // 2 + 10), mono_scaled)
    
    # Text below: "AUTHENTICITY"
    font_auth = get_font("georgiab", 44)
    # Add subtle text shadow and text
    draw.text((cx + 2, cy + 242), "AUTHENTICITY", font=font_auth, fill=(20, 15, 10), anchor="mm")
    draw.text((cx, cy + 240), "AUTHENTICITY", font=font_auth, fill=(240, 210, 140), anchor="mm")
    
    out_path = "public/images/ads/highlight-cover-authenticity.jpg"
    base.convert("RGB").save(out_path, quality=95)
    shutil.copyfile(out_path, "public/images/instagram/highlight-cover-authenticity.jpg")
    print(f"Official Highlight Cover saved: {out_path}")

# ==============================================================================
# 2. UPDATE NANO BANANA STORY 1 (OPEN PARCEL) WITH OFFICIAL LOGO
# ==============================================================================
def update_nano_story_1():
    print("Updating Nano Banana Story 1 with official logo...")
    src = r"C:\Users\user\.gemini\antigravity-ide\brain\92676b39-28d1-45a4-88e8-48d7e054b2f3\story_nano_open_parcel_1790254679529.jpg"
    im = Image.open(src).convert("RGBA")
    w, h = im.size
    draw = ImageDraw.Draw(im)
    
    # Cover the AI crest (y: 50 to 220, inside border x: 50 to 718)
    draw.rectangle([50, 48, w - 50, 222], fill=(14, 13, 9, 255))
    
    # Scale official logo
    target_w = 420
    target_h = int(target_w * logo_trans.height / logo_trans.width)
    logo_scaled = logo_trans.resize((target_w, target_h), Image.Resampling.LANCZOS)
    
    # Paste centered
    im.paste(logo_scaled, ((w - target_w) // 2, 45), logo_scaled)
    
    out_path = "public/images/ads/story-nano-open-parcel.jpg"
    im.convert("RGB").save(out_path, quality=95)
    shutil.copyfile(out_path, "public/images/instagram/story-nano-open-parcel.jpg")
    print(f"Nano Story 1 updated: {out_path}")

# ==============================================================================
# 3. UPDATE NANO BANANA STORY 2 (MENS REVIEWS) WITH OFFICIAL LOGO
# ==============================================================================
def update_nano_story_2():
    print("Updating Nano Banana Story 2 with official logo...")
    src = r"C:\Users\user\.gemini\antigravity-ide\brain\92676b39-28d1-45a4-88e8-48d7e054b2f3\story_nano_mens_reviews_1790254719295.jpg"
    im = Image.open(src).convert("RGBA")
    w, h = im.size
    draw = ImageDraw.Draw(im)
    
    # Cover the AI crest (y: 50 to 180, inside border x: 50 to 718)
    draw.rectangle([50, 48, w - 50, 185], fill=(14, 13, 9, 255))
    
    # Scale official logo
    target_w = 380
    target_h = int(target_w * logo_trans.height / logo_trans.width)
    logo_scaled = logo_trans.resize((target_w, target_h), Image.Resampling.LANCZOS)
    
    im.paste(logo_scaled, ((w - target_w) // 2, 40), logo_scaled)
    
    out_path = "public/images/ads/story-nano-mens-reviews.jpg"
    im.convert("RGB").save(out_path, quality=95)
    shutil.copyfile(out_path, "public/images/instagram/story-nano-mens-reviews.jpg")
    print(f"Nano Story 2 updated: {out_path}")

# ==============================================================================
# 4. UPDATE HIGH-RES 1080x1920 REVIEW STORIES WITH OFFICIAL LOGO
# ==============================================================================
def update_hires_review_stories():
    print("Updating 1080x1920 Review Stories with official logo...")
    # Re-run generate-story-reviews.py with official logo instead of generic logo-icon.png
    # Let's inspect scripts/generate-story-reviews.py and replace the header with the official logo lockup!
    
create_official_highlight_cover()
update_nano_story_1()
update_nano_story_2()
print("All official logo applications completed!")
