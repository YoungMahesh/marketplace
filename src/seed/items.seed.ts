import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient({});

const uploadItems = async () => {
  for (let i = 0; i < 10; i++) {
    await prisma.item.create({
      data: {
        id: i,
        name: `Item #${i}`,
        image: `https://eu2.contabostorage.com/fb45eb7ffe344060838ba15d63d17ea9:nft/numbers/${i}.png`,
        price: 10 + i,
      },
    });
  }
};

uploadItems()
  .then(() => console.log("cart-items created in database"))
  .catch((err) => console.log(err));
// run `npx tsx src/seed/items.seed.ts` to execute this file
