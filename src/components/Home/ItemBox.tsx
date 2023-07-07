import Image from "next/image";
import { api } from "~/utils/api";

export default function ItemBox({
  id,
  name,
  image,
  price,
}: {
  id: number;
  name: string;
  image: string;
  price: number;
}) {
  const { mutateAsync: addToCart } = api.cart.addToCart.useMutation();

  const addToCart1 = async () => {
    await addToCart({ itemId: id, quantity: 1 });
  };

  return (
    <section className="card m-4 w-96 bg-base-100 shadow-xl">
      <figure>
        <Image
          className="mask mask-squircle"
          src={image}
          width={250}
          height={250}
          alt="item"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{name}</h2>
        <p className="text-right">Price: &#8377;{price}</p>
        <div className="card-actions justify-end">
          <button className="btn-primary btn" onClick={() => void addToCart1()}>
            Add to Cart
          </button>
          <button className="btn-primary btn">Buy Now</button>
        </div>
      </div>
    </section>
  );
}
