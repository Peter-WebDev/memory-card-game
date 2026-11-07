import { Category } from '@/generated/prisma';
import { db } from '@/lib/db';
import { seedCategories } from './data';

// Seed every category and its assets from the static, curated lists in
// ./data. Order is preserved (categories and assets are inserted in the
// order they are declared) so the deck stays deterministic for the
// Cypress `reseed` task — see GameBoard's slice(0, 8) + duplicate logic.
// The seed is the single source of truth: assets in a seeded category that
// are not in the list are deleted.
export async function seedAssets() {
  console.log('Seeding assets...');

  for (const { name, imageUrls } of seedCategories) {
    const category: Category = await db.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });

    for (const imageUrl of imageUrls) {
      await db.asset.upsert({
        where: { imageUrl },
        update: {},
        create: {
          imageUrl,
          categoryId: category.id,
        },
      });
    }

    // Prune stale assets: upsert only adds, so URLs that were removed or
    // replaced in ./data would otherwise linger and end up in the game.
    const { count } = await db.asset.deleteMany({
      where: { categoryId: category.id, imageUrl: { notIn: imageUrls } },
    });
    if (count > 0) {
      console.log(`Removed ${count} stale asset(s) from "${name}"`);
    }
  }

  console.log('Assets seeded successfully');
}
