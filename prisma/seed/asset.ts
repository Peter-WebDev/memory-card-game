import { Asset, Category } from '@/generated/prisma';
import { db } from '@/lib/db';

const categoryName = 'Animals';

// Use the Asset type for type-safety
const mockedAssets: Pick<Asset, 'imageUrl'>[] = [
  { imageUrl: 'https://picsum.photos/id/244/100.webp' },
  { imageUrl: 'https://picsum.photos/id/433/100.webp' },
  { imageUrl: 'https://picsum.photos/id/219/100.webp' },
  { imageUrl: 'https://picsum.photos/id/237/100.webp' },
  { imageUrl: 'https://picsum.photos/id/582/100.webp' },
  { imageUrl: 'https://picsum.photos/id/577/100.webp' },
  { imageUrl: 'https://picsum.photos/id/593/100.webp' },
  { imageUrl: 'https://picsum.photos/id/40/100.webp' },
];

export async function seedAssets() {
  console.log('Seeding assets...');

  const category: Category = await db.category.upsert({
    where: { name: categoryName },
    update: {},
    create: { name: categoryName },
  });

  for (const mockedAsset of mockedAssets) {
    await db.asset.upsert({
      where: { imageUrl: mockedAsset.imageUrl },
      update: {},
      create: {
        imageUrl: mockedAsset.imageUrl,
        categoryId: category.id,
      },
    });
  }

  console.log('Assets seeded successfully');
}
