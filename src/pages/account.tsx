import { useSession } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";
import Header from "~/components/Header/Header";
import { api } from "~/utils/api";

export default function Home() {
  const [newPass, setNewPass] = useState("");

  const { data: sessionData } = useSession();
  const { mutateAsync: updatePass } = api.user.updatePass.useMutation();

  const changePassword = async () => {
    try {
      await updatePass({ newPassword: newPass });
      alert("Password updated successfully");
    } catch (err) {
      console.log(err);
      alert("Got Error, while updating password");
    }
  };

  return (
    <>
      <Head>
        <title> Account | Marketplace</title>
        <meta name="description" content="Unique Collection of Images" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      {sessionData && sessionData.user ? (
        <main className="flex justify-center">
          <div className="form-control">
            <label className="input-group">
              <span>Username</span>
              <input
                type="text"
                // placeholder="info@site.com"
                className="input-bordered input"
                value={sessionData.user.name}
                disabled={true}
              />
            </label>
            <div className="form-control mt-1">
              <label className="input-group">
                <span>Password</span>
                <input
                  type="password"
                  // placeholder="info@site.com"
                  className="input-bordered input"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                />
              </label>
            </div>
            <button
              className="btn-primary btn mt-2"
              onClick={() => void changePassword()}
            >
              Update Password
            </button>
          </div>
        </main>
      ) : null}
    </>
  );
}
