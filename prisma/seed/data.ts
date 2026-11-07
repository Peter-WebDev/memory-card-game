// Static, curated asset URLs per category — used by the seed so that
// seeding (and the Cypress `reseed` task) stays deterministic and offline.
//
// Live fetching from the source APIs is a separate concern (refresh path),
// kept out of the seed so E2E tests never hit the network. Each list holds
// exactly 8 entries: the game picks 8 assets and doubles them into 16 cards.
//
// Sources (all free / keyless):
//   Dogs        -> https://dog.ceo/dog-api/        (images.dog.ceo CDN)
//   Cats        -> https://thecatapi.com/          (cdn2.thecatapi.com CDN)
//   Food & Drink-> self-hosted SVGs in public/icons/food (Material Design
//                  Icons, Apache 2.0, from the @mdi/svg package)

export type SeedCategory = {
  name: string;
  imageUrls: string[];
};

// Path to a self-hosted food icon served from public/icons/food.
const icon = (name: string) => `/icons/food/${name}.svg`;

export const seedCategories: SeedCategory[] = [
  {
    name: 'Dogs',
    imageUrls: [
      'https://images.dog.ceo/breeds/australian-shepherd/pepper.jpg',
      'https://images.dog.ceo/breeds/puggle/IMG_162320.jpg',
      'https://images.dog.ceo/breeds/buhund-norwegian/hakon3.jpg',
      'https://images.dog.ceo/breeds/hound-blood/n02088466_9383.jpg',
      'https://images.dog.ceo/breeds/whippet/n02091134_2664.jpg',
      'https://images.dog.ceo/breeds/bulldog-boston/n02096585_1753.jpg',
      'https://images.dog.ceo/breeds/collie-border/n02106166_402.jpg',
      'https://images.dog.ceo/breeds/corgi-cardigan/n02113186_7220.jpg',
    ],
  },
  {
    name: 'Cats',
    imageUrls: [
      'https://cdn2.thecatapi.com/images/7au.jpg',
      'https://cdn2.thecatapi.com/images/7cn.jpg',
      'https://cdn2.thecatapi.com/images/an4.jpg',
      'https://cdn2.thecatapi.com/images/bsc.jpg',
      'https://cdn2.thecatapi.com/images/MTcyMjg4Mg.jpg',
      'https://cdn2.thecatapi.com/images/MTczODA3NQ.jpg',
      'https://cdn2.thecatapi.com/images/iY76694gN.jpg',
      'https://cdn2.thecatapi.com/images/njaF1fyqI.jpg',
    ],
  },
  {
    name: 'Food & Drink',
    imageUrls: [
      icon('food-apple'),
      icon('hamburger'),
      icon('pizza'),
      icon('coffee'),
      icon('cupcake'),
      icon('ice-cream'),
      icon('beer'),
      icon('fruit-grapes'),
    ],
  },
];
