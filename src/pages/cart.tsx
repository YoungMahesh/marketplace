import Head from "next/head";
import Image from "next/image";
import Header from "~/components/Header/Header";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import LoadingImg from "public/loading.gif";
import {
  MinusCircleIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

export default function Home() {
  const { data: sessionData } = useSession();
  const { data: cartObj, isLoading: cartLoading } = api.cart.getCart.useQuery(
    undefined,
    { enabled: sessionData && sessionData.user ? true : false }
  );

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
                  <div className="ml-auto mr-auto w-80 md:w-96">
                    {cartObj.cartItems.map((it, idx) => (
                      <CartItemBox
                        key={idx}
                        itemId={it.itemId}
                        cartItemId={it.id}
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
  cartItemId,
  quantity,
}: {
  itemId: number;
  cartItemId: number;
  quantity: number;
}) => {
  const [quant1, setQuant1] = useState(quantity);
  const { data: itemInfo, isError: itemInfoErr } = api.item.get.useQuery({
    itemId,
  });
  const { refetch: refetchCartItems } = api.cart.getCart.useQuery();

  const { mutateAsync: updateQuantity } = api.cart.updateQuantity.useMutation();
  const { mutateAsync: removeFromCart } = api.cart.removeFromCart.useMutation();

  const updateQnt = async (isIncrease: boolean) => {
    if (isIncrease) {
      console.log({ itemId, isIncrease });
      setQuant1(quant1 + 1);
      await updateQuantity({ cartItemId, isIncrease: true });
    } else {
      if (quant1 <= 1) return alert("Quantity cannot be less than 1");
      setQuant1(quant1 - 1);
      await updateQuantity({ cartItemId, isIncrease: false });
    }
  };

  const removeFromCart1 = async () => {
    await removeFromCart({ cartItemId });
    await refetchCartItems();
  };

  if (itemInfoErr)
    return (
      <div>
        <h6>Failed to Load Item</h6>
      </div>
    );

  return (
    <section className="mx-2 my-4 rounded border p-2">
      <div className="flex">
        <Image
          className="mask mask-squircle"
          src={itemInfo ? itemInfo.image : LoadingImg}
          height={90}
          width={90}
          alt="cart-item"
        />
        <div className="prose ml-4">
          <h4 className="">{itemInfo ? itemInfo.name : "Loading..."}</h4>
          <p>&#8377; {itemInfo ? itemInfo.price : "-"}</p>
        </div>
      </div>
      <div className="ml-2 mt-2 flex justify-between">
        <div className="flex items-center">
          <button onClick={() => void updateQnt(false)}>
            <MinusCircleIcon className="h-8 w-8" />
          </button>
          <span className="mx-2">{quant1}</span>
          <button onClick={() => void updateQnt(true)}>
            <PlusCircleIcon className="h-8 w-8" />
          </button>
        </div>
        <div>
          <button onClick={() => void removeFromCart1()}>
            <TrashIcon className="h-8 w-8" />
          </button>
        </div>
      </div>
    </section>
  );
};
