import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
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
