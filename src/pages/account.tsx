import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";
import Swal from "sweetalert2";
import Header from "~/components/Header/Header";
import { api } from "~/utils/api";

export default function Home() {
  const [newPass, setNewPass] = useState("");

  const { data: sessionData } = useSession();
  const { mutateAsync: updatePass } = api.user.updatePass.useMutation();
  const { mutateAsync: deleteAccount } = api.user.deleteAccount.useMutation();

  const changePassword = async () => {
    try {
      await updatePass({ newPassword: newPass });
      void Swal.fire("Updated!", "Your password has been updated", "success");
    } catch (err) {
      console.log(err);
      void Swal.fire(
        "Error!",
        "Could not able to update your password",
        "error"
      );
    }
  };

  const deleteAccount1 = async () => {
    try {
      await Swal.fire({
        title: "Are you sure about deleting your account?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "red",
        cancelButtonColor: "green",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await deleteAccount();
          await signOut();
        }
      });
    } catch (err) {
      console.log(err);
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
            <button
              className="btn-primary btn mt-2"
              onClick={() => void deleteAccount1()}
            >
              Delete Account
            </button>
          </div>
        </main>
      ) : null}
    </>
  );
}
