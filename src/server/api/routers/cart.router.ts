import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const cartRouter = createTRPCRouter({
  getCart: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.cart.findUnique({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        cartItems: true,
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
