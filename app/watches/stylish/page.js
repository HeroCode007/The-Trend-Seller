'use client';

import CategoryWatchesPage from '@/components/watches/CategoryWatchesPage';
import { getWatchCategory } from '@/lib/watchCategories';
import { stylishWatches as staticStylishWatches } from '@/lib/products';

export default function StylishWatchesPage() {
    return (
        <CategoryWatchesPage
            category={getWatchCategory('stylish')}
            staticWatches={staticStylishWatches}
        />
    );
}
