import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const cartRouter = createTRPCRouter({
  getCart: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.cart.findUnique({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        cartItems: {
          orderBy: {
            id: "asc",
          },
        },
      },
    });
  }),

  getCartItem: protectedProcedure
    .input(z.object({ cartItemId: z.number() }))
    .query(async ({ ctx, input }) => {
      const { cartItemId } = input;
      return await ctx.prisma.cartItem.findUnique({
        where: {
          id: cartItemId,
        },
      });
    }),

  addToCart: protectedProcedure
    .input(z.object({ itemId: z.number(), quantity: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { itemId, quantity } = input;

      await ctx.prisma.cart.upsert({
        where: {
          userId: ctx.session.user.id,
        },
        create: {
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          cartItems: {
            create: {
              item: {
                connect: {
                  id: itemId,
                },
              },
              quantity,
            },
          },
        },
        update: {
          cartItems: {
            create: {
              item: {
                connect: {
                  id: itemId,
                },
              },
              quantity,
            },
          },
        },
      });
    }),

  updateQuantity: protectedProcedure
    .input(z.object({ cartItemId: z.number(), isIncrease: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const { cartItemId, isIncrease } = input;

      const currItem = await ctx.prisma.cartItem.findUnique({
        where: {
          id: cartItemId,
        },
      });

      if (currItem && currItem.quantity <= 1 && isIncrease === false) {
        throw new Error("cart item quantity cannot be less than 1");
      }

      console.log({ cartItemId, isIncrease });
      await ctx.prisma.cartItem.update({
        where: {
          id: cartItemId,
        },
        data: {
          quantity: {
            ...(isIncrease ? { increment: 1 } : { decrement: 1 }),
          },
        },
      });
    }),

  removeFromCart: protectedProcedure
    .input(z.object({ cartItemId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { cartItemId } = input;
      await ctx.prisma.cart.update({
        where: {
          userId: ctx.session.user.id,
        },
        data: {
          cartItems: {
            delete: {
              id: cartItemId,
            },
          },
        },
      });
    }),
});
