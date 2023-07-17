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
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

export default function Home() {
  const { data: sessionData } = useSession();
  const { data: cartObj, isLoading: cartLoading } = api.cart.getCart.useQuery(
    undefined,
    { enabled: sessionData && sessionData.user ? true : false }
  );

  const [totalPr, setTotalPr] = useState(0);

  useEffect(() => {
    if (cartObj) setTotalPr(cartObj.totalPrice);
  }, [cartObj]);

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
              if (cartLoading)
                return (
                  <div className="ml-auto mr-auto w-80 md:w-96">
                    {Array.from({ length: 3 }).map((el, idx) => (
                      <CartItemBox
                        key={idx}
                        cartId={1}
                        cartItemId={1}
                        quantity={0}
                        isLoading={true}
                      />
                    ))}
                  </div>
                );
              if (cartObj)
                return (
                  <div className="ml-auto mr-auto w-80 md:w-96">
                    {cartObj.cartItems.map((it, idx) => (
                      <CartItemBox
                        key={idx}
                        cartId={cartObj.id}
                        itemId={it.itemId}
                        cartItemId={it.id}
                        quantity={it.quantity}
                        setTotalPr={setTotalPr}
                      />
                    ))}
                    <>
                      {cartObj.cartItems.length === 0 ? (
                        <p>Cart is Empty.</p>
                      ) : (
                        <>
                          <div className="prose">
                            <h3>Total Amount: &#8377; {totalPr} </h3>
                          </div>
                          <div className="mt-2 flex justify-end">
                            <button className="btn-primary btn">
                              Checkout
                            </button>
                          </div>
                        </>
                      )}
                    </>
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
  cartId,
  itemId,
  cartItemId,
  quantity,
  setTotalPr,
  isLoading,
}: {
  cartId: number;
  itemId?: number;
  cartItemId: number;
  quantity: number;
  setTotalPr?: Dispatch<SetStateAction<number>>;
  isLoading?: boolean;
}) => {
  const [quant1, setQuant1] = useState(quantity);
  const { data: itemInfo, isError: itemInfoErr } = api.item.get.useQuery(
    {
      itemId: itemId !== undefined ? itemId : 0,
    },
    { enabled: itemId !== undefined ? true : false }
  );
  const { refetch: refetchCartItems } = api.cart.getCart.useQuery();

  const { mutateAsync: updateQuantity } = api.cart.updateQuantity.useMutation();
  const { mutateAsync: removeFromCart } = api.cart.removeFromCart.useMutation();

  const updateQnt = async (isIncrease: boolean) => {
    if (!itemInfo) return alert("Failed to fetch item info");
    if (isIncrease) {
      setQuant1(quant1 + 1);
      setTotalPr ? setTotalPr((pr) => pr + itemInfo.price) : null;
      await updateQuantity({ cartId, cartItemId, isIncrease: true });
    } else {
      if (quant1 <= 1) return alert("Quantity cannot be less than 1");
      setQuant1(quant1 - 1);
      setTotalPr ? setTotalPr((pr) => pr - itemInfo.price) : null;
      await updateQuantity({ cartId, cartItemId, isIncrease: false });
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
          src={!isLoading && itemInfo ? itemInfo.image : LoadingImg}
          height={90}
          width={90}
          alt="cart-item"
        />
        <div className="prose ml-4">
          <h4 className="">
            {!isLoading && itemInfo ? itemInfo.name : "Loading..."}
          </h4>
          <p>
            &#8377; {!isLoading && itemInfo ? itemInfo.price * quant1 : "-"}
          </p>
        </div>
      </div>
      <div className="ml-2 mt-2 flex justify-between">
        <div className="flex items-center">
          <button onClick={() => void updateQnt(false)} disabled={isLoading}>
            <MinusCircleIcon className="h-8 w-8" />
          </button>
          <span className="mx-2">{quant1}</span>
          <button onClick={() => void updateQnt(true)} disabled={isLoading}>
            <PlusCircleIcon className="h-8 w-8" />
          </button>
        </div>
        <div>
          <button onClick={() => void removeFromCart1()} disabled={isLoading}>
            <TrashIcon className="h-8 w-8" />
          </button>
        </div>
      </div>
    </section>
  );
};
