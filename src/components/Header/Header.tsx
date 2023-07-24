import Link from "next/link";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
export default function Header() {
  const router = useRouter();
  const { data: sessionData } = useSession();

  return (
    <header className="flex flex-wrap items-center justify-between px-4 py-2">
      <div>
        <Image
          src="/shop.svg"
          width={70}
          height={70}
          priority={true}
          alt="shop"
          onClick={() => void router.push("/")}
          className="cursor-pointer"
        />
      </div>
      <div className="flex">
        <div className="mx-2 cursor-pointer">
          {sessionData && sessionData.user ? (
            <Image
              src="/cart.svg"
              width={50}
              height={50}
              alt="cart"
              onClick={() => void router.push("/cart")}
            />
          ) : null}
        </div>
        <div className="ml-2">
          {sessionData && sessionData.user ? (
            <div className="dropdown-end dropdown">
              <label tabIndex={0} className="btn-primary btn-outline btn m-1">
                {sessionData.user.name}
              </label>

              <ul
                tabIndex={0}
                className="dropdown-content menu rounded-box z-[1] w-52 bg-base-100 p-2 shadow"
              >
                <li>
                  <Link href="/account">Account</Link>
                </li>
                <li>
                  <Link href="/cart">Cart</Link>
                </li>
                <li>
                  <Link href="/orders">Orders</Link>
                </li>
                <li>
                  <a onClick={() => void signOut()}>Log out</a>
                </li>
              </ul>
            </div>
          ) : (
            <button
              className="btn-primary btn-outline btn"
              onClick={() => void signIn()}
            >
              Log In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
