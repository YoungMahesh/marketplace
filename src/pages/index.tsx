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

// function AuthShowcase() {
//   const { data: sessionData } = useSession();

//   const { data: secretMessage } = api.example.getSecretMessage.useQuery(
//     undefined, // no input
//     { enabled: sessionData?.user !== undefined }
//   );

//   return (
//     <div className="flex flex-col items-center justify-center gap-4">
//       <p className="text-center text-2xl text-white">
//         {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
//         {secretMessage && <span> - {secretMessage}</span>}
//       </p>
//       <button
//         className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
//         onClick={sessionData ? () => void signOut() : () => void signIn()}
//       >
//         {sessionData ? "Sign out" : "Sign in"}
//       </button>
//     </div>
//   );
// }
