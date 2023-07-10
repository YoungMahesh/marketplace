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

      const itemInfo = await ctx.prisma.item.findUnique({
        where: {
          id: itemId,
        },
      });
      if (!itemInfo) throw new Error("Item not found");

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
          totalPrice: itemInfo.price * quantity,
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
          totalPrice: {
            increment: itemInfo.price * quantity,
          },
        },
      });
    }),

  updateQuantity: protectedProcedure
    .input(
      z.object({
        cartId: z.number(),
        cartItemId: z.number(),
        isIncrease: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { cartId, cartItemId, isIncrease } = input;

      const currItem = await ctx.prisma.cartItem.findUnique({
        where: {
          id: cartItemId,
        },
        include: {
          item: {
            select: {
              price: true,
            },
          },
        },
      });

      if (!currItem) throw new Error("Cart Item does not exist");

      if (currItem.quantity <= 1 && isIncrease === false) {
        throw new Error("cart item quantity cannot be less than 1");
      }

      await ctx.prisma.cart.update({
        where: {
          id: cartId,
        },
        data: {
          cartItems: {
            update: {
              where: {
                id: cartItemId,
              },
              data: {
                quantity: {
                  ...(isIncrease ? { increment: 1 } : { decrement: 1 }),
                },
              },
            },
          },
          totalPrice: {
            ...(isIncrease
              ? { increment: currItem.item.price }
              : { decrement: currItem.item.price }),
          },
        },
      });
    }),

  removeFromCart: protectedProcedure
    .input(z.object({ cartItemId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { cartItemId } = input;
      const cartItem = await ctx.prisma.cartItem.findUnique({
        where: {
          id: cartItemId,
        },
        include: {
          item: {
            select: {
              price: true,
            },
          },
        },
      });

      if (!cartItem) throw new Error("Cart Item does not exist");

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
          totalPrice: {
            decrement: cartItem.item.price * cartItem.quantity,
          },
        },
      });
    }),
});
