import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.admin.upsert({
    where: { email: 'admin@grandzone.com' },
    update: {},
    create: {
      email: 'admin@grandzone.com',
      password: hashedPassword,
      name: 'GrandZone Admin'
    }
  });
  console.log('Admin created: admin@grandzone.com / admin123');

  // Create categories
  const categoryNames = [
    'Chargers', 'Fast Chargers', 'Type-C Cable', 'Lightning Cable',
    'Micro USB Cable', 'Power Bank', 'Earbuds', 'Bluetooth Speaker',
    'Neckband', 'Smart Watch', 'Phone Cover', 'Tempered Glass',
    'Car Charger', 'Mobile Stand', 'Tripod', 'Ring Light',
    'Memory Card', 'Pendrive', 'Laptop Accessories', 'Perfume',
    'Wallet', 'Bag', 'Bottle'
  ];

  const categories: Record<string, string> = {};
  for (const name of categoryNames) {
    const cat = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name }
    });
    categories[name] = cat.id;
  }
  console.log(`${categoryNames.length} categories created.`);

  // Sample products
  const sampleProducts = [
    { name: '20W Fast Charging Adapter', category: 'Fast Chargers', mrp: 999, price: 499, stock: 50, brand: 'GrandZone' },
    { name: 'Type-C to Type-C Cable 1m', category: 'Type-C Cable', mrp: 499, price: 249, stock: 100, brand: 'GrandZone' },
    { name: 'Lightning Cable for iPhone', category: 'Lightning Cable', mrp: 599, price: 299, stock: 80, brand: 'GrandZone' },
    { name: '10000mAh Power Bank', category: 'Power Bank', mrp: 1999, price: 999, stock: 30, brand: 'GrandZone' },
    { name: 'TWS Earbuds Pro', category: 'Earbuds', mrp: 2499, price: 1299, stock: 40, brand: 'GrandZone' },
    { name: 'Portable Bluetooth Speaker', category: 'Bluetooth Speaker', mrp: 1999, price: 899, stock: 25, brand: 'GrandZone' },
    { name: 'Sports Neckband', category: 'Neckband', mrp: 1499, price: 699, stock: 60, brand: 'GrandZone' },
    { name: 'Smart Watch Fitness Band', category: 'Smart Watch', mrp: 3999, price: 1999, stock: 20, brand: 'GrandZone' },
    { name: 'Silicone Phone Cover', category: 'Phone Cover', mrp: 399, price: 199, stock: 150, brand: 'GrandZone' },
    { name: '9H Tempered Glass', category: 'Tempered Glass', mrp: 299, price: 149, stock: 200, brand: 'GrandZone' },
    { name: 'Dual USB Car Charger', category: 'Car Charger', mrp: 599, price: 299, stock: 45, brand: 'GrandZone' },
    { name: 'Adjustable Mobile Stand', category: 'Mobile Stand', mrp: 499, price: 249, stock: 70, brand: 'GrandZone' },
    { name: '18-inch Ring Light', category: 'Ring Light', mrp: 1999, price: 999, stock: 15, brand: 'GrandZone' },
    { name: '64GB Memory Card', category: 'Memory Card', mrp: 799, price: 399, stock: 55, brand: 'GrandZone' },
    { name: '64GB USB 3.0 Pendrive', category: 'Pendrive', mrp: 699, price: 349, stock: 40, brand: 'GrandZone' },
    { name: 'Laptop Cooling Stand', category: 'Laptop Accessories', mrp: 1499, price: 799, stock: 20, brand: 'GrandZone' },
    { name: 'Men Perfume 100ml', category: 'Perfume', mrp: 899, price: 449, stock: 35, brand: 'GrandZone' },
    { name: 'Leather Wallet', category: 'Wallet', mrp: 699, price: 349, stock: 50, brand: 'GrandZone' },
    { name: 'Travel Bag', category: 'Bag', mrp: 1299, price: 649, stock: 25, brand: 'GrandZone' },
    { name: 'Insulated Water Bottle', category: 'Bottle', mrp: 599, price: 299, stock: 60, brand: 'GrandZone' },
    { name: 'Micro USB Cable 1.5m', category: 'Micro USB Cable', mrp: 299, price: 149, stock: 120, brand: 'GrandZone' },
    { name: 'Compact Tripod Stand', category: 'Tripod', mrp: 999, price: 499, stock: 30, brand: 'GrandZone' },
    { name: '65W GaN Charger', category: 'Chargers', mrp: 1999, price: 1099, stock: 35, brand: 'GrandZone' },
  ];

  for (const p of sampleProducts) {
    const discount = Math.round(((p.mrp - p.price) / p.mrp) * 100);
    await prisma.product.create({
      data: {
        name: p.name,
        description: `High quality ${p.name.toLowerCase()} from GrandZone. Premium build and reliable performance.`,
        images: JSON.stringify([]),
        categoryId: categories[p.category],
        brand: p.brand,
        mrp: p.mrp,
        price: p.price,
        discount,
        stock: p.stock
      }
    });
  }
  console.log(`${sampleProducts.length} sample products created.`);

  // Sample banners
  const sampleBanners = [
    { title: 'Mega Sale Live!', subtitle: 'Up to 50% off on all accessories', bgColor: 'from-primary-500 to-primary-700', order: 0 },
    { title: 'New Arrivals', subtitle: 'Latest fast chargers & earbuds', bgColor: 'from-blue-500 to-blue-700', order: 1 },
    { title: 'Power Bank Week', subtitle: 'Special prices on all power banks', bgColor: 'from-secondary-400 to-secondary-600', order: 2 },
    { title: 'Free Delivery', subtitle: 'On orders above ₹499', bgColor: 'from-purple-500 to-purple-700', order: 3 },
  ];

  for (const b of sampleBanners) {
    await prisma.banner.create({ data: { ...b, active: true } });
  }
  console.log(`${sampleBanners.length} sample banners created.`);

  console.log('Seeding complete!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
