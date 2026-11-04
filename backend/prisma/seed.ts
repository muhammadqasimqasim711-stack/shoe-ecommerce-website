import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const url = process.env.DATABASE_URL ?? 'file:./prisma/dev.db';
const adapter = new PrismaBetterSqlite3({ url });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // 1. Roles & Permissions
  const permissionActions = [
    { action: 'dashboard:read', description: 'View dashboard' },
    { action: 'products:manage', description: 'Manage products' },
    { action: 'categories:manage', description: 'Manage categories' },
    { action: 'inventory:manage', description: 'Manage inventory' },
    { action: 'reviews:manage', description: 'Moderate reviews' },
    { action: 'orders:manage', description: 'Manage orders' },
    { action: 'returns:manage', description: 'Manage returns' },
    { action: 'payments:read', description: 'View payments' },
    { action: 'shipping:manage', description: 'Manage shipping' },
    { action: 'customers:manage', description: 'Manage customers' },
    { action: 'coupons:manage', description: 'Manage coupons' },
    { action: 'analytics:read', description: 'View analytics' },
    { action: 'admin_users:manage', description: 'Manage admin users' },
    { action: 'audit:read', description: 'View audit logs' },
    { action: 'settings:manage', description: 'Manage settings' },
    { action: 'notifications:manage', description: 'Manage notifications' },
    { action: 'cms:view', description: 'View CMS content' },
    { action: 'cms:create', description: 'Create CMS content' },
    { action: 'cms:update', description: 'Update CMS content' },
    { action: 'cms:delete', description: 'Delete CMS content' },
    { action: 'cms:publish', description: 'Publish CMS content' },
    { action: 'media:upload', description: 'Upload media' },
    { action: 'media:delete', description: 'Delete media' },
    { action: 'seo:manage', description: 'Manage SEO' },
  ];

  const permissionIds: Record<string, string> = {};
  for (const p of permissionActions) {
    const row = await prisma.permission.upsert({
      where: { action: p.action },
      update: { description: p.description },
      create: p,
    });
    permissionIds[p.action] = row.id;
  }

  const roleDefs: Array<{ name: string; description: string; actions: string[] }> = [
    {
      name: 'SUPER_ADMIN',
      description: 'Full access',
      actions: permissionActions.map((p) => p.action),
    },
    {
      name: 'ADMIN',
      description: 'General store management',
      actions: permissionActions.map((p) => p.action).filter((a) => a !== 'admin_users:manage'),
    },
    {
      name: 'PRODUCT_MANAGER',
      description: 'Products, categories and inventory',
      actions: [
        'dashboard:read',
        'products:manage',
        'categories:manage',
        'inventory:manage',
        'reviews:manage',
        'notifications:manage',
      ],
    },
    {
      name: 'ORDER_MANAGER',
      description: 'Orders, shipping and returns',
      actions: [
        'dashboard:read',
        'orders:manage',
        'returns:manage',
        'payments:read',
        'shipping:manage',
        'notifications:manage',
      ],
    },
    {
      name: 'CUSTOMER_SUPPORT',
      description: 'Customers and related orders',
      actions: [
        'dashboard:read',
        'customers:manage',
        'orders:manage',
        'returns:manage',
        'reviews:manage',
        'notifications:manage',
      ],
    },
    {
      name: 'MARKETING_MANAGER',
      description: 'Coupons and promotions',
      actions: [
        'dashboard:read',
        'coupons:manage',
        'analytics:read',
        'notifications:manage',
        'cms:view',
        'cms:create',
        'cms:update',
        'cms:publish',
        'media:upload',
        'media:delete',
        'seo:manage',
      ],
    },
    {
      name: 'CUSTOMER',
      description: 'Standard customer user',
      actions: [],
    },
  ];

  for (const def of roleDefs) {
    const role = await prisma.role.upsert({
      where: { name: def.name },
      update: { description: def.description },
      create: { name: def.name, description: def.description },
    });
    const perms = def.actions.map((a) => ({ id: permissionIds[a] })).filter((p) => p.id);
    await prisma.role.update({
      where: { id: role.id },
      data: { permissions: { set: perms } },
    });
  }

  const superAdminRole = await prisma.role.findUniqueOrThrow({ where: { name: 'SUPER_ADMIN' } });
  const customerRole = await prisma.role.findUniqueOrThrow({ where: { name: 'CUSTOMER' } });

  // Keep legacy ADMIN role for compatibility; primary admin is SUPER_ADMIN
  await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: { name: 'ADMIN', description: 'General store management' },
  });

  // 2. Admin User
  const passwordHash = await bcrypt.hash('AdminPass123!', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@sole.com' },
    update: { roleId: superAdminRole.id },
    create: {
      email: 'admin@sole.com',
      passwordHash,
      firstName: 'Admin',
      lastName: 'User',
      roleId: superAdminRole.id,
    },
  });

  console.log(`Admin user created: ${adminUser.email} (SUPER_ADMIN)`);

  const customerHash = await bcrypt.hash('Customer123!', 10);
  const demoCustomers = [
    { email: 'marcus@sole.example', firstName: 'Marcus', lastName: 'Johnson' },
    { email: 'sarah@sole.example', firstName: 'Sarah', lastName: 'Lee' },
    { email: 'alex@sole.example', firstName: 'Alex', lastName: 'Chen' },
  ];
  const customerUsers: Array<{ id: string; email: string }> = [];
  for (const c of demoCustomers) {
    const user = await prisma.user.upsert({
      where: { email: c.email },
      update: { firstName: c.firstName, lastName: c.lastName },
      create: {
        email: c.email,
        passwordHash: customerHash,
        firstName: c.firstName,
        lastName: c.lastName,
        roleId: customerRole.id,
      },
    });
    customerUsers.push(user);
  }
  console.log(`Demo customers seeded: ${demoCustomers.map((c) => c.email).join(', ')}`);

  // Default store settings
  await prisma.setting.upsert({
    where: { key: 'storeName' },
    update: {},
    create: { key: 'storeName', value: 'SOLE' },
  });
  await prisma.setting.upsert({
    where: { key: 'currency' },
    update: {},
    create: { key: 'currency', value: 'USD' },
  });
  await prisma.setting.upsert({
    where: { key: 'freeShippingThreshold' },
    update: {},
    create: { key: 'freeShippingThreshold', value: '75' },
  });

  const cmsSettings: Array<{ key: string; value: string }> = [
    { key: 'logoUrl', value: '' },
    { key: 'faviconUrl', value: '' },
    { key: 'contactEmail', value: 'support@sole.example' },
    { key: 'contactPhone', value: '' },
    { key: 'contactAddress', value: '' },
    {
      key: 'socialLinksJson',
      value: JSON.stringify({
        instagram: 'https://www.instagram.com/sole',
        facebook: 'https://www.facebook.com/sole',
        twitter: 'https://x.com/sole',
        youtube: 'https://www.youtube.com/@sole',
      }),
    },
    {
      key: 'footerText',
      value: 'Premium footwear for the ones who move different. Engineered for performance. Designed for the streets.',
    },
    { key: 'newsletterHeading', value: 'Get 10% off your first order' },
    {
      key: 'newsletterSubtext',
      value: 'Join the list for drops, restocks, and member-only offers.',
    },
    { key: 'defaultSeoTitle', value: 'SOLE — Premium Sneakers & Performance Footwear' },
    {
      key: 'defaultSeoDescription',
      value:
        'Shop the latest premium sneakers, running shoes, and lifestyle footwear. Free shipping over $75, 30-day returns.',
    },
    { key: 'defaultOgImage', value: '' },
  ];
  for (const s of cmsSettings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }

  // 3. Brands
  const brandNames = ['Nike', 'Adidas', 'Jordan', 'Puma', 'New Balance', 'Asics', 'Converse', 'Vans', 'Kidz'];
  const brands: Record<string, string> = {};

  for (const name of brandNames) {
    const brand = await prisma.brand.upsert({
      where: { name },
      update: {
        description:
          name === 'Kidz'
            ? 'Kidz — playful, durable footwear made for growing feet'
            : `Premium footwear by ${name}`,
      },
      create: {
        name,
        description:
          name === 'Kidz'
            ? 'Kidz — playful, durable footwear made for growing feet'
            : `Premium footwear by ${name}`,
      },
    });
    brands[name] = brand.id;
  }

  // 4. Categories
  const categoryNames = ['Running', 'Basketball', 'Lifestyle', 'Training'];
  const categories: Record<string, string> = {};

  const categoryImages: Record<string, string> = {
    Running: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80',
    Basketball: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80',
    Lifestyle: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&auto=format&fit=crop&q=80',
    Training: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
  };

  for (const name of categoryNames) {
    const cat = await prisma.category.upsert({
      where: { id: name.toLowerCase() },
      update: { imageUrl: categoryImages[name] },
      create: { id: name.toLowerCase(), name, imageUrl: categoryImages[name] },
    });
    categories[name] = cat.id;
  }

  // 5. Sample products — 3 published products per brand
  const img = (id: string) =>
    `https://images.unsplash.com/${id}?w=800&auto=format&fit=crop&q=80`;

  const COLOR_BLACK = '#111';
  const COLOR_WHITE = '#fff';
  const WHITE_FALLBACK_IMG = img('photo-1600185365483-26d7a4cc7519');

  const kidsSizes = ['US 10C', 'US 11C', 'US 13C', 'US 1Y', 'US 2Y', 'US 3Y'] as const;
  const adultSizes = ['US 9', 'US 10', 'US 11'] as const;

  function buildColorVariants(gender: string) {
    const sizes = gender === 'kids' ? kidsSizes : adultSizes;
    const stockByIndex = gender === 'kids' ? [20, 20, 15, 15, 12, 10] : [25, 15, 10];
    return sizes.flatMap((size, i) =>
      [COLOR_BLACK, COLOR_WHITE].map((color) => ({
        size,
        color,
        stock: stockByIndex[i] ?? 10,
        priceOffset: 0,
      })),
    );
  }

  function buildColorImages(urls: string[]) {
    const blackUrl = urls[0] ?? WHITE_FALLBACK_IMG;
    const whiteUrl = urls[1] ?? WHITE_FALLBACK_IMG;
    return [
      { url: blackUrl, altText: COLOR_BLACK },
      { url: whiteUrl, altText: COLOR_WHITE },
    ];
  }

  const sampleProducts: Array<{
    name: string;
    price: number;
    compareAtPrice?: number;
    gender: string;
    brand: string;
    category: string;
    sku: string;
    description: string;
    isPublished: boolean;
    isFeatured?: boolean;
    collection?: string;
    images: string[];
  }> = [
    // Nike (3)
    {
      name: 'Air Runner Pro',
      price: 189.99,
      compareAtPrice: 220,
      gender: 'men',
      brand: 'Nike',
      category: 'Running',
      sku: 'NIKE-AIR-RUN-PRO',
      description: 'Engineered for maximum velocity and dynamic responsiveness.',
      isPublished: true,
      isFeatured: true,
      collection: 'summer-26',
      images: [img('photo-1542291026-7eec264c27ff')],
    },
    {
      name: 'Kids Sprint Lite',
      price: 79.99,
      compareAtPrice: 99.99,
      gender: 'kids',
      brand: 'Nike',
      category: 'Running',
      sku: 'NIKE-KIDS-SPRINT',
      description: 'Lightweight kids runner built for playground speed.',
      isPublished: true,
      images: [img('photo-1514989940723-e8e51635b782')],
    },
    {
      name: 'Pegasus Daily',
      price: 139.99,
      gender: 'unisex',
      brand: 'Nike',
      category: 'Lifestyle',
      sku: 'NIKE-PEGASUS-DAILY',
      description: 'Everyday cushioned trainer for city miles and casual wear.',
      isPublished: true,
      collection: 'summer-26',
      images: [img('photo-1600185365926-3a2ce3cdb9eb')],
    },
    // Adidas (3)
    {
      name: 'Blaze Trail 3.0',
      price: 164.99,
      compareAtPrice: 199.99,
      gender: 'unisex',
      brand: 'Adidas',
      category: 'Training',
      sku: 'ADI-BLZ-TRL-3',
      description: 'All-terrain traction outsole with ultra-cushioned midsole.',
      isPublished: true,
      images: [img('photo-1608231387042-66d1773070a5')],
    },
    {
      name: 'Ultraboost Street',
      price: 179.99,
      gender: 'men',
      brand: 'Adidas',
      category: 'Running',
      sku: 'ADI-ULTRA-STREET',
      description: 'Energy-return midsole tuned for long paved runs.',
      isPublished: true,
      isFeatured: true,
      collection: 'summer-26',
      images: [img('photo-1515955656352-a1fa3ffcd111')],
    },
    {
      name: 'Samba Classic OG',
      price: 99.99,
      compareAtPrice: 120,
      gender: 'unisex',
      brand: 'Adidas',
      category: 'Lifestyle',
      sku: 'ADI-SAMBA-OG',
      description: 'Terrace classic with gum sole and soft leather upper.',
      isPublished: true,
      collection: 'summer-26',
      images: [img('photo-1595950653106-6c9ebd614d3a')],
    },
    // Jordan (3)
    {
      name: 'Court Legend High',
      price: 219.99,
      gender: 'men',
      brand: 'Jordan',
      category: 'Basketball',
      sku: 'JOR-CRT-LEG-HI',
      description: 'Retro basketball silhouette built with premium full-grain leather.',
      isPublished: true,
      images: [img('photo-1552346154-21d32810aba3')],
    },
    {
      name: 'Flight Low Retro',
      price: 159.99,
      compareAtPrice: 189.99,
      gender: 'unisex',
      brand: 'Jordan',
      category: 'Lifestyle',
      sku: 'JOR-FLIGHT-LOW',
      description: 'Low-cut heritage court shoe with crisp overlays.',
      isPublished: true,
      collection: 'summer-26',
      images: [img('photo-1606107557195-0e29a4b5b4aa')],
    },
    {
      name: 'Jumpman Trainer',
      price: 134.99,
      gender: 'women',
      brand: 'Jordan',
      category: 'Training',
      sku: 'JOR-JUMP-TRAIN',
      description: 'Stable trainer for gym sessions and quick cuts.',
      isPublished: true,
      collection: 'summer-26',
      images: [img('photo-1460353581641-37baddab0fa2')],
    },
    // Puma (3)
    {
      name: 'Classic Suede',
      price: 129.99,
      gender: 'women',
      brand: 'Puma',
      category: 'Lifestyle',
      sku: 'PUM-CLS-SUE-01',
      description: 'Timeless street icon crafted with plush premium suede.',
      isPublished: true,
      collection: 'summer-26',
      images: [img('photo-1600185365483-26d7a4cc7519')],
    },
    {
      name: 'Velocity Nitro',
      price: 144.99,
      gender: 'men',
      brand: 'Puma',
      category: 'Running',
      sku: 'PUM-VEL-NITRO',
      description: 'Nitro-infused foam for responsive tempo days.',
      isPublished: true,
      images: [img('photo-1539185441755-769473a23570')],
    },
    {
      name: 'Court Rider Pro',
      price: 119.99,
      compareAtPrice: 149.99,
      gender: 'unisex',
      brand: 'Puma',
      category: 'Basketball',
      sku: 'PUM-COURT-RIDER',
      description: 'Court-ready cushioning with grippy multidirectional outsole.',
      isPublished: true,
      images: [img('photo-1552346154-21d32810aba3')],
    },
    // New Balance (3)
    {
      name: 'Fresh Foam X',
      price: 149.99,
      gender: 'unisex',
      brand: 'New Balance',
      category: 'Running',
      sku: 'NB-FRESH-FOAM-X',
      description: 'Plush cushioning for everyday miles.',
      isPublished: true,
      images: [img('photo-1606107557195-0e29a4b5b4aa')],
    },
    {
      name: '574 Core Legacy',
      price: 89.99,
      gender: 'unisex',
      brand: 'New Balance',
      category: 'Lifestyle',
      sku: 'NB-574-CORE',
      description: 'Heritage runner reworked for all-day street comfort.',
      isPublished: true,
      images: [img('photo-1539185441755-769473a23570')],
    },
    {
      name: 'FuelCell Rebel',
      price: 139.99,
      compareAtPrice: 160,
      gender: 'women',
      brand: 'New Balance',
      category: 'Training',
      sku: 'NB-FUEL-REBEL',
      description: 'Snappy FuelCell foam for speed workouts.',
      isPublished: true,
      isFeatured: true,
      collection: 'summer-26',
      images: [img('photo-1542291026-7eec264c27ff')],
    },
    // Asics (3)
    {
      name: 'Studio Flow',
      price: 119.99,
      gender: 'women',
      brand: 'Asics',
      category: 'Training',
      sku: 'ASI-STD-FLOW',
      description: 'Flexible training shoe for studio and street.',
      isPublished: true,
      collection: 'summer-26',
      images: [img('photo-1539185441755-769473a23570')],
    },
    {
      name: 'Gel-Nimbus Ride',
      price: 159.99,
      gender: 'men',
      brand: 'Asics',
      category: 'Running',
      sku: 'ASI-GEL-NIMBUS',
      description: 'Max cushion GEL protection for long easy runs.',
      isPublished: true,
      images: [img('photo-1608231387042-66d1773070a5')],
    },
    {
      name: 'Court Speed FF',
      price: 129.99,
      compareAtPrice: 149.99,
      gender: 'unisex',
      brand: 'Asics',
      category: 'Lifestyle',
      sku: 'ASI-COURT-SPEED',
      description: 'Lightweight court-inspired sneaker with FlyteFoam bounce.',
      isPublished: true,
      images: [img('photo-1515955656352-a1fa3ffcd111')],
    },
    // Converse (3)
    {
      name: 'Chuck 70 High',
      price: 89.99,
      compareAtPrice: 110,
      gender: 'unisex',
      brand: 'Converse',
      category: 'Lifestyle',
      sku: 'CNV-CHUCK-70',
      description: 'Iconic high-top with vintage canvas and rubber sole.',
      isPublished: true,
      collection: 'summer-26',
      images: [img('photo-1460353581641-37baddab0fa2')],
    },
    {
      name: 'Chuck Taylor Low',
      price: 69.99,
      gender: 'unisex',
      brand: 'Converse',
      category: 'Lifestyle',
      sku: 'CNV-CHUCK-LOW',
      description: 'Clean low-top canvas essential for everyday fits.',
      isPublished: true,
      collection: 'summer-26',
      images: [img('photo-1600185365483-26d7a4cc7519')],
    },
    {
      name: 'Run Star Motion',
      price: 109.99,
      gender: 'women',
      brand: 'Converse',
      category: 'Training',
      sku: 'CNV-RUN-STAR',
      description: 'Chunky platform trainer with modern traction.',
      isPublished: true,
      images: [img('photo-1595950653106-6c9ebd614d3a')],
    },
    // Vans (3)
    {
      name: 'Old Skool Classic',
      price: 79.99,
      gender: 'unisex',
      brand: 'Vans',
      category: 'Lifestyle',
      sku: 'VAN-OLD-SKOOL',
      description: 'Skate staple with signature side stripe.',
      isPublished: true,
      collection: 'summer-26',
      images: [img('photo-1606107557195-0e29a4b5b4aa')],
    },
    {
      name: 'Sk8-Hi Reissue',
      price: 84.99,
      compareAtPrice: 95,
      gender: 'unisex',
      brand: 'Vans',
      category: 'Lifestyle',
      sku: 'VAN-SK8-HI',
      description: 'High-top skate classic with padded collar.',
      isPublished: true,
      images: [img('photo-1595950653106-6c9ebd614d3a')],
    },
    {
      name: 'UltraRange Neo',
      price: 99.99,
      gender: 'men',
      brand: 'Vans',
      category: 'Running',
      sku: 'VAN-ULTRA-NEO',
      description: 'Comfort-focused walker ready for travel days.',
      isPublished: true,
      images: [img('photo-1514989940723-e8e51635b782')],
    },
    // Kidz (10)
    {
      name: 'Kidz Play Runner',
      price: 64.99,
      compareAtPrice: 79.99,
      gender: 'kids',
      brand: 'Kidz',
      category: 'Running',
      sku: 'KIDZ-PLAY-RUN',
      description: 'Bouncy foam midsole and grippy outsole for playground sprints.',
      isPublished: true,
      isFeatured: true,
      collection: 'summer-26',
      images: [img('photo-1514989940723-e8e51635b782')],
    },
    {
      name: 'Kidz Court Mini',
      price: 69.99,
      gender: 'kids',
      brand: 'Kidz',
      category: 'Basketball',
      sku: 'KIDZ-COURT-MINI',
      description: 'Low-cut court shoe with padded collar for after-school games.',
      isPublished: true,
      images: [img('photo-1552346154-21d32810aba3')],
    },
    {
      name: 'Kidz Street Soft',
      price: 54.99,
      gender: 'kids',
      brand: 'Kidz',
      category: 'Lifestyle',
      sku: 'KIDZ-STREET-SOFT',
      description: 'Soft suede-feel upper and easy on-off for everyday wear.',
      isPublished: true,
      collection: 'summer-26',
      images: [img('photo-1600185365483-26d7a4cc7519')],
    },
    {
      name: 'Kidz Trail Scout',
      price: 74.99,
      compareAtPrice: 89.99,
      gender: 'kids',
      brand: 'Kidz',
      category: 'Training',
      sku: 'KIDZ-TRAIL-SCOUT',
      description: 'Rugged outsole for park paths and weekend adventures.',
      isPublished: true,
      images: [img('photo-1608231387042-66d1773070a5')],
    },
    {
      name: 'Kidz Glow Knit',
      price: 59.99,
      gender: 'kids',
      brand: 'Kidz',
      category: 'Running',
      sku: 'KIDZ-GLOW-KNIT',
      description: 'Breathable knit upper with reflective hits for dusk play.',
      isPublished: true,
      isFeatured: true,
      images: [img('photo-1542291026-7eec264c27ff')],
    },
    {
      name: 'Kidz Jump Low',
      price: 72.99,
      gender: 'kids',
      brand: 'Kidz',
      category: 'Basketball',
      sku: 'KIDZ-JUMP-LOW',
      description: 'Responsive court cushioning sized for growing athletes.',
      isPublished: true,
      images: [img('photo-1551107696-a4b0c5a0d9a2')],
    },
    {
      name: 'Kidz School Day',
      price: 49.99,
      compareAtPrice: 59.99,
      gender: 'kids',
      brand: 'Kidz',
      category: 'Lifestyle',
      sku: 'KIDZ-SCHOOL-DAY',
      description: 'Durable daily sneaker that survives recess and classroom miles.',
      isPublished: true,
      collection: 'summer-26',
      images: [img('photo-1606107557195-0e29a4b5b4aa')],
    },
    {
      name: 'Kidz Recess High',
      price: 67.99,
      gender: 'kids',
      brand: 'Kidz',
      category: 'Lifestyle',
      sku: 'KIDZ-RECESS-HI',
      description: 'High-top support with soft lining for all-day comfort.',
      isPublished: true,
      images: [img('photo-1595950653106-6c9ebd614d3a')],
    },
    {
      name: 'Kidz Velocity Jr',
      price: 79.99,
      gender: 'kids',
      brand: 'Kidz',
      category: 'Running',
      sku: 'KIDZ-VEL-JR',
      description: 'Lightweight trainer tuned for PE and junior track days.',
      isPublished: true,
      images: [img('photo-1600185365926-3a2ce3cdb9eb')],
    },
    {
      name: 'Kidz Classic Canvas',
      price: 44.99,
      compareAtPrice: 54.99,
      gender: 'kids',
      brand: 'Kidz',
      category: 'Lifestyle',
      sku: 'KIDZ-CLASSIC-CNV',
      description: 'Easy canvas low-top with vulcanized feel for casual days.',
      isPublished: true,
      images: [img('photo-1460353581641-37baddab0fa2')],
    },
  ];

  for (const prod of sampleProducts) {
    const colorImages = buildColorImages(prod.images);
    const colorVariants = buildColorVariants(prod.gender);
    const existing = await prisma.product.findFirst({ where: { sku: prod.sku } });
    if (!existing) {
      const createdProd = await prisma.product.create({
        data: {
          name: prod.name,
          price: prod.price,
          compareAtPrice: prod.compareAtPrice,
          gender: prod.gender,
          isFeatured: prod.isFeatured ?? false,
          collection: prod.collection ?? null,
          description: prod.description,
          sku: prod.sku,
          isPublished: prod.isPublished,
          status: prod.isPublished ? 'ACTIVE' : 'DRAFT',
          brandId: brands[prod.brand],
          categories: {
            create: {
              categoryId: categories[prod.category],
            },
          },
          images: {
            create: colorImages,
          },
          variants: {
            create: colorVariants,
          },
        },
      });
      console.log(`Product created: ${createdProd.name}`);
    } else {
      await prisma.product.update({
        where: { id: existing.id },
        data: {
          compareAtPrice: prod.compareAtPrice,
          gender: prod.gender,
          isFeatured: prod.isFeatured ?? false,
          collection: prod.collection ?? null,
          price: prod.price,
          isPublished: prod.isPublished,
          status: prod.isPublished ? 'ACTIVE' : 'DRAFT',
        },
      });
      // Sync colorway images (altText = hex for PDP mapping)
      await prisma.productImage.deleteMany({ where: { productId: existing.id } });
      await prisma.productImage.createMany({
        data: colorImages.map((image) => ({ ...image, productId: existing.id })),
      });
      // Upsert Black/White variants without deleting rows (preserves cart FKs)
      const existingVars = await prisma.productVariant.findMany({
        where: { productId: existing.id },
      });
      for (const v of colorVariants) {
        const exact = existingVars.find((e) => e.size === v.size && e.color === v.color);
        if (exact) {
          await prisma.productVariant.update({
            where: { id: exact.id },
            data: { stock: v.stock },
          });
          continue;
        }
        const def = existingVars.find(
          (e) => e.size === v.size && (e.color === 'Default' || e.color == null),
        );
        if (def && v.color === COLOR_BLACK) {
          await prisma.productVariant.update({
            where: { id: def.id },
            data: { color: COLOR_BLACK, stock: v.stock },
          });
          def.color = COLOR_BLACK;
          continue;
        }
        const created = await prisma.productVariant.create({
          data: { ...v, productId: existing.id },
        });
        existingVars.push(created);
      }
      console.log(`Product updated: ${existing.name}`);
    }
  }

  // Coupons
  await prisma.coupon.upsert({
    where: { code: 'SOLE10' },
    update: {
      description: '10% off your order',
      discountType: 'percent',
      discountValue: 10,
      minOrderValue: 0,
    },
    create: {
      code: 'SOLE10',
      description: '10% off your order',
      discountType: 'percent',
      discountValue: 10,
      minOrderValue: 0,
    },
  });

  await prisma.coupon.upsert({
    where: { code: 'FREESHIP' },
    update: {
      description: 'Free standard shipping',
      discountType: 'free_shipping',
      discountValue: 0,
      minOrderValue: 0,
    },
    create: {
      code: 'FREESHIP',
      description: 'Free standard shipping',
      discountType: 'free_shipping',
      discountValue: 0,
      minOrderValue: 0,
    },
  });

  console.log('Coupons seeded: SOLE10, FREESHIP');

  // Help / CMS pages
  const helpPages = [
    {
      slug: 'shipping',
      title: 'Shipping',
      type: 'page',
      content: `Free standard shipping on orders over $75 within the contiguous United States.

Standard shipping: 3–5 business days ($5.99 under $75).
Express shipping: 1–2 business days ($14.99).

Orders placed before 2pm local warehouse time typically ship the same business day.
International shipping is not available in this demo store.

You will receive a confirmation email with tracking once your order ships.`,
    },
    {
      slug: 'returns',
      title: 'Returns',
      type: 'page',
      content: `We offer a 30-day return window from the delivery date.

Items must be unworn, in original packaging, with tags attached.
Sale items marked Final Sale cannot be returned.

To start a return, contact support with your order ID.
Refunds are issued to the original payment method within 5–10 business days after we receive the return.

Exchanges are available for size swaps while stock lasts.`,
    },
    {
      slug: 'size-guide',
      title: 'Size Guide',
      type: 'page',
      content: `SOLE sneakers generally run true to size. If you are between sizes, we recommend sizing up.

US Men's / Unisex
US 8 → EU 41 → UK 7
US 9 → EU 42.5 → UK 8
US 10 → EU 44 → UK 9
US 11 → EU 45 → UK 10
US 12 → EU 46 → UK 11

US Women's
Women's sizes are typically 1.5 sizes up from men's labeling on unisex styles.

Kids
Refer to product pages for kids-specific sizing. Measure foot length in centimeters for the best fit.

Still unsure? Reach out via Contact and include your usual brand/size.`,
    },
    {
      slug: 'faq',
      title: 'FAQ',
      type: 'faq',
      content: `Q: How do I track my order?
A: Use the order confirmation page link or contact support with your order ID.

Q: Do you offer free shipping?
A: Yes — free standard shipping on orders of $75 or more.

Q: Can I change or cancel my order?
A: Contact us as soon as possible. Once an order is Confirmed and packing has started, changes may not be possible.

Q: What payment methods do you accept?
A: This demo uses mock checkout payment. In production we support major cards.

Q: How do coupons work?
A: Enter codes like SOLE10 (10% off) or FREESHIP on the cart page before checkout.

Q: Where is my wishlist saved?
A: Wishlists are saved in your browser for guest shoppers.`,
    },
    {
      slug: 'contact',
      title: 'Contact',
      type: 'page',
      content: `We're here to help with orders, sizing, returns, and product questions.

Email: support@sole.example
Hours: Monday–Friday, 9am–6pm ET

Prefer a form? Send us a message below and our team will get back to you.`,
    },
  ];

  for (const page of helpPages) {
    await prisma.cmsPage.upsert({
      where: { slug: page.slug },
      update: {
        title: page.title,
        content: page.content,
        type: page.type,
        published: true,
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
      create: {
        slug: page.slug,
        title: page.title,
        content: page.content,
        type: page.type,
        published: true,
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
    });
  }
  console.log('Help CMS pages seeded: shipping, returns, size-guide, faq, contact');

  const companyLegalPages = [
    {
      slug: 'about',
      title: 'About',
      type: 'page',
      content: `SOLE designs premium footwear for people who move with intention — on the track, in the gym, and through the city.

Founded as a performance-meets-street brand, we obsess over materials, fit, and lasting comfort. Every silhouette in our catalog is built to feel as good on mile ten as it does on day one.

Our team spans design, product, and community. We ship from US warehouses and support customers with a 30-day return window and free standard shipping over $75.`,
    },
    {
      slug: 'careers',
      title: 'Careers',
      type: 'page',
      content: `Join the SOLE crew.

We're always looking for people who care about craft, product, and customer experience.

Open roles (sample):
• Product Designer — Footwear
• Full-Stack Engineer — Commerce
• Customer Experience Lead
• Wholesale Account Manager

Send a short intro and resume to careers@sole.example. We review applications on a rolling basis.

SOLE is an equal opportunity employer.`,
    },
    {
      slug: 'press',
      title: 'Press',
      type: 'page',
      content: `Press & media

For interviews, product samples, and brand assets, contact press@sole.example.

Media kit includes logo files, product imagery guidelines, and founder bios (available on request).

Recent themes: Summer '26 collection, performance cushioning, and our guest wishlist & checkout experience.

Please allow 2–3 business days for response.`,
    },
    {
      slug: 'sustainability',
      title: 'Sustainability',
      type: 'page',
      content: `We're building SOLE with longer wear in mind.

What we're doing:
• Prefer durable uppers and replaceable-friendly construction where possible
• Consolidate shipments to reduce packaging waste
• Offer a 30-day return window so the wrong size doesn't become landfill
• Partner with warehouses that recycle cardboard and packing materials

This is an ongoing effort. We'll keep publishing updates as we improve materials and logistics.`,
    },
    {
      slug: 'stores',
      title: 'Stores',
      type: 'page',
      content: `SOLE is primarily an online store.

Demo flagship (placeholder):
SOLE Studio — 100 Market Street, New York, NY
Hours: Tue–Sat 11am–7pm

Pop-ups and wholesale partners are announced on our newsletter and social channels.

Can't visit in person? Shop anytime at sole.example with free shipping over $75.`,
    },
    {
      slug: 'privacy',
      title: 'Privacy Policy',
      type: 'page',
      content: `Last updated: 2026

SOLE (“we”) respects your privacy. This demo policy explains what we collect and why.

Information we collect:
• Account details (email, name) when you register
• Order and shipping details at checkout
• Newsletter email if you subscribe
• Support messages you send via Contact

How we use it:
• To fulfill orders, authenticate sessions, and respond to support
• To send optional marketing if you subscribed
• To improve the store experience

We do not sell personal data. Access is limited to systems needed to run this demo.

Contact privacy@sole.example for data requests.`,
    },
    {
      slug: 'terms',
      title: 'Terms of Service',
      type: 'page',
      content: `Last updated: 2026

By using the SOLE demo store you agree to these terms.

Orders: Prices are shown in USD. Placing an order creates a purchase request subject to availability. Mock payments are for demonstration only.

Returns: Eligible unworn items may be returned within 30 days as described on our Returns page.

Accounts: You are responsible for keeping login credentials secure.

Content: Product images and copy are for demo purposes.

Limitation: This storefront is a development demo; we provide it “as is” without warranties of uninterrupted service.

Questions: support@sole.example`,
    },
    {
      slug: 'cookies',
      title: 'Cookies',
      type: 'page',
      content: `Last updated: 2026

SOLE uses browser storage to make the demo work:

Essential:
• Cart ID and wishlist ID in localStorage so your bag and saved items persist
• Auth token (sole_token) after you sign in

Preferences / analytics:
• This demo does not load third-party ad trackers

You can clear site data in your browser settings to remove cart, wishlist, and login state.

For more on data use, see our Privacy Policy.`,
    },
  ];

  for (const page of companyLegalPages) {
    await prisma.cmsPage.upsert({
      where: { slug: page.slug },
      update: {
        title: page.title,
        content: page.content,
        type: page.type,
        published: true,
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
      create: {
        slug: page.slug,
        title: page.title,
        content: page.content,
        type: page.type,
        published: true,
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
    });
  }
  console.log(
    'Company/Legal CMS pages seeded: about, careers, press, sustainability, stores, privacy, terms, cookies',
  );

  // Homepage sections (match current storefront copy)
  const homeSections: Array<{
    key: string;
    title: string;
    sortOrder: number;
    payload: Record<string, unknown>;
  }> = [
    {
      key: 'announcement',
      title: 'Announcement bar',
      sortOrder: 0,
      payload: {
        text: "LIMITED DROP · SUMMER '26 COLLECTION · ENDS SUNDAY",
        linkText: "SUMMER '26 COLLECTION",
        linkUrl: '/shop?collection=summer-26',
      },
    },
    {
      key: 'hero',
      title: 'Hero',
      sortOrder: 1,
      payload: {
        badge: "Summer '26",
        badgeUrl: '/shop?collection=summer-26',
        heading: 'Step Into the Future.',
        subtitle:
          'Engineered for the streets. Designed for the extraordinary. The new Air Runner Pro delivers unmatched comfort with a silhouette that defines the era.',
        ctaText: 'Shop Collection',
        ctaUrl: '/shop?collection=summer-26',
        secondaryCtaText: 'Explore Lookbook',
        secondaryCtaUrl: '/lookbook',
        imageUrl: '/src/assets/hero-sneaker.jpg',
        stats: [
          { value: '2M+', label: 'Customers' },
          { value: '500+', label: 'Styles' },
          { value: '4.9★', label: 'Rated' },
        ],
      },
    },
    {
      key: 'value_props',
      title: 'Value props',
      sortOrder: 2,
      payload: {
        items: [
          { title: 'Free Shipping', desc: 'On orders over $75' },
          { title: '30-Day Returns', desc: 'Easy & free returns' },
          { title: 'Authentic Guarantee', desc: '100% verified products' },
          { title: '24/7 Support', desc: 'Always here to help' },
        ],
      },
    },
    {
      key: 'featured_categories',
      title: 'Featured categories',
      sortOrder: 3,
      payload: { eyebrow: 'Shop by Category', heading: 'Find Your Fit' },
    },
    {
      key: 'featured_products',
      title: 'Featured products',
      sortOrder: 4,
      payload: { eyebrow: 'Best Sellers', heading: 'Trending Now' },
    },
    {
      key: 'split',
      title: 'Split feature',
      sortOrder: 5,
      payload: {
        left: {
          badge: 'Performance',
          heading: 'Built for Every Mile.',
          body: 'Discover our running collection engineered with responsive foam and breathable knit uppers.',
          ctaText: 'Shop Running',
          ctaUrl: '/shop?category=running',
        },
        right: {
          badge: 'Lifestyle',
          heading: 'Everyday Elevated.',
          body: 'Timeless silhouettes crafted from premium materials for the modern wardrobe.',
          ctaText: 'Shop Lifestyle',
          ctaUrl: '/shop?category=lifestyle',
        },
      },
    },
    {
      key: 'flash_sale',
      title: 'Flash sale',
      sortOrder: 6,
      payload: {
        heading: 'Up to 50% Off Ends Tonight.',
        ctaText: 'Shop Sale',
        ctaUrl: '/shop?onSale=true',
      },
    },
    {
      key: 'brands',
      title: 'Brand marquee',
      sortOrder: 7,
      payload: {},
    },
    {
      key: 'testimonials',
      title: 'Testimonials',
      sortOrder: 8,
      payload: { eyebrow: 'Customer Voices', heading: 'Real Reviews' },
    },
    {
      key: 'newsletter',
      title: 'Newsletter',
      sortOrder: 9,
      payload: {
        heading: 'Get 10% off your first order',
        subtext: 'Join the list for drops, restocks, and member-only offers.',
      },
    },
  ];

  for (const section of homeSections) {
    await prisma.homepageSection.upsert({
      where: { key: section.key },
      update: {},
      create: {
        key: section.key,
        title: section.title,
        enabled: true,
        status: 'PUBLISHED',
        sortOrder: section.sortOrder,
        payload: section.payload as object,
      },
    });
  }
  console.log('Homepage CMS sections seeded');

  await prisma.banner.upsert({
    where: { id: 'seed-banner-summer' },
    update: {},
    create: {
      id: 'seed-banner-summer',
      desktopImageUrl: '',
      mobileImageUrl: '',
      title: "Summer '26 Drop",
      subtitle: 'Limited collection — ends Sunday',
      buttonText: 'Shop now',
      buttonLink: '/shop?collection=summer-26',
      status: 'PUBLISHED',
      sortOrder: 0,
    },
  });

  const menus: Array<{
    location: string;
    name: string;
    items: Array<{ label: string; url: string; sortOrder: number }>;
  }> = [
    {
      location: 'header',
      name: 'Header',
      items: [
        { label: 'New', url: '/shop?sort=newest&days=30', sortOrder: 0 },
        { label: 'Men', url: '/shop?gender=men', sortOrder: 1 },
        { label: 'Women', url: '/shop?gender=women', sortOrder: 2 },
        { label: 'Kids', url: '/shop?gender=kids', sortOrder: 3 },
        { label: 'Sale', url: '/shop?onSale=true', sortOrder: 4 },
        { label: 'Brands', url: '/brands', sortOrder: 5 },
      ],
    },
    {
      location: 'footer_shop',
      name: 'Footer Shop',
      items: [
        { label: 'New Arrivals', url: '/shop?sort=newest&days=30', sortOrder: 0 },
        { label: 'Men', url: '/shop?gender=men', sortOrder: 1 },
        { label: 'Women', url: '/shop?gender=women', sortOrder: 2 },
        { label: 'Kids', url: '/shop?gender=kids', sortOrder: 3 },
        { label: 'Sale', url: '/shop?onSale=true', sortOrder: 4 },
      ],
    },
    {
      location: 'footer_help',
      name: 'Footer Help',
      items: [
        { label: 'Shipping', url: '/help/shipping', sortOrder: 0 },
        { label: 'Returns', url: '/help/returns', sortOrder: 1 },
        { label: 'Size Guide', url: '/help/size-guide', sortOrder: 2 },
        { label: 'FAQ', url: '/help/faq', sortOrder: 3 },
        { label: 'Contact', url: '/help/contact', sortOrder: 4 },
      ],
    },
    {
      location: 'footer_company',
      name: 'Footer Company',
      items: [
        { label: 'About', url: '/company/about', sortOrder: 0 },
        { label: 'Careers', url: '/company/careers', sortOrder: 1 },
        { label: 'Press', url: '/company/press', sortOrder: 2 },
        { label: 'Sustainability', url: '/company/sustainability', sortOrder: 3 },
        { label: 'Stores', url: '/company/stores', sortOrder: 4 },
      ],
    },
    {
      location: 'footer_legal',
      name: 'Footer Legal',
      items: [
        { label: 'Privacy', url: '/legal/privacy', sortOrder: 0 },
        { label: 'Terms', url: '/legal/terms', sortOrder: 1 },
        { label: 'Cookies', url: '/legal/cookies', sortOrder: 2 },
      ],
    },
  ];

  for (const menu of menus) {
    const row = await prisma.navMenu.upsert({
      where: { location: menu.location },
      update: { name: menu.name },
      create: { location: menu.location, name: menu.name },
    });
    const existingItems = await prisma.navItem.count({ where: { menuId: row.id } });
    if (existingItems === 0) {
      await prisma.navItem.createMany({
        data: menu.items.map((item) => ({
          menuId: row.id,
          label: item.label,
          url: item.url,
          sortOrder: item.sortOrder,
          enabled: true,
        })),
      });
    }
  }
  console.log('CMS navigation menus seeded');

  await prisma.blogPost.upsert({
    where: { slug: 'welcome-to-sole' },
    update: {},
    create: {
      title: 'Welcome to SOLE',
      slug: 'welcome-to-sole',
      excerpt: 'How we design premium footwear for the street and the track.',
      content:
        '<p>SOLE is built for people who move. This is our first journal post — drops, materials, and stories from the floor.</p>',
      authorName: 'SOLE Team',
      category: 'Journal',
      status: 'PUBLISHED',
      publishedAt: new Date(),
      tags: { create: [{ tag: 'news' }, { tag: 'brand' }] },
    },
  });
  console.log('Sample blog post seeded');

  // Reviews
  const reviewTargets = await prisma.product.findMany({
    where: {
      sku: {
        in: [
          'NIKE-AIR-RUN-PRO',
          'ADI-BLZ-TRL-3',
          'JOR-CRT-LEG-HI',
          'PUM-CLS-SUE-01',
          'NB-FRESH-FOAM-X',
          'VAN-OLD-SKOOL',
        ],
      },
      isPublished: true,
    },
    select: { id: true, sku: true, name: true },
  });
  const bySku = Object.fromEntries(reviewTargets.map((p) => [p.sku!, p]));

  const sampleReviews: Array<{
    email: string;
    sku: string;
    rating: number;
    title: string;
    comment: string;
  }> = [
    {
      email: 'marcus@sole.example',
      sku: 'NIKE-AIR-RUN-PRO',
      rating: 5,
      title: 'Unmatched comfort',
      comment:
        "Best sneakers I've ever owned. Comfort is unmatched and the design is head-turning.",
    },
    {
      email: 'sarah@sole.example',
      sku: 'ADI-BLZ-TRL-3',
      rating: 5,
      title: 'Premium quality',
      comment:
        'Fast shipping, premium packaging, incredible quality. This is now my go-to store.',
    },
    {
      email: 'alex@sole.example',
      sku: 'NIKE-AIR-RUN-PRO',
      rating: 5,
      title: 'Exceeded expectations',
      comment:
        'The Air Runner Pro exceeded every expectation. Worth every penny — I am buying another pair.',
    },
    {
      email: 'marcus@sole.example',
      sku: 'JOR-CRT-LEG-HI',
      rating: 4,
      title: 'Court classic',
      comment: 'Solid ankle support and a clean look. Slightly stiff out of the box but breaks in nicely.',
    },
    {
      email: 'sarah@sole.example',
      sku: 'PUM-CLS-SUE-01',
      rating: 5,
      title: 'Everyday staple',
      comment: 'Soft suede and easy to style. Gets compliments every time I wear them.',
    },
    {
      email: 'alex@sole.example',
      sku: 'NB-FRESH-FOAM-X',
      rating: 4,
      title: 'Great for long walks',
      comment: 'Cushioning is excellent for all-day wear. True to size for me.',
    },
    {
      email: 'marcus@sole.example',
      sku: 'VAN-OLD-SKOOL',
      rating: 5,
      title: 'Timeless',
      comment: 'The classic silhouette done right. Durable and comfortable for skating and street.',
    },
    {
      email: 'sarah@sole.example',
      sku: 'NIKE-AIR-RUN-PRO',
      rating: 4,
      title: 'Fast and light',
      comment: 'Responsive on tempo runs. Upper breathes well in summer heat.',
    },
    {
      email: 'alex@sole.example',
      sku: 'ADI-BLZ-TRL-3',
      rating: 5,
      title: 'Trail ready',
      comment: 'Grip on wet rock is confidence-inspiring. Midsole still feels lively after months.',
    },
  ];

  const userByEmail = Object.fromEntries(customerUsers.map((u) => [u.email, u.id]));
  let reviewsCreated = 0;
  for (const r of sampleReviews) {
    const product = bySku[r.sku];
    const userId = userByEmail[r.email];
    if (!product || !userId) continue;

    const existingReview = await prisma.review.findFirst({
      where: { userId, productId: product.id },
    });
    if (existingReview) {
      await prisma.review.update({
        where: { id: existingReview.id },
        data: {
          rating: r.rating,
          title: r.title,
          comment: r.comment,
          approved: true,
        },
      });
    } else {
      await prisma.review.create({
        data: {
          userId,
          productId: product.id,
          rating: r.rating,
          title: r.title,
          comment: r.comment,
          approved: true,
        },
      });
      reviewsCreated += 1;
    }
  }
  console.log(`Reviews seeded/updated (${reviewsCreated} new) across ${reviewTargets.length} products`);

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
