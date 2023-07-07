import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const itemRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ itemId: z.number() }))
    .query(async ({ ctx, input }) => {
      const { itemId } = input;
      return await ctx.prisma.item.findUnique({
        where: {
          id: itemId,
        },
      });
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.item.findMany({
      take: 10,
    });
  }),

  updatePass: protectedProcedure
    .input(z.object({ newPassword: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { newPassword } = input;
      await ctx.prisma.userCred.update({
        where: {
          username: ctx.session.user.name,
        },
        data: {
          password: newPassword,
        },
      });
    }),

  deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.user.delete({
      where: {
        id: ctx.session.user.id,
      },
    });
  }),
});
