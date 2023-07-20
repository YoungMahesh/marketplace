import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import Stripe from "stripe";
import { env } from "~/env.mjs";
const stripe = new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: "2022-11-15" });

export const stripeRouter = createTRPCRouter({
  createPayment: protectedProcedure.mutation(async ({ ctx }) => {
    const userCart = await ctx.prisma.cart.findUnique({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        cartItems: {
          include: {
            item: true,
          },
        },
      },
    });
    if (!userCart) throw new Error("User cart not found");

    const line_items = userCart.cartItems.map((cItem) => {
      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: cItem.item.name,
          },
          unit_amount: cItem.item.price * 100, // Stripe expects price in paisa for rupee, cent for dollar
        },
        quantity: cItem.quantity,
      };
    });

    console.log({ line_items: JSON.stringify(line_items, null, 2) });
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url:
        "http://localhost:3000/cart/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:3000/cart/cancel",
    });

    console.log({ createPayment: session });
    return session.url;
  }),

  getSessionInfo: publicProcedure
    .input(z.object({ session_id: z.string() }))
    .query(async ({ ctx, input }) => {
      const session = await stripe.checkout.sessions.retrieve(input.session_id);
      if (!session) throw new Error("Session not found");
      console.log({ getSessionInfo: session });
      return { session };
    }),

  storePaymentInfo: protectedProcedure.mutation(async ({ ctx, input }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
    });
    if (!user) throw new Error("User not found");
  }),
});
