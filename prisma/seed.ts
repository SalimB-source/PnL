import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const collectionsData = [
    { name: 'Apparel', slug: 'apparel', description: 'Clothing and wearables' },
    { name: 'Electronics', slug: 'electronics', description: 'Gadgets and devices' },
    { name: 'Home', slug: 'home', description: 'Home and living' },
    { name: 'Accessories', slug: 'accessories', description: 'Bags, hats, and more' },
  ];

  for (const c of collectionsData) {
    const collection = await prisma.collection.create({ data: c });
    for (let i = 1; i <= 4; i++) {
      const title = `${collection.name} Product ${i}`;
      const slug = `${collection.slug}-product-${i}`;
      const priceCents = 1999 + i * 500;
      const product = await prisma.product.create({
        data: {
          title,
          slug,
          description: `Sample description for ${title}`,
          priceCents,
          inventory: 10 + i,
          collectionId: collection.id,
          images: {
            create: [
              { url: `https://picsum.photos/seed/${collection.slug}-${i}/800/800`, alt: title },
            ],
          },
        },
        include: { images: true },
      });
      console.log('Created product', product.title);
    }
  }

  console.log('Seeding finished');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
