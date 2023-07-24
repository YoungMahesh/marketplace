import Head from "next/head";
import Image from "next/image";
import Header from "~/components/Header/Header";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import LoadingImg from "public/loading.gif";
import { type OrderItem } from "@prisma/client";

export default function OrdersPage() {
  const { data: sessionData } = useSession();
  const { data: ordersList, isLoading: areOrdersLoading } =
    api.orders.getOrders.useQuery(undefined, {
      enabled: sessionData && sessionData.user ? true : false,
    });

  return (
    <>
      <Head>
        <title> Orders | Marketplace</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main>
        {sessionData && sessionData.user ? (
          <div>
            {(() => {
              if (areOrdersLoading)
                return (
                  <div className="ml-auto mr-auto w-80 md:w-96">
                    {Array.from({ length: 3 }).map((el, idx) => (
                      <OrderItemBox key={idx} isLoading={true} />
                    ))}
                  </div>
                );
              if (ordersList)
                return (
                  <div className="ml-auto mr-auto w-80 md:w-96">
                    {ordersList.map((order, idx) => (
                      <OrderItemBox
                        key={idx}
                        orderId={order.id}
                        orderDate={order.date}
                        orderPrice={order.amount}
                        orderItems={order.items}
                      />
                    ))}
                    <>
                      {ordersList.length === 0 ? (
                        <p>You does not placed any order until yet.</p>
                      ) : (
                        <></>
                      )}
                    </>
                  </div>
                );

              return <p>Failed to load orders.</p>;
            })()}
          </div>
        ) : null}
      </main>
    </>
  );
}

const OrderItemBox = ({
  orderId,
  orderDate,
  orderPrice,
  orderItems,
  isLoading,
}: {
  orderId?: number;
  orderDate?: Date;
  orderPrice?: number;
  orderItems?: OrderItem[];
  isLoading?: boolean;
}) => {
  return (
    <section className="mx-2 my-4 rounded border p-2">
      <div>
        <span>Order Placed: {orderDate?.toDateString()}</span>
        <span>Total: {orderPrice}</span>
        <span>OrderId: # {orderId}</span>
      </div>
      <div>
        {isLoading
          ? Array.from({ length: 3 }).map((el, idx) => (
              <ItemBox key={idx} itemId={0} itemPrice={0} isLoading={true} />
            ))
          : orderItems?.map((item, idx) => (
              <ItemBox key={idx} itemId={item.id} itemPrice={item.price} />
            ))}
      </div>
    </section>
  );
};
const ItemBox = ({
  itemId,
  itemPrice,
  isLoading,
}: {
  itemId: number;
  itemPrice: number;
  isLoading?: boolean;
}) => {
  const {
    data: itemInfo,
    isLoading: itemInfoLoading,
    isError: itemInfoErr,
  } = api.item.get.useQuery(
    {
      itemId,
    },
    { enabled: !isLoading }
  );

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
          <p>&#8377; {!isLoading && itemInfo ? itemPrice : "-"}</p>
        </div>
      </div>
    </section>
  );
};
