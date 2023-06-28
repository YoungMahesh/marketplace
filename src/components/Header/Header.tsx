// import ShopIcon from ''
import Image from "next/image";
export default function Header() {
  return (
    <header className="flex flex-wrap items-center justify-between px-4 py-2">
      <div>
        <Image
          src="/shop.svg"
          width={70}
          height={70}
          priority={true}
          alt="shop"
        />
      </div>{" "}
      <div></div>
    </header>
  );
}
