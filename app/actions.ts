"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { parseWithZod } from "@conform-to/zod";
import { bannerSchema, productSchema } from "./lib/zodSchemas";
import prisma from "./lib/db";
import { redis } from "./lib/redis";
import type { Cart } from "./lib/interfaces";
import { revalidatePath } from "next/cache";
import { stripe } from "./lib/stripe";
import type Stripe from "stripe";
import { locales } from "@/middleware";
import { z } from "zod";

// Helper function to check admin access
async function checkAdminAccess() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const adminEmails = [
    "eweeda12@gmail.com",
    "eweeda172@gmail.com",
    "ecomsrose@gmail.com",
    "Elsaady.eweeda@gmail.com",
    "mohamed.elitegroup@gmail.com"
  ];
  if (!user || !adminEmails.includes(user.email as string)) {
    throw new Error("Unauthorized");
  }
  return user;
}

// Helper function to handle database errors
async function handleDatabaseOperation<T>(
  operation: () => Promise<T>
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    console.error("Database operation failed:", error);
    throw new Error("Failed to perform database operation");
  }
}

export async function createProduct(_prev: unknown, formData: FormData) {
  // 1) Auth
  await checkAdminAccess();

  // 2) Validation
  const submission = parseWithZod(formData, { schema: productSchema });
  if (submission.status !== "success") {
    return submission.reply();
  }
  const {
    name,
    name_ar,
    description,
    description_ar,
    status,
    price,
    images,
    category,
    isFeatured,
  } = submission.value;

  // 3) Persist
  try {
    await prisma.product.create({
      data: {
        name,
        name_ar, // undefined is fine for optional
        description,
        description_ar,
        status,
        price,
        images, // already an array of strings
        category,
        isFeatured: Boolean(isFeatured),
      },
    });
  } catch (err) {
    console.error("DB create failed:", err);
    throw new Error("Failed to create product");
  }

  // 4) Revalidate & redirect
  revalidatePath("/dashboard/products");
  redirect("/dashboard/products");
}

export async function editProduct(prevState: any, formData: FormData) {
  try {
    await checkAdminAccess();

    const submission = parseWithZod(formData, {
      schema: productSchema,
    });

    if (submission.status !== "success") {
      return submission.reply();
    }

    const flattenUrls = submission.value.images.flatMap((urlString) =>
      urlString.split(",").map((url) => url.trim())
    );

    const productId = formData.get("productId") as string;

    await handleDatabaseOperation(async () => {
      await prisma.product.update({
        where: { id: productId },
        data: {
          name: submission.value.name,
          name_ar: submission.value.name_ar,
          description: submission.value.description,
          description_ar: submission.value.description_ar,
          category: submission.value.category,
          price: submission.value.price,
          isFeatured: submission.value.isFeatured === true,
          status: submission.value.status,
          images: flattenUrls,
        },
      });
    });
  } catch (error) {
    console.error("Failed to edit product:", error);
    throw new Error("Failed to edit product");
  }
  revalidatePath("/dashboard/products");
  redirect("/dashboard/products");
}

export async function deleteProduct(formData: FormData) {
  try {
    await checkAdminAccess();
    const productId = formData.get("productId") as string;

    await handleDatabaseOperation(async () => {
      await prisma.product.delete({
        where: { id: productId },
      });
    });

    revalidatePath("/dashboard/products");
    redirect("/dashboard/products");
  } catch (error) {
    console.error("Failed to delete product:", error);
    throw new Error("Failed to delete product");
  }
}

export async function createBanner(prevState: any, formData: FormData) {
  try {
    await checkAdminAccess();

    const submission = parseWithZod(formData, {
      schema: bannerSchema,
    });

    if (submission.status !== "success") {
      return submission.reply();
    }

    await handleDatabaseOperation(async () => {
      await prisma.banner.create({
        data: {
          title: submission.value.title,
          title_ar: submission.value.title_ar,
          imageString: submission.value.imageString,
        },
      });
    });

    revalidatePath("/dashboard/banner");
    redirect("/dashboard/banner");
  } catch (error) {
    console.error("Failed to create banner:", error);
    throw new Error("Failed to create banner");
  }
}

export async function deleteBanner(formData: FormData) {
  try {
    await checkAdminAccess();
    const bannerId = formData.get("bannerId") as string;

    await handleDatabaseOperation(async () => {
      await prisma.banner.delete({
        where: { id: bannerId },
      });
    });

    revalidatePath("/dashboard/banner");
    redirect("/dashboard/banner");
  } catch (error) {
    console.error("Failed to delete banner:", error);
    throw new Error("Failed to delete banner");
  }
}

export async function addItem(productId: string) {
  // — 1) AUTHENTICATE / SHORT-CIRCUIT —
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) {
    // will throw a NEXT_REDIRECT exception that Next.js handles
    // redirect("/");
    redirect("/api/auth/login");
  }

  // — 2) CART LOGIC in its own try/catch —
  try {
    // fetch existing cart
    const cart: Cart | null = await redis.get(`cart-${user.id}`);

    // fetch product
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, name: true, price: true, images: true },
    });
    if (!product) throw new Error("Product not found");

    // build new cart
    let newCart: Cart;
    if (!cart?.items?.length) {
      newCart = {
        userId: user.id,
        items: [
          {
            id: product.id,
            name: product.name,
            price: product.price,
            imageString: product.images[0],
            quantity: 1,
          },
        ],
      };
    } else {
      // clone & update quantity or append
      let found = false;
      const items = cart.items.map((i) => {
        if (i.id === product.id) {
          found = true;
          return { ...i, quantity: i.quantity + 1 };
        }
        return i;
      });
      if (!found) {
        items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          imageString: product.images[0],
          quantity: 1,
        });
      }
      newCart = { userId: user.id, items };
    }

    // persist
    await redis.set(`cart-${user.id}`, newCart);
  } catch (err) {
    console.error("Failed to add item to cart:", err);
    // This will show your error page / be caught by your error boundary
    throw new Error("Failed to add item to cart");
  }

  // — 3) REVALIDATE & REDIRECT outside the try/catch —
  revalidatePath("/", "layout");

  // TODO: you’ll need to figure out your locale –
  // either pass it in from the client or derive it from route params.
  const locale = "en";
  redirect(`/${locale}/bag`);
}

export async function delItem(formData: FormData) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return redirect("/");
    }

    const productId = formData.get("productId");
    const cart: Cart | null = await redis.get(`cart-${user.id}`);

    if (cart && cart.items) {
      const updateCart: Cart = {
        userId: user.id,
        items: cart.items.filter((item) => item.id !== productId),
      };

      await redis.set(`cart-${user.id}`, updateCart);
    }

    revalidatePath("/bag");
  } catch (error) {
    console.error("Failed to delete item from cart:", error);
    throw new Error("Failed to delete item from cart");
  }
}

export async function checkOut() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/");
  }

  const cart: Cart | null = await redis.get(`cart-${user.id}`);

  if (!cart || !cart.items || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  const total = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // First, ensure the user exists in the database
  const dbUser = await prisma.user.upsert({
    where: { id: user.id },
    update: {},
    create: {
      id: user.id,
      email: user.email || "",
      firstName: user.given_name || "",
      lastName: user.family_name || "",
      profileImage: user.picture || "",
    },
  });

  const order = await prisma.order.create({
    data: {
      userId: dbUser.id,
      amount: total,
      status: "pending",
    },
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: cart.items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: [item.imageString],
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    })),
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment/success?orderId=${order.id}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment/cancel`,
  });

  await redis.del(`cart-${user.id}`);
  redirect(session.url as string);
}
