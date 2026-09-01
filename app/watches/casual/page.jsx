'use client';

import CategoryWatchesPage from '@/components/watches/CategoryWatchesPage';
import { getWatchCategory } from '@/lib/watchCategories';
import { casualWatches as staticCasualWatches } from '@/lib/products';

export default function CasualWatchesPage() {
    return (
        <CategoryWatchesPage
            category={getWatchCategory('casual')}
            staticWatches={staticCasualWatches}
        />
    );
}
