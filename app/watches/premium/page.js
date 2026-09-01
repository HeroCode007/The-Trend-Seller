'use client';

import CategoryWatchesPage from '@/components/watches/CategoryWatchesPage';
import { getWatchCategory } from '@/lib/watchCategories';
import { premiumWatches as staticPremiumWatches } from '@/lib/products';

export default function PremiumWatchesPage() {
    return (
        <CategoryWatchesPage
            category={getWatchCategory('premium')}
            staticWatches={staticPremiumWatches}
        />
    );
}
