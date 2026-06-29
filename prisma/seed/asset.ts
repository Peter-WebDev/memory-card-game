import { Category } from '@/generated/prisma';
import { db } from '@/lib/db';
import { seedCategories } from './data';

// Seed every category and its assets from the static, curated lists in
// ./data. Order is preserved (categories and assets are inserted in the
// order they are declared) so the deck stays deterministic for the
// Cypress `reseed` task — see GameBoard's slice(0, 8) + duplicate logic.
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
  }

  console.log('Assets seeded successfully');
}
