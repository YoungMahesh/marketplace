import { useRouter } from "next/router";
import { useEffect } from "react";
import { api } from "~/utils/api";
export default function CartSuccess() {
  const router = useRouter();

  const { data: sessionInfo } = api.stripe.getSessionInfo.useQuery(
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
      <p>Your payment is successful</p>
    </div>
  );
}
