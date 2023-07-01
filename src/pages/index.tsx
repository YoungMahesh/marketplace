// import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Header from "~/components/Header/Header";
// import Link from "next/link";
import ItemBox from "~/components/Home/ItemBox";
import { api } from "~/utils/api";

export default function Home() {
  const { data: itemsList, isLoading: itemsListLoading } =
    api.item.getAll.useQuery();

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
          {(() => {
            if (itemsListLoading) return <p>Loading...</p>;
            if (itemsList)
              return (
                <div className="flex flex-wrap justify-around">
                  {itemsList.map((it, idx) => (
                    <ItemBox
                      key={idx}
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
