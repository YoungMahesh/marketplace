import Image from "next/image";
import { api } from "~/utils/api";
import LoadingImg from "public/loading.gif";

export default function ItemBox({
  id,
  name,
  image,
  price,
  isLoading,
}: {
  id: number;
  name: string;
  image: string;
  price: number;
  isLoading?: boolean;
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
          src={isLoading ? LoadingImg : image}
          width={250}
          height={250}
          alt="item"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          {isLoading ? (
            <span className="loading loading-dots loading-lg"></span>
          ) : (
            name
          )}
        </h2>
        <p className="text-right">
          {isLoading ? (
            <span className="loading loading-dots loading-md"></span>
          ) : (
            <span>Price: &nbsp; &#8377;{price}</span>
          )}
        </p>
        <div className="card-actions justify-end">
          <button
            className="btn-primary btn"
            onClick={() => void addToCart1()}
            disabled={isLoading}
          >
            Add to Cart
          </button>
          <button className="btn-primary btn" disabled={isLoading}>
            Buy Now
          </button>
        </div>
      </div>
    </section>
  );
}
