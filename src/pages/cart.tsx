import Head from "next/head";
import Image from "next/image";
import Header from "~/components/Header/Header";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: sessionData } = useSession();
  const { data: cartObj, isLoading: cartLoading } = api.cart.getCart.useQuery(
    undefined,
    { enabled: sessionData && sessionData.user ? true : false }
  );

  console.log("cartObj", cartObj);
  return (
    <>
      <Head>
        <title> Cart | Marketplace</title>
        <meta name="description" content="Unique Collection of Images" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main>
        {sessionData && sessionData.user ? (
          <div>
            {(() => {
              if (cartLoading) return <p>Loading...</p>;
              if (cartObj)
                return (
                  <div className="flex flex-wrap justify-around">
                    {cartObj.cartItems.map((it, idx) => (
                      <CartItemBox
                        key={idx}
                        itemId={it.itemId}
                        quantity={it.quantity}
                      />
                    ))}
                  </div>
                );

              return <p>Failed to load Items.</p>;
            })()}
          </div>
        ) : null}
      </main>
    </>
  );
}

const CartItemBox = ({
  itemId,
  quantity,
}: {
  itemId: number;
  quantity: number;
}) => {
  const { data: itemInfo, isError: itemInfoErr } = api.item.get.useQuery({
    itemId,
  });

  if (itemInfoErr)
    return (
      <div>
        <h6>Failed to Load Item</h6>
      </div>
    );

  return (
    <div className="flex items-center justify-center">
      <div>
        {itemInfo ? (
          <Image src={itemInfo.image} height={70} width={70} alt="cart-item" />
        ) : null}
      </div>
      <div>
        <h6>{itemInfo ? itemInfo.name : "Loading..."}</h6>
        <div>
          <button>-</button> <span>{quantity}</span> <button>+</button>
        </div>
      </div>
      <div>
        <button>Remove</button>
      </div>
    </div>
  );
};
