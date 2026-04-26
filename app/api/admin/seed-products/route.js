// app/api/admin/seed-products/route.js
// Browser-based seeding - visit /api/admin/seed-products?action=seed

import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';

// All your existing products from lib/products.js
const allProducts = [
    // Premium Watches
    { id: 1, slug: 'royal-square-titanium', name: 'SKMEI-Royal Square Titanium', productCode: 'TTS-PW-001', price: 6899, image: '/images/SKEMI-1.jpg', description: 'The Royal Square Titanium represents the pinnacle of modern watchmaking.', features: ['Titanium case', 'Titanium bezel', 'Titanium bracelet', 'Titanium crown'], category: 'premium-watches', inStock: true },
    { id: 2, slug: 'rolex-daytona-leather', name: 'Rolex Daytona Black-Dial', productCode: 'TTS-PW-002', price: 4899, image: '/images/RLXB-1.png', description: 'A legendary chronograph crafted for professional racing enthusiasts.', features: ['Chronograph functionality', 'Tachymetric bezel', 'Oystersteel or precious metal case', 'Rolex Caliber 4130 automatic movement'], category: 'premium-watches', inStock: true },
    { id: 3, slug: 'rolex-daytona-silver', name: 'Rolex Daytona Silver', productCode: 'TTS-PW-003', price: 4499, image: '/images/RLX-1.png', description: 'Where technical prowess meets breathtaking beauty.', features: ['Diamond bezel', 'Chronograph function', 'Sapphire crystal', 'Alligator strap'], category: 'premium-watches', inStock: false },
    { id: 4, slug: 'FM-diamond-collection', name: 'Franck Muller Diamond Collection', productCode: 'TTS-PW-004', price: 4499, image: '/images/FM.jpg', description: 'A transparent celebration of mechanical artistry.', features: ['Skeletonized movement', 'Hand-assembled', 'Diamond-accents', 'Power reserve'], category: 'premium-watches', inStock: true },
    { id: 5, slug: 'Arabic-Aura', name: 'Black Arabic Aura', productCode: 'TTS-PW-005', price: 3199, image: '/images/BlackAura1.jpg', description: 'The Arabic Aura Watch – All Black Edition blends cultural elegance with modern minimalism.', features: ['Premium lightweight fiber body', 'Bold Arabic numeral dial', 'All-black aesthetic design', 'Ultra-lightweight 44g build'], category: 'premium-watches', inStock: true },
    { id: 6, slug: 'rolex-datejust-classic', name: 'Rolex Datejust', productCode: 'TTS-PW-006', price: 4699, image: '/images/rlx-dj.PNG', description: 'An icon that needs no introduction.', features: ['Oyster-steel case and bracelet', 'Fluted bezel', 'Automatic self-winding movement', 'Cyclops lens over the date'], category: 'premium-watches', inStock: true },
    { id: 7, slug: 'forches-blue-diamond', name: 'Forches Blue Diamond', productCode: 'TTS-PW-007', price: 4599, image: '/images/P1.png', description: 'Mediterranean elegance captured in time.', features: ['Alloy steel case and bracelet', 'Blue sunburst dial with Roman numerals', 'Day and date display window', 'Diamond-style hour markers'], category: 'premium-watches', inStock: true },
    { id: 8, slug: 'rolex-datejust-gold', name: 'Rolex Datejust Gold', productCode: 'TTS-PW-008', price: 4699, image: '/images/P2.png', description: 'The perfect marriage of steel strength and gold prestige.', features: ['Two-tone oystersteel and gold bracelet', 'Fluted gold bezel', 'Diamond hour markers on blue dial', 'Cyclops date window'], category: 'premium-watches', inStock: true },
    { id: 9, slug: 'rolex-datejust-blue-steel', name: 'Rolex Datejust Blue Steel', productCode: 'TTS-PW-009', price: 4799, image: '/images/P3.png', description: 'Uncompromising luxury in full gold regalia.', features: ['Full gold-plated finish', 'Champagne gold dial with diamond markers', 'Oyster-style gold bracelet', 'Cyclops date window'], category: 'premium-watches', inStock: true },

    // Casual Watches
    { id: 10, slug: 'casio-a159w-digital-watch', name: 'Casio A159W Digital Watch', productCode: 'CASIO-A159W', price: 1799, image: '/images/CA159-2.jpg', description: 'A timeless classic that defined digital watch style.', features: ['Stainless steel case', 'Digital LCD display', 'LED backlight', 'Alarm & stopwatch'], category: 'casual-watches', inStock: false },
    { id: 31, slug: 'rolex-yacht', name: 'Rolex Yacht-Master Black', productCode: 'RLX-YT100', price: 4899, image: '/images/RLX-Yacht.PNG', description: 'Inspired by the spirit of open waters.', features: ['40mm stainless steel case', 'Black and rose-gold dial', 'Reliable quartz movement', 'Premium silicon strap'], category: 'casual-watches', inStock: true },
    { id: 11, slug: 'hublot-big-bang-meca-10', name: 'Hublot Big Bang Meca-10', productCode: 'TTS-CW-010', price: 4199, image: '/images/C1.png', description: 'Engineering meets adventure.', features: ['Titanium case', 'Sapphire crystal glass', 'Visible mechanical elements', 'Industrial design'], category: 'casual-watches', inStock: true },
    { id: 12, slug: 'hublot-classic-fusion-casual', name: 'Hublot Classic Fusion', productCode: 'TTS-CW-011', price: 3999, image: '/images/C2.png', description: 'Versatility redefined for the active lifestyle.', features: ['Titanium case', 'Sapphire crystal', 'Lightweight design', 'Everyday versatility'], category: 'casual-watches', inStock: true },
    { id: 13, slug: 'pierre-cardin-epinettes', name: 'Pierre Cardin Épinettes', productCode: 'TTS-CW-012', price: 4499, image: '/images/C3.png', description: 'French fashion legacy meets Swiss precision.', features: ['Titanium case', 'Sapphire crystal', 'French design heritage', 'Architectural dial'], category: 'casual-watches', inStock: true },
    { id: 14, slug: 'universe-point-two-tone-silver', name: 'Universe Point with a Two Tone Silver', productCode: 'TTS-CW-013', price: 4400, image: '/images/C4.png', description: 'The best of both worlds in perfect harmony.', features: ['Stainless steel case', 'Sapphire crystal', 'Two-tone design', 'Versatile styling'], category: 'casual-watches', inStock: true },

    // Stylish Watches
    { id: 16, slug: 'patek-philippe-nautilus', name: 'Patek Philippe Nautilus', productCode: 'TTS-SW-015', price: 4100, image: '/images/PP-Nautilus.png', description: 'Legendary design that transcends trends.', features: ['Stainless steel case', 'White dial with luminescent markers', 'Brown leather strap with folding clasp'], category: 'stylish-watches', inStock: true },
    { id: 17, slug: 'rm-35', name: 'Richard Mille-TSAR', productCode: 'TTS-SW-016', price: 4400, image: '/images/RM2.jpg', description: 'A bold fusion of modern engineering and avant-garde design.', features: ['High-polish black tonneau-shaped case', 'Blue-tinted skeleton dial', 'Exposed mechanical movement architecture'], category: 'stylish-watches', inStock: true },
    { id: 18, slug: 'hublot-chrono', name: 'Hublot Blue Dial Chrono', productCode: 'TTS-SW-017', price: 3299, image: '/images/HB-Chrono.png', description: 'For those who dare to be different.', features: ['Geometric design', 'Premium materials', 'Unique styling', 'Fashion-forward'], category: 'stylish-watches', inStock: true },
    { id: 19, slug: 'patek-philippe-nautilus-classic', name: 'Patek Philippe Nautilus Classic', productCode: 'TTS-SW-018', price: 4699, image: '/images/S5.jpg', description: 'Timeless charm with contemporary reliability.', features: ['Stainless steel or precious metal case', 'White dial with luminescent hands and markers', 'Brown leather strap with folding clasp'], category: 'stylish-watches', inStock: true },

    // Belts
    { id: 20, slug: 'reversible-dress-belt', name: 'Reversible Dress Belt', productCode: 'TTS-BT-019', price: 1899, image: '/images/Belt2.png', description: 'Versatility engineered into every inch.', features: ['Reversible design', 'Rotating buckle', 'Dual-tone finish', 'Premium leather'], category: 'belts', inStock: true },
    { id: 21, slug: 'pure-leather-formal-belt', name: 'Pure Leather Formal Belt', productCode: 'TTS-BT-020', price: 2100, image: '/images/Belt3.png', description: 'The foundation of any refined wardrobe.', features: ['Genuine leather', 'Polished metal buckle', 'Adjustable length', 'Classic formal design'], category: 'belts', inStock: true },

    // Wallets
    { id: 22, slug: 'brown-leather-card-holder', name: 'Brown Leather Card Holder', productCode: 'TTS-WL-021', price: 1799, image: '/images/CB-Front.png', images: ['/images/Open.png', '/images/CB-Front.png'], description: 'Minimalism that makes sense.', features: ['Genuine brown leather', 'Slim pocket-friendly profile', 'Holds 6–8 cards', 'Reinforced stitching'], category: 'wallets', inStock: true },
    { id: 23, slug: 'minimalist-card-holder', name: 'Minimalist Card Holder', productCode: 'TTS-WL-022', price: 1799, image: '/images/Wallet2.png', images: ['/images/M1.png', '/images/M2.png'], description: 'Pure leather craftsmanship in elegant black.', features: ['Pure leather construction', 'Matte black finish', 'Holds 6–8 cards'], category: 'wallets', inStock: true },
    { id: 24, slug: 'medium-style-wallet', name: 'Medium Style Wallet', productCode: 'TTS-WL-023', price: 2299, image: '/images/Medi.jpg', images: ['/images/MS1.png', '/images/MS2.png', '/images/DBW.png'], description: 'Smart organization in a refined package.', features: ['2 main compartments', 'Card organizer', 'Cash pouch', 'Soft leather exterior'], category: 'wallets', inStock: true },
    { id: 25, slug: 'gucci-card-holder', name: 'Gucci Card Holder', productCode: 'TTS-WL-024', price: 1799, image: '/images/Gucci.png', images: ['/images/GC2.png', '/images/GC1.png'], description: 'Italian luxury heritage in your pocket.', features: ['Elegant design', 'Full-grain leather', 'Handcrafted details', 'RFID secure'], category: 'wallets', inStock: true },
    { id: 26, slug: 'long-wallet', name: 'Long Wallet', productCode: 'TTS-WL-025', price: 2499, image: '/images/LW-F.jpg', images: ['/images/LW.jpg', '/images/LW2.png'], description: 'Refined organization for the well-prepared.', features: ['Full-grain leather construction', 'Extended bill section', '12 card slots'], category: 'wallets', inStock: true },
    { id: 27, slug: 'compact-medium-wallet', name: 'Compact Medium Wallet', productCode: 'TTS-WL-026', price: 2370, image: '/images/medium.png', images: ['/images/MB-C.png', '/images/MB-Open.png', '/images/MB-D.png'], description: 'The Goldilocks of wallets.', features: ['Compact yet spacious', 'RFID protection', 'Durable leather', 'Smooth lining'], category: 'wallets', inStock: true },
    { id: 28, slug: 'triplet-brown-wallet', name: 'Triplet Brown', productCode: 'TTS-WL-027', price: 2499, image: '/images/TS-F.png', images: ['/images/TS-1.png', '/images/TS-2.png', '/images/TS-3.png'], description: 'Security meets sophistication with 360° protection.', features: ['360° zip enclosure', 'Coin pocket', 'Premium leather', 'RFID shield'], category: 'wallets', inStock: true },
    { id: 29, slug: 'crocodile-style-wallet', name: 'Crocodile Style Wallet', productCode: 'TTS-WL-028', price: 2150, image: '/images/Wallet4.png', images: ['/images/CS1.png', '/images/CS2.png'], description: 'Exotic texture with everyday practicality.', features: ['Crocodile-embossed finish', 'Genuine leather', 'Multiple card slots'], category: 'wallets', inStock: true },
    { id: 30, slug: 'leather-bi-fold-wallet', name: 'Leather Bi-Fold Wallet', productCode: 'TTS-WL-029', price: 2200, image: '/images/RG.jpg', images: ['/images/RG1.jpg', '/images/RG2.jpg', '/images/RG3.jpg'], description: 'Timeless brown leather in classic bi-fold configuration.', features: ['Genuine brown leather', 'Bi-fold design', 'Multiple card slots'], category: 'wallets', inStock: true },
];

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const force = searchParams.get('force') === 'true';

    try {
        await connectDB();

        // Check current status
        const existingCount = await Product.countDocuments();

        if (action === 'status') {
            return NextResponse.json({
                success: true,
                message: 'Database status',
                existingProducts: existingCount,
                productsToSeed: allProducts.length
            });
        }

        if (action === 'seed') {
            // If products exist and not forcing, return error
            if (existingCount > 0 && !force) {
                return NextResponse.json({
                    success: false,
                    error: `Database already has ${existingCount} products. Use ?action=seed&force=true to delete and re-seed.`,
                    existingProducts: existingCount
                }, { status: 400 });
            }

            // Delete existing if force mode
            if (force && existingCount > 0) {
                await Product.deleteMany({});
            }

            // Seed products
            let successCount = 0;
            let errors = [];

            for (const product of allProducts) {
                try {
                    await Product.create({
                        name: product.name,
                        slug: product.slug,
                        productCode: product.productCode,
                        price: product.price,
                        image: product.image,
                        images: product.images || [],
                        description: product.description,
                        features: product.features || [],
                        category: product.category,
                        inStock: product.inStock !== false,
                        stockQuantity: product.inStock !== false ? 10 : 0,
                        isActive: true,
                        isFeatured: false,
                        sortOrder: product.id
                    });
                    successCount++;
                } catch (err) {
                    errors.push({ name: product.name, error: err.message });
                }
            }

            const finalCount = await Product.countDocuments();

            return NextResponse.json({
                success: true,
                message: `Seeded ${successCount} products successfully!`,
                seeded: successCount,
                errors: errors.length > 0 ? errors : undefined,
                totalInDatabase: finalCount
            });
        }

        // Default: show help
        return NextResponse.json({
            success: true,
            message: 'Product Seeding API',
            endpoints: {
                status: '/api/admin/seed-products?action=status',
                seed: '/api/admin/seed-products?action=seed',
                forceSeed: '/api/admin/seed-products?action=seed&force=true'
            },
            currentStatus: {
                existingProducts: existingCount,
                productsToSeed: allProducts.length
            }
        });

    } catch (error) {
        console.error('Seed error:', error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}