import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
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

    const stripe_items = userCart.cartItems.map((cItem) => {
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
    const product_items = userCart.cartItems.map((cItem) => {
      return {
        itemId: cItem.item.id,
        price: cItem.item.price,
        quantity: cItem.quantity,
      };
    });
    console.log({
      stripe_items: JSON.stringify(stripe_items, null, 2),
      product_items: JSON.stringify(product_items, null, 2),
    });

    const stripeSession = await stripe.checkout.sessions.create({
      line_items: stripe_items,
      mode: "payment",
      success_url:
        "http://localhost:3000/cart/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:3000/cart/cancel",
    });

    await ctx.prisma.order.create({
      data: {
        userId: ctx.session.user.id,
        txnHash: stripeSession.id,
        amount: stripeSession.amount_total
          ? stripeSession.amount_total / 100
          : 0,
        items: {
          createMany: {
            data: product_items,
          },
        },
      },
    });

    console.log({ stripeSession });
    return stripeSession.url;
  }),

  updateSessionInfo: protectedProcedure
    .input(z.object({ session_id: z.string() }))
    .query(async ({ ctx, input }) => {
      const session = await stripe.checkout.sessions.retrieve(input.session_id);
      if (!session) throw new Error("Session not found");

      const payment = await ctx.prisma.order.findUnique({
        where: {
          txnHash: session.id,
        },
      });
      if (!payment) throw new Error("Payment not found");

      if (session.payment_status === "paid" && payment.status !== "SUCCESS") {
        await ctx.prisma.order.update({
          where: {
            txnHash: session.id,
          },
          data: {
            status: "SUCCESS",
          },
        });

        await ctx.prisma.cart.update({
          where: {
            userId: ctx.session.user.id,
          },
          data: {
            cartItems: {
              deleteMany: {},
            },
          },
        });
      }

      return { session };
    }),
});
