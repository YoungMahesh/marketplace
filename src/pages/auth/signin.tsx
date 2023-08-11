import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getProviders, signIn } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import authOptions from "../api/auth/[...nextauth]";
import Header from "~/components/Header/Header";
import { useState } from "react";

// console.log({ providers });
// {
//   "id": "credentials",
//   "name": "SignIn",
//   "type": "credentials",
//   "signinUrl": "http://localhost:3000/api/auth/signin/credentials",
//   "callbackUrl": "http://localhost:3000/api/auth/callback/credentials"
// }
export default function SignIn({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const signIn1 = async () => {
    const signInProvider = Object.values(providers)[0];
    if (!signInProvider)
      return alert("Failed to fetch information from server");
    const result = await signIn(signInProvider.id, {
      username,
      password,
      redirect: false,
    });
    if (result && result.status === 200) {
      window.location.href = "/";
    } else {
      alert("Login Failed");
    }
  };

  return (
    <div>
      <Header />
      <div className="m-2 m-2 mt-6 flex flex-col items-center">
        <input
          type="text"
          name="username"
          placeholder="Username"
          className="input-bordered input w-full max-w-xs"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="input-bordered input w-full max-w-xs"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="btn-primary btn-outline btn mt-2 w-full max-w-xs"
          onClick={() => void signIn1()}
        >
          Sign In
        </button>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const session = await getServerSession(context.req, context.res, authOptions);

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: "/" } };
  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}
