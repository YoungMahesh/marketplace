import { createTRPCRouter } from "~/server/api/trpc";
import { itemRouter } from "./routers/item.router";
import { userRouter } from "./routers/user.router";
import { cartRouter } from "./routers/cart.router";
import { stripeRouter } from "./routers/stripe.router";
import { ordersRouter } from "./routers/orders.router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  cart: cartRouter,
  orders: ordersRouter,
  item: itemRouter,
  user: userRouter,
  stripe: stripeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
