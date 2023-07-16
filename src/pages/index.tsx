import Head from "next/head";
import Header from "~/components/Header/Header";
import ItemBox from "~/components/Home/ItemBox";
import { api } from "~/utils/api";

export default function Home() {
  const { data: itemsList, isLoading: itemsListLoading } =
    api.item.getAll.useQuery();

  console.log("itemsList", itemsList);
  return (
    <>
      <Head>
        <title>Marketplace</title>
        <meta name="description" content="Unique Collection of Images" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main>
        <div>
          {/* {Array.from({length: 6}).map((el, idx) => <ItemBox key={idx}  />)} */}
        </div>
        <div>
          {(() => {
            if (itemsListLoading)
              return (
                <div className="flex flex-wrap justify-around">
                  {Array.from({ length: 6 }).map((el, idx) => (
                    <ItemBox
                      key={idx}
                      id={1}
                      name={""}
                      image={""}
                      price={0}
                      isLoading={true}
                    />
                  ))}
                </div>
              );
            if (itemsList)
              return (
                <div className="flex flex-wrap justify-around">
                  {itemsList.map((it, idx) => (
                    <ItemBox
                      key={idx}
                      id={it.id}
                      name={it.name}
                      image={it.image}
                      price={it.price}
                    />
                  ))}
                </div>
              );

            return <p>Failed to load Items.</p>;
          })()}
        </div>
      </main>
    </>
  );
}
