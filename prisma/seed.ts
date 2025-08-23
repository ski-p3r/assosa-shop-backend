import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

export async function hashData(data: string): Promise<string> {
  return await argon2.hash(data);
}

const prisma = new PrismaClient();

async function main() {
  // 1. Categories
  const categories = await prisma.category.createMany({
    data: [
      {
        name: 'Electronics',
        slug: 'electronics',
        imageUrl:
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'Home & Kitchen',
        slug: 'home-kitchen',
        imageUrl:
          'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'Fashion',
        slug: 'fashion',
        imageUrl:
          'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'Books',
        slug: 'books',
        imageUrl:
          'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'Sports',
        slug: 'sports',
        imageUrl:
          'https://images.unsplash.com/photo-1505843279827-4b2b0c44a0a0?auto=format&fit=crop&w=600&q=80',
      },
    ],
    skipDuplicates: true,
  });

  // 2. Users
  const password = await hashData('password123');
  const users = await prisma.user.createMany({
    data: [
      {
        firstName: 'Admin',
        lastName: 'User',
        phone: '+251911000001',
        email: 'admin@shop.com',
        passwordHash: password,
        role: 'MASTER_ADMIN',
        profileImage: 'https://randomuser.me/api/portraits/men/1.jpg',
        address: '123 Admin St, Assosa',
      },
      {
        firstName: 'John',
        lastName: 'Doe',
        phone: '+251911000002',
        email: 'john@shop.com',
        passwordHash: password,
        role: 'CUSTOMER',
        profileImage: 'https://randomuser.me/api/portraits/men/2.jpg',
        address: '456 Main St, Assosa',
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+251911000003',
        email: 'jane@shop.com',
        passwordHash: password,
        role: 'CUSTOMER',
        profileImage: 'https://randomuser.me/api/portraits/women/1.jpg',
        address: '789 Side St, Assosa',
      },
    ],
    skipDuplicates: true,
  });

  // 3. Products (with real images)
  const electronics = await prisma.category.findUnique({
    where: { slug: 'electronics' },
  });
  const fashion = await prisma.category.findUnique({
    where: { slug: 'fashion' },
  });
  const home = await prisma.category.findUnique({
    where: { slug: 'home-kitchen' },
  });

  const products = [
    {
      name: 'Apple iPhone 14 Pro',
      slug: 'apple-iphone-14-pro',
      description: 'Latest Apple iPhone with advanced camera and display.',
      categoryId: electronics?.id,
      basePrice: 1200,
      image:
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
      variants: [
        {
          variantName: '128GB - Silver',
          price: 1200,
          stockQuantity: 10,
          imageUrl:
            'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-pro-silver-select?wid=940&hei=1112&fmt=png-alpha&.v=1660753619946',
        },
        {
          variantName: '256GB - Gold',
          price: 1350,
          stockQuantity: 7,
          imageUrl:
            'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-pro-gold-select?wid=940&hei=1112&fmt=png-alpha&.v=1660753620471',
        },
      ],
    },
    {
      name: 'Samsung QLED TV 55"',
      slug: 'samsung-qled-tv-55',
      description: 'Stunning 4K QLED TV for your living room.',
      categoryId: electronics?.id,
      basePrice: 900,
      image:
        'https://images.samsung.com/is/image/samsung/p6pim/africa_en/qn55q60aauxke/gallery/africa-en-qled-q60a-qn55q60aauxke-411594963?$650_519_PNG$',
      variants: [
        {
          variantName: '55-inch',
          price: 900,
          stockQuantity: 5,
          imageUrl:
            'https://images.samsung.com/is/image/samsung/p6pim/africa_en/qn55q60aauxke/gallery/africa-en-qled-q60a-qn55q60aauxke-411594963?$650_519_PNG$',
        },
      ],
    },
    {
      name: 'Nike Air Max 270',
      slug: 'nike-air-max-270',
      description: 'Popular Nike sneakers for everyday comfort.',
      categoryId: fashion?.id,
      basePrice: 150,
      image:
        'https://static.nike.com/a/images/t_PDP_864_v1/f_auto,q_auto:eco/6b1e2e2e-2e2e-4e2e-8e2e-2e2e2e2e2e2e/air-max-270-mens-shoes-KkLcGR.png',
      variants: [
        {
          variantName: 'Size 42 - Black',
          price: 150,
          stockQuantity: 15,
          imageUrl:
            'https://static.nike.com/a/images/t_PDP_864_v1/f_auto,q_auto:eco/6b1e2e2e-2e2e-4e2e-8e2e-2e2e2e2e2e2e/air-max-270-mens-shoes-KkLcGR.png',
        },
        {
          variantName: 'Size 44 - White',
          price: 155,
          stockQuantity: 8,
          imageUrl:
            'https://static.nike.com/a/images/t_PDP_864_v1/f_auto,q_auto:eco/6b1e2e2e-2e2e-4e2e-8e2e-2e2e2e2e2e2e/air-max-270-mens-shoes-KkLcGR.png',
        },
      ],
    },
    {
      name: 'Instant Pot Duo 7-in-1',
      slug: 'instant-pot-duo-7-in-1',
      description: 'Multi-use programmable pressure cooker.',
      categoryId: home?.id,
      basePrice: 99,
      image:
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
      variants: [
        {
          variantName: '6 Quart',
          price: 99,
          stockQuantity: 12,
          imageUrl:
            'https://m.media-amazon.com/images/I/81iB+5p1KPL._AC_SL1500_.jpg',
        },
      ],
    },
    {
      name: 'Levi’s 501 Original Jeans',
      slug: 'levis-501-original-jeans',
      description: 'Classic straight leg jeans for men.',
      categoryId: fashion?.id,
      basePrice: 60,
      image:
        'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80',
      variants: [
        {
          variantName: 'Size 32',
          price: 60,
          stockQuantity: 20,
          imageUrl:
            'https://lsco.scene7.com/is/image/lsco/levis/clothing/005010114-front-pdp.jpg',
        },
        {
          variantName: 'Size 34',
          price: 62,
          stockQuantity: 10,
          imageUrl:
            'https://lsco.scene7.com/is/image/lsco/levis/clothing/005010114-front-pdp.jpg',
        },
      ],
    },
  ];

  for (const prod of products) {
    const created = await prisma.product.create({
      data: {
        name: prod.name,
        slug: prod.slug,
        description: prod.description,
        categoryId: prod.categoryId,
        basePrice: prod.basePrice,
        variants: {
          create: prod.variants.map((v) => ({
            variantName: v.variantName,
            price: v.price,
            stockQuantity: v.stockQuantity,
            imageUrl: v.imageUrl,
          })),
        },
      },
    });
  }

  // 4. Reviews
  const john = await prisma.user.findUnique({
    where: { email: 'john@shop.com' },
  });
  const jane = await prisma.user.findUnique({
    where: { email: 'jane@shop.com' },
  });
  const iphone = await prisma.product.findUnique({
    where: { slug: 'apple-iphone-14-pro' },
  });
  const jeans = await prisma.product.findUnique({
    where: { slug: 'levis-501-original-jeans' },
  });
  await prisma.review.createMany({
    data: [
      // iPhone reviews
      {
        productId: iphone?.id!,
        customerId: john?.id!,
        rating: 5,
        reviewText: 'Amazing phone! Worth every penny.',
      },
      {
        productId: iphone?.id!,
        customerId: jane?.id!,
        rating: 4,
        reviewText: 'Great camera and battery life.',
      },
      // Jeans reviews
      {
        productId: jeans?.id!,
        customerId: jane?.id!,
        rating: 4,
        reviewText: 'Very comfortable and stylish.',
      },
      {
        productId: jeans?.id!,
        customerId: john?.id!,
        rating: 3,
        reviewText: 'Good fit but color fades after wash.',
      },
      // Add reviews for other products
      {
        productId: (
          await prisma.product.findUnique({
            where: { slug: 'nike-air-max-270' },
          })
        )?.id!,
        customerId: john?.id!,
        rating: 5,
        reviewText: 'Super comfy for running and daily use.',
      },
      {
        productId: (
          await prisma.product.findUnique({
            where: { slug: 'nike-air-max-270' },
          })
        )?.id!,
        customerId: jane?.id!,
        rating: 4,
        reviewText: 'Nice style, fits as expected.',
      },
      {
        productId: (
          await prisma.product.findUnique({
            where: { slug: 'samsung-qled-tv-55' },
          })
        )?.id!,
        customerId: john?.id!,
        rating: 5,
        reviewText: 'Picture quality is stunning! Highly recommend.',
      },
      {
        productId: (
          await prisma.product.findUnique({
            where: { slug: 'instant-pot-duo-7-in-1' },
          })
        )?.id!,
        customerId: jane?.id!,
        rating: 5,
        reviewText: 'Makes cooking so much easier and faster.',
      },
    ],
    skipDuplicates: true,
  });
  // Add more orders for demo
  const janeOrder = await prisma.order.create({
    data: {
      customerId: jane?.id!,
      status: 'delivered',
      totalPrice: 62,
      paymentMethod: 'digital_wallet',
      paymentStatus: 'paid',
      orderItems: {
        create: [
          {
            productId: jeans?.id!,
            variantId: (
              await prisma.productVariant.findFirst({
                where: { productId: jeans?.id },
              })
            )?.id!,
            quantity: 1,
            price: 62,
            status: 'delivered',
          },
        ],
      },
    },
  });

  await prisma.invoice.create({
    data: {
      orderId: janeOrder.id,
      invoiceNumber: 'INV-0002',
      pdfUrl:
        'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      paymentStatus: 'paid',
    },
  });

  await prisma.deliveryAssignment.create({
    data: {
      orderId: janeOrder.id,
      driverName: 'Mulugeta Tadesse',
      driverContact: '+251911000098',
      status: 'delivered',
      proofImageUrl: 'https://randomuser.me/api/portraits/men/4.jpg',
    },
  });

  // 5. Carts & CartItems
  const johnCart = await prisma.cart.create({
    data: {
      userId: john?.id!,
      items: {
        create: [
          {
            productId: iphone?.id!,
            variantId: (
              await prisma.productVariant.findFirst({
                where: { productId: iphone?.id },
              })
            )?.id!,
            quantity: 1,
          },
        ],
      },
    },
  });

  // 6. Wishlists & WishlistItems
  const janeWishlist = await prisma.wishlist.create({
    data: {
      userId: jane?.id!,
      items: {
        create: [
          {
            productId: jeans?.id!,
            variantId: (
              await prisma.productVariant.findFirst({
                where: { productId: jeans?.id },
              })
            )?.id!,
          },
        ],
      },
    },
  });

  // 7. Orders & OrderItems
  const order = await prisma.order.create({
    data: {
      customerId: john?.id!,
      status: 'pending',
      totalPrice: 1200,
      paymentMethod: 'cash_on_delivery',
      paymentStatus: 'pending',
      orderItems: {
        create: [
          {
            productId: iphone?.id!,
            variantId: (
              await prisma.productVariant.findFirst({
                where: { productId: iphone?.id },
              })
            )?.id!,
            quantity: 1,
            price: 1200,
            status: 'pending',
          },
        ],
      },
    },
  });

  // 8. Invoice
  await prisma.invoice.create({
    data: {
      orderId: order.id,
      invoiceNumber: 'INV-0001',
      pdfUrl:
        'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      paymentStatus: 'pending',
    },
  });

  // 9. Notification
  await prisma.notification.createMany({
    data: [
      {
        userId: john?.id!,
        title: 'Order Placed',
        message: 'Your order has been placed successfully.',
        type: 'order_update',
        status: 'unread',
      },
      {
        userId: jane?.id!,
        title: 'Wishlist Updated',
        message: 'A new item was added to your wishlist.',
        type: 'restock',
        status: 'unread',
      },
    ],
    skipDuplicates: true,
  });

  // 10. OTP
  await prisma.oTP.create({
    data: {
      phone: '+251911000002',
      hash: '123456',
    },
  });

  // 11. DeliveryAssignment
  await prisma.deliveryAssignment.create({
    data: {
      orderId: order.id,
      driverName: 'Abebe Kebede',
      driverContact: '+251911000099',
      status: 'assigned',
      proofImageUrl: 'https://randomuser.me/api/portraits/men/3.jpg',
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
