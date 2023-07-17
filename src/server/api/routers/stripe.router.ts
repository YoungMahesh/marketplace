import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import Stripe from "stripe";
import { env } from "~/env.mjs";
const stripe = new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: "2022-11-15" });

export const stripeRouter = createTRPCRouter({
  createPayment: protectedProcedure
    .input(z.object({}))
    .mutation(async ({ ctx }) => {
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
            unit_amount: cItem.item.price,
          },
          quantity: cItem.quantity,
        };
      });

      const session = await stripe.checkout.sessions.create({
        line_items,
        mode: "payment",
        success_url: "http://localhost:3000/success",
        cancel_url: "http://localhost:3000/cancel",
      });

      console.log({ session });

      return session.url;
    }),
});
