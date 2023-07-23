import { useRouter } from "next/router";
import { useEffect } from "react";
import { api } from "~/utils/api";
import Head from "next/head";
import Header from "~/components/Header/Header";

export default function CartSuccess() {
  const router = useRouter();

  const { data: sessionInfo } = api.stripe.updateSessionInfo.useQuery(
    {
      session_id:
        router.query.session_id && typeof router.query.session_id === "string"
          ? router.query.session_id
          : "",
    },
    { enabled: router.query.session_id ? true : false }
  );

  console.log({ sessionInfo });

  useEffect(() => {
    const { session_id } = router.query;
    console.log({ session_id });
  }, [router.query]);

  return (
    <div>
      <Head>
        <title> Success | Marketplace</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <p className="text-center">Your payment is successful !</p>
    </div>
  );
}
