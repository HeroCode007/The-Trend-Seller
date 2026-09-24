import os
import math
import shutil
from PIL import Image, ImageDraw, ImageFont

WIDTH = 1080
HEIGHT = 1920

def get_font(name, size):
    paths = [
        f"C:/Windows/Fonts/{name}.ttf",
        f"C:/Windows/Fonts/{name}.otf",
        f"C:/Windows/Fonts/segoeui.ttf",
        f"C:/Windows/Fonts/arial.ttf"
    ]
    for p in paths:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except:
                pass
    return ImageFont.load_default()

def draw_rounded_rect(draw, bbox, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(bbox, radius=radius, fill=fill, outline=outline, width=width)

def draw_star(draw, cx, cy, r_outer, r_inner=None, fill=(255, 215, 0)):
    if r_inner is None:
        r_inner = r_outer * 0.42
    pts = []
    angle = -math.pi / 2
    step = math.pi / 5
    for i in range(10):
        r = r_outer if i % 2 == 0 else r_inner
        pts.append((cx + r * math.cos(angle), cy + r * math.sin(angle)))
        angle += step
    draw.polygon(pts, fill=fill)

def draw_star_row(draw, start_x, cy, count=5, r=12, gap=26, fill=(255, 215, 0)):
    for i in range(count):
        draw_star(draw, start_x + i * gap, cy, r_outer=r, fill=fill)

def draw_checkmark(draw, cx, cy, size=12, fill=(110, 240, 150), width=3):
    pts = [
        (cx - size * 0.6, cy),
        (cx - size * 0.1, cy + size * 0.5),
        (cx + size * 0.8, cy - size * 0.6)
    ]
    draw.line(pts, fill=fill, width=width)

def draw_shield_icon(draw, cx, cy, size=18, fill=(255, 215, 0), width=2):
    pts = [
        (cx, cy - size),
        (cx + size * 0.8, cy - size * 0.6),
        (cx + size * 0.7, cy + size * 0.3),
        (cx, cy + size),
        (cx - size * 0.7, cy + size * 0.3),
        (cx - size * 0.8, cy - size * 0.6)
    ]
    draw.polygon(pts, outline=fill, width=width)
    draw_checkmark(draw, cx, cy + 1, size=size * 0.5, fill=fill, width=2)

def draw_luxury_frame(draw, w, h):
    margin = 40
    gold_dim = (140, 110, 50, 180)
    gold_bright = (220, 185, 100, 255)
    
    draw.rectangle([margin, margin, w - margin, h - margin], outline=gold_dim, width=2)
    draw.rectangle([margin + 12, margin + 12, w - margin - 12, h - margin - 12], outline=(90, 75, 35, 150), width=1)
    
    corner_len = 35
    for cx, cy, dx, dy in [
        (margin, margin, 1, 1),
        (w - margin, margin, -1, 1),
        (margin, h - margin, 1, -1),
        (w - margin, h - margin, -1, -1)
    ]:
        draw.line([(cx, cy), (cx + dx * corner_len, cy)], fill=gold_bright, width=3)
        draw.line([(cx, cy), (cx, cy + dy * corner_len)], fill=gold_bright, width=3)

def create_base_canvas():
    img = Image.new("RGBA", (WIDTH, HEIGHT), (10, 14, 20, 255))
    draw = ImageDraw.Draw(img)
    
    for y in range(HEIGHT):
        ratio = y / HEIGHT
        if ratio < 0.5:
            r = int(12 + 10 * (1 - ratio * 2))
            g = int(16 + 10 * (1 - ratio * 2))
            b = int(24 + 14 * (1 - ratio * 2))
        else:
            r = int(12 + 8 * ((ratio - 0.5) * 2))
            g = int(14 + 6 * ((ratio - 0.5) * 2))
            b = int(20 + 8 * ((ratio - 0.5) * 2))
        draw.line([(0, y), (WIDTH, y)], fill=(r, g, b, 255))
        
    draw_luxury_frame(draw, WIDTH, HEIGHT)
    return img, draw

# ==========================================
# 1. Men's Luxury Story
# ==========================================
def render_mens_story():
    img, draw = create_base_canvas()
    
    font_brand = get_font("georgiab", 46)
    font_sub = get_font("segoeuib", 22)
    font_tag = get_font("segoeuib", 20)
    font_name = get_font("segoeuib", 26)
    font_meta = get_font("segoeui", 20)
    font_body = get_font("segoeui", 23)
    font_footer = get_font("segoeuib", 24)
    font_cta = get_font("segoeuib", 28)
    
    # Logo
    try:
        logo = Image.open("public/logo-icon.png").convert("RGBA")
        logo = logo.resize((100, 93), Image.Resampling.LANCZOS)
        img.paste(logo, ((WIDTH - 100) // 2, 85), logo)
    except Exception as e:
        print("Logo error:", e)
        
    draw.text((WIDTH // 2, 200), "THE TREND SELLER", font=font_brand, fill=(235, 205, 130), anchor="mm")
    draw.text((WIDTH // 2, 245), "AUTHENTICITY & CLIENT EXPERIENCES", font=font_sub, fill=(180, 150, 95), anchor="mm")
    
    # Rating Banner
    draw_rounded_rect(draw, [180, 280, WIDTH - 180, 335], radius=28, fill=(20, 26, 38, 240), outline=(210, 175, 95), width=2)
    draw_star_row(draw, 220, 307, count=5, r=10, gap=22, fill=(255, 215, 0))
    draw.text((360, 307), "4.9 / 5.0 RATED (1,200+ BUYERS)", font=font_tag, fill=(245, 220, 140), anchor="lm")
    
    reviews = [
        {
            "name": "Muhammad Saad",
            "city": "Islamabad (G-11)",
            "product": "Tissot PRX Powermatic 80 — Steel",
            "text": "\"Bhai parcel rider ke samne khol ke check kiya, build quality aur finishing 10/10 hai! Waffle dial looks unbelievable in person and the integrated bracelet has a heavy, solid luxury feel. TCS delivered in 48 hours.\"",
            "thumb": "public/images/tissot-prx-silver-cream-raw.jpg"
        },
        {
            "name": "Mohammad Ahsan",
            "city": "Karachi (DHA Phase 6)",
            "product": "TOMI Dual-Dial Gold & Navy",
            "text": "\"The navy blue dial with gold casing looks stunning. Finish is clean and leather strap is super soft. Looks way more expensive than Rs. 3,450. Packaging was double bubble-wrapped inside a luxury gift box.\"",
            "thumb": "public/images/tomi-dual-dial-packshot.jpg"
        },
        {
            "name": "Fahad Tariq",
            "city": "Karachi (Defence)",
            "product": "Audemars Piguet Royal Oak / Day-Date",
            "text": "\"Heavy weight, the gold tone is deep and premium—definitely not brassy or cheap looking. The bezel screws and double clasp lock with a firm click. Allowed to check before paying. Real head turner!\"",
            "thumb": "public/images/seastar-prx-twotone-blue-raw.jpg"
        }
    ]
    
    card_y = 370
    card_h = 360
    card_gap = 35
    
    for r in reviews:
        card_box = [80, card_y, WIDTH - 80, card_y + card_h]
        draw_rounded_rect(draw, card_box, radius=22, fill=(18, 24, 34, 255), outline=(75, 62, 35, 200), width=2)
        
        thumb_placed = False
        if os.path.exists(r["thumb"]):
            try:
                t_img = Image.open(r["thumb"]).convert("RGBA")
                t_img = t_img.resize((120, 120), Image.Resampling.LANCZOS)
                mask = Image.new("L", (120, 120), 0)
                m_draw = ImageDraw.Draw(mask)
                m_draw.rounded_rectangle([0, 0, 120, 120], radius=18, fill=255)
                img.paste(t_img, (110, card_y + 30), mask)
                draw.rounded_rectangle([110, card_y + 30, 230, card_y + 150], radius=18, outline=(180, 150, 80), width=2)
                thumb_placed = True
            except Exception as e:
                print("Thumb error:", e)
                
        text_x = 255 if thumb_placed else 120
        
        # Vector Stars
        draw_star_row(draw, text_x + 12, card_y + 44, count=5, r=10, gap=22, fill=(255, 215, 0))
        
        # Verified Badge
        badge_x = WIDTH - 280
        draw_rounded_rect(draw, [badge_x, card_y + 30, WIDTH - 110, card_y + 68], radius=14, fill=(15, 45, 25), outline=(40, 180, 90), width=1)
        draw_checkmark(draw, badge_x + 22, card_y + 49, size=9, fill=(110, 240, 150), width=2)
        draw.text((badge_x + 36, card_y + 49), "VERIFIED BUYER", font=font_meta, fill=(110, 240, 150), anchor="lm")
        
        draw.text((text_x, card_y + 75), f"{r['name']} — {r['city']}", font=font_name, fill=(255, 255, 255))
        draw.text((text_x, card_y + 112), f"Purchased: {r['product']}", font=font_meta, fill=(210, 175, 100))
        
        words = r["text"].split()
        lines = []
        cur_line = []
        for w in words:
            test_line = " ".join(cur_line + [w])
            bbox = draw.textbbox((0, 0), test_line, font=font_body)
            if bbox[2] - bbox[0] > (WIDTH - 160 - (text_x - 80)):
                lines.append(" ".join(cur_line))
                cur_line = [w]
            else:
                cur_line.append(w)
        if cur_line:
            lines.append(" ".join(cur_line))
            
        quote_y = card_y + 165
        for l in lines[:5]:
            draw.text((115, quote_y), l, font=font_body, fill=(225, 230, 240))
            quote_y += 33
            
        card_y += card_h + card_gap
        
    # Bottom Trust Section
    trust_y = 1580
    draw_rounded_rect(draw, [80, trust_y, WIDTH - 80, trust_y + 110], radius=20, fill=(16, 22, 32), outline=(190, 155, 80), width=2)
    draw_shield_icon(draw, 140, trust_y + 42, size=16, fill=(255, 225, 140), width=2)
    draw.text((WIDTH // 2 + 15, trust_y + 35), "100% OPEN PARCEL INSPECTION ALLOWED", font=font_footer, fill=(255, 225, 140), anchor="mm")
    draw.text((WIDTH // 2, trust_y + 75), "Doorstep Inspection Before Payment • Trax & TCS Nationwide COD", font=font_meta, fill=(180, 190, 205), anchor="mm")
    
    # WhatsApp Button
    cta_y = 1720
    draw_rounded_rect(draw, [100, cta_y, WIDTH - 100, cta_y + 95], radius=48, fill=(212, 175, 55), outline=(255, 240, 180), width=2)
    draw.text((WIDTH // 2, cta_y + 47), "ORDER ON WHATSAPP: 0334-6438806", font=font_cta, fill=(12, 16, 22), anchor="mm")
    
    out_path = "public/images/ads/story-reviews-mens.jpg"
    img.convert("RGB").save(out_path, quality=95)
    shutil.copyfile(out_path, "public/images/instagram/story-reviews-mens.jpg")
    print(f"Rendered: {out_path}")

# ==========================================
# 2. Women's Luxury Story
# ==========================================
def render_womens_story():
    img, draw = create_base_canvas()
    
    font_brand = get_font("georgiab", 46)
    font_sub = get_font("segoeuib", 22)
    font_tag = get_font("segoeuib", 20)
    font_name = get_font("segoeuib", 26)
    font_meta = get_font("segoeui", 20)
    font_body = get_font("segoeui", 23)
    font_footer = get_font("segoeuib", 24)
    font_cta = get_font("segoeuib", 28)
    
    try:
        logo = Image.open("public/logo-icon.png").convert("RGBA")
        logo = logo.resize((100, 93), Image.Resampling.LANCZOS)
        img.paste(logo, ((WIDTH - 100) // 2, 85), logo)
    except:
        pass
        
    draw.text((WIDTH // 2, 200), "THE TREND SELLER", font=font_brand, fill=(235, 205, 130), anchor="mm")
    draw.text((WIDTH // 2, 245), "WOMEN'S LUXURY & GIFT REVIEWS", font=font_sub, fill=(180, 150, 95), anchor="mm")
    
    draw_rounded_rect(draw, [180, 280, WIDTH - 180, 335], radius=28, fill=(20, 26, 38, 240), outline=(210, 175, 95), width=2)
    draw_star_row(draw, 220, 307, count=5, r=10, gap=22, fill=(255, 215, 0))
    draw.text((360, 307), "VERIFIED CLIENT TESTIMONIALS", font=font_tag, fill=(245, 220, 140), anchor="lm")
    
    reviews = [
        {
            "name": "Marium Siddiqui",
            "city": "Karachi (Clifton)",
            "product": "OLIYA Diamond Emerald-Cut Luxury",
            "text": "\"Got this yesterday! The emerald cut glass sparkles so nicely in indoor lighting and the deep green dial is breathtaking. My mom loved it so much she asked me to order one for her too. Very dainty and comfortable on wrist.\"",
            "thumb": "public/images/oliya-emerald-cut-emerald-silver-studio.jpg"
        },
        {
            "name": "Fatima Noor",
            "city": "Peshawar",
            "product": "Cartier Panthère Gold Edition",
            "text": "\"The brick-link bracelet feels like soft silk on the wrist. The blue spinel crown adds that classic Cartier charm. Wore it for an engagement event and received so many compliments. 10/10 recommended!\"",
            "thumb": "public/images/cartier-panthere-gold-studio.jpg"
        },
        {
            "name": "Adeel & Hira Murtaza",
            "city": "Rawalpindi",
            "product": "Timeless Together Couple Combo",
            "text": "\"Ordered this couple set for our 3rd wedding anniversary. Both watches came together in a premium velvet gift box. Gents watch has great weight and ladies piece is super sleek. Huge value for money!\"",
            "thumb": "public/images/timeless-together-couple-combo.jpg"
        }
    ]
    
    card_y = 370
    card_h = 360
    card_gap = 35
    
    for r in reviews:
        card_box = [80, card_y, WIDTH - 80, card_y + card_h]
        draw_rounded_rect(draw, card_box, radius=22, fill=(18, 24, 34, 255), outline=(75, 62, 35, 200), width=2)
        
        thumb_placed = False
        if os.path.exists(r["thumb"]):
            try:
                t_img = Image.open(r["thumb"]).convert("RGBA")
                t_img = t_img.resize((120, 120), Image.Resampling.LANCZOS)
                mask = Image.new("L", (120, 120), 0)
                m_draw = ImageDraw.Draw(mask)
                m_draw.rounded_rectangle([0, 0, 120, 120], radius=18, fill=255)
                img.paste(t_img, (110, card_y + 30), mask)
                draw.rounded_rectangle([110, card_y + 30, 230, card_y + 150], radius=18, outline=(180, 150, 80), width=2)
                thumb_placed = True
            except Exception as e:
                print("Thumb error:", e)
                
        text_x = 255 if thumb_placed else 120
        
        draw_star_row(draw, text_x + 12, card_y + 44, count=5, r=10, gap=22, fill=(255, 215, 0))
        
        badge_x = WIDTH - 280
        draw_rounded_rect(draw, [badge_x, card_y + 30, WIDTH - 110, card_y + 68], radius=14, fill=(15, 45, 25), outline=(40, 180, 90), width=1)
        draw_checkmark(draw, badge_x + 22, card_y + 49, size=9, fill=(110, 240, 150), width=2)
        draw.text((badge_x + 36, card_y + 49), "VERIFIED BUYER", font=font_meta, fill=(110, 240, 150), anchor="lm")
        
        draw.text((text_x, card_y + 75), f"{r['name']} — {r['city']}", font=font_name, fill=(255, 255, 255))
        draw.text((text_x, card_y + 112), f"Purchased: {r['product']}", font=font_meta, fill=(210, 175, 100))
        
        words = r["text"].split()
        lines = []
        cur_line = []
        for w in words:
            test_line = " ".join(cur_line + [w])
            bbox = draw.textbbox((0, 0), test_line, font=font_body)
            if bbox[2] - bbox[0] > (WIDTH - 160 - (text_x - 80)):
                lines.append(" ".join(cur_line))
                cur_line = [w]
            else:
                cur_line.append(w)
        if cur_line:
            lines.append(" ".join(cur_line))
            
        quote_y = card_y + 165
        for l in lines[:5]:
            draw.text((115, quote_y), l, font=font_body, fill=(225, 230, 240))
            quote_y += 33
            
        card_y += card_h + card_gap
        
    trust_y = 1580
    draw_rounded_rect(draw, [80, trust_y, WIDTH - 80, trust_y + 110], radius=20, fill=(16, 22, 32), outline=(190, 155, 80), width=2)
    draw_shield_icon(draw, 140, trust_y + 42, size=16, fill=(255, 225, 140), width=2)
    draw.text((WIDTH // 2 + 15, trust_y + 35), "100% QUALITY GUARANTEE & EASY RETURN", font=font_footer, fill=(255, 225, 140), anchor="mm")
    draw.text((WIDTH // 2, trust_y + 75), "Open Parcel Check at Delivery • Free Replacement for Any Defect", font=font_meta, fill=(180, 190, 205), anchor="mm")
    
    cta_y = 1720
    draw_rounded_rect(draw, [100, cta_y, WIDTH - 100, cta_y + 95], radius=48, fill=(212, 175, 55), outline=(255, 240, 180), width=2)
    draw.text((WIDTH // 2, cta_y + 47), "ORDER ON WHATSAPP: 0334-6438806", font=font_cta, fill=(12, 16, 22), anchor="mm")
    
    out_path = "public/images/ads/story-reviews-womens.jpg"
    img.convert("RGB").save(out_path, quality=95)
    shutil.copyfile(out_path, "public/images/instagram/story-reviews-womens.jpg")
    print(f"Rendered: {out_path}")

# ==========================================
# 3. WhatsApp Doorstep Unboxing & Chat Proof
# ==========================================
def render_whatsapp_story():
    img, draw = create_base_canvas()
    
    font_brand = get_font("georgiab", 46)
    font_sub = get_font("segoeuib", 22)
    font_tag = get_font("segoeuib", 20)
    font_sender = get_font("segoeuib", 24)
    font_chat = get_font("segoeui", 23)
    font_time = get_font("segoeui", 17)
    font_footer = get_font("segoeuib", 24)
    font_meta = get_font("segoeui", 20)
    font_cta = get_font("segoeuib", 28)
    
    try:
        logo = Image.open("public/logo-icon.png").convert("RGBA")
        logo = logo.resize((100, 93), Image.Resampling.LANCZOS)
        img.paste(logo, ((WIDTH - 100) // 2, 85), logo)
    except:
        pass
        
    draw.text((WIDTH // 2, 200), "THE TREND SELLER", font=font_brand, fill=(235, 205, 130), anchor="mm")
    draw.text((WIDTH // 2, 245), "AUTHENTICITY & DOORSTEP DELIVERY PROOF", font=font_sub, fill=(180, 150, 95), anchor="mm")
    
    draw_rounded_rect(draw, [180, 280, WIDTH - 180, 335], radius=28, fill=(20, 26, 38, 240), outline=(210, 175, 95), width=2)
    draw_shield_icon(draw, 220, 307, size=14, fill=(255, 215, 0), width=2)
    draw.text((360, 307), "REAL WHATSAPP CLIENT FEEDBACK", font=font_tag, fill=(245, 220, 140), anchor="lm")
    
    # WhatsApp Chat Cards
    chat_cards = [
        {
            "sender": "Buyer: Dr. Arsalan (Karachi)",
            "incoming": True,
            "text": "AoA bhai! Watch just received via Trax. Rider opened the flyer before payment as promised. The dial weight and packaging is unbelievable! Thank you so much!",
            "time": "02:14 PM"
        },
        {
            "sender": "The Trend Seller Support",
            "incoming": False,
            "text": "Walaikum Assalam Dr. Arsalan! Thank you so much for trusting The Trend Seller. Wear it in the best of health!",
            "time": "02:16 PM"
        },
        {
            "sender": "Buyer: Hamza Farooq (Lahore)",
            "incoming": True,
            "text": "Salam! Received my Tissot PRX. Genuinely impressed by the waffle dial texture. 100% authentic as shown in the Instagram reel. Sending order for my cousin now.",
            "time": "05:42 PM"
        },
        {
            "sender": "The Trend Seller Support",
            "incoming": False,
            "text": "Much appreciated Hamza! Always dedicated to 100% open parcel transparency for our clients across Pakistan. Thank you!",
            "time": "05:45 PM"
        }
    ]
    
    # Outer chat container
    chat_box = [80, 370, WIDTH - 80, 1540]
    draw_rounded_rect(draw, chat_box, radius=24, fill=(14, 20, 28, 255), outline=(75, 62, 35, 200), width=2)
    
    # WhatsApp Header bar inside container
    draw_rounded_rect(draw, [82, 372, WIDTH - 82, 455], radius=22, fill=(20, 32, 42, 255))
    draw.rectangle([82, 430, WIDTH - 82, 455], fill=(20, 32, 42, 255))
    # Green dot
    draw.ellipse([115, 405, 131, 421], fill=(37, 211, 102))
    draw.text((145, 413), "WhatsApp Official Client Verification • 0334-6438806", font=font_tag, fill=(240, 245, 255), anchor="lm")
    
    bubble_y = 485
    for c in chat_cards:
        if c["incoming"]:
            # Incoming bubble (Left-aligned, dark slate)
            b_box = [110, bubble_y, WIDTH - 180, bubble_y + 195]
            draw_rounded_rect(draw, b_box, radius=18, fill=(24, 34, 46), outline=(45, 65, 88), width=1)
            draw.text((135, bubble_y + 25), c["sender"], font=font_sender, fill=(100, 200, 255))
            
            # Text wrapping
            words = c["text"].split()
            lines = []
            cur = []
            for w in words:
                test = " ".join(cur + [w])
                if draw.textbbox((0, 0), test, font=font_chat)[2] > (WIDTH - 340):
                    lines.append(" ".join(cur))
                    cur = [w]
                else:
                    cur.append(w)
            if cur: lines.append(" ".join(cur))
            
            line_y = bubble_y + 60
            for l in lines[:3]:
                draw.text((135, line_y), l, font=font_chat, fill=(240, 245, 250))
                line_y += 32
                
            draw.text((WIDTH - 210, bubble_y + 172), c["time"], font=font_time, fill=(150, 165, 185), anchor="rm")
            bubble_y += 225
        else:
            # Outgoing bubble (Right-aligned, dark emerald)
            b_box = [180, bubble_y, WIDTH - 110, bubble_y + 180]
            draw_rounded_rect(draw, b_box, radius=18, fill=(15, 46, 35), outline=(35, 110, 75), width=1)
            draw.text((205, bubble_y + 25), c["sender"], font=font_sender, fill=(110, 240, 160))
            
            words = c["text"].split()
            lines = []
            cur = []
            for w in words:
                test = " ".join(cur + [w])
                if draw.textbbox((0, 0), test, font=font_chat)[2] > (WIDTH - 340):
                    lines.append(" ".join(cur))
                    cur = [w]
                else:
                    cur.append(w)
            if cur: lines.append(" ".join(cur))
            
            line_y = bubble_y + 60
            for l in lines[:3]:
                draw.text((205, line_y), l, font=font_chat, fill=(235, 245, 240))
                line_y += 32
                
            # Double checkmark
            draw_checkmark(draw, WIDTH - 165, bubble_y + 158, size=8, fill=(80, 200, 255), width=2)
            draw_checkmark(draw, WIDTH - 158, bubble_y + 158, size=8, fill=(80, 200, 255), width=2)
            draw.text((WIDTH - 180, bubble_y + 158), c["time"], font=font_time, fill=(150, 195, 175), anchor="rm")
            bubble_y += 215
            
    # Bottom Trust Section
    trust_y = 1580
    draw_rounded_rect(draw, [80, trust_y, WIDTH - 80, trust_y + 110], radius=20, fill=(16, 22, 32), outline=(190, 155, 80), width=2)
    draw_shield_icon(draw, 140, trust_y + 42, size=16, fill=(255, 225, 140), width=2)
    draw.text((WIDTH // 2 + 15, trust_y + 35), "100% OPEN PARCEL INSPECTION ALLOWED", font=font_footer, fill=(255, 225, 140), anchor="mm")
    draw.text((WIDTH // 2, trust_y + 75), "Doorstep Inspection Before Payment • Trax & TCS Nationwide COD", font=font_meta, fill=(180, 190, 205), anchor="mm")
    
    # WhatsApp Button
    cta_y = 1720
    draw_rounded_rect(draw, [100, cta_y, WIDTH - 100, cta_y + 95], radius=48, fill=(212, 175, 55), outline=(255, 240, 180), width=2)
    draw.text((WIDTH // 2, cta_y + 47), "ORDER ON WHATSAPP: 0334-6438806", font=font_cta, fill=(12, 16, 22), anchor="mm")
    
    out_path = "public/images/ads/story-reviews-whatsapp.jpg"
    img.convert("RGB").save(out_path, quality=95)
    shutil.copyfile(out_path, "public/images/instagram/story-reviews-whatsapp.jpg")
    print(f"Rendered: {out_path}")

render_mens_story()
render_womens_story()
render_whatsapp_story()
