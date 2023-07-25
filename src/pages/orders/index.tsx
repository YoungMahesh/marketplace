import Head from "next/head";
import Image from "next/image";
import Header from "~/components/Header/Header";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import LoadingImg from "public/loading.gif";
import { type OrderItem } from "@prisma/client";
import { getDate } from "~/utils/date.utils";

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
                      <OrderItemBox
                        key={idx}
                        orderDate={new Date()}
                        orderPrice={0}
                        isLoading={true}
                      />
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
  orderDate: Date;
  orderPrice: number;
  orderItems?: OrderItem[];
  isLoading?: boolean;
}) => {
  return (
    <section className="mx-2 my-4 rounded border-2 border-b-0">
      <p
        className="flex flex-wrap justify-between p-2"
        style={{ backgroundColor: "rgb(240, 242, 242)" }}
      >
        <span className="m-1 flex flex-col">
          <span>Order Placed</span>
          {isLoading ? (
            <span className="loading loading-dots loading-md" />
          ) : (
            <span> {getDate(orderDate)}</span>
          )}
        </span>
        <span className="m-1 flex flex-col">
          <span>Total</span>
          <span>
            {isLoading ? (
              <span className="loading loading-dots loading-md" />
            ) : (
              <span>&#8377; {orderPrice}</span>
            )}
          </span>
        </span>
        <span className="m-1 flex flex-col">
          <span>OrderId</span>
          <span>
            {isLoading ? (
              <span className="loading loading-dots loading-md" />
            ) : (
              <span># {orderId}</span>
            )}
          </span>
        </span>
      </p>
      <div>
        {isLoading
          ? Array.from({ length: 3 }).map((el, idx) => (
              <ItemBox
                key={idx}
                itemId={0}
                itemPrice={0}
                quantity={0}
                isLoading={true}
              />
            ))
          : orderItems?.map((item, idx) => (
              <ItemBox
                key={idx}
                itemId={item.id}
                quantity={item.quantity}
                itemPrice={item.price}
              />
            ))}
      </div>
    </section>
  );
};
const ItemBox = ({
  itemId,
  itemPrice,
  quantity,
  isLoading,
}: {
  itemId: number;
  itemPrice: number;
  quantity: number;
  isLoading?: boolean;
}) => {
  const { data: itemInfo, isError: itemInfoErr } = api.item.get.useQuery(
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
    <section className="border-b-2 p-4">
      <div className="flex flex-wrap items-center justify-around">
        <Image
          className="mask mask-squircle"
          src={itemInfo ? itemInfo.image : LoadingImg}
          height={90}
          width={90}
          alt="cart-item"
        />
        <div className="prose ml-4">
          <h4 className="m-0">{itemInfo ? itemInfo.name : "Loading..."}</h4>
          <p className="m-0">
            &#8377; {!isLoading && itemInfo ? itemPrice : "-"} / unit
          </p>
          <p className="m-0">Qnt: {quantity}</p>
        </div>
      </div>
    </section>
  );
};
