import Image from "next/image";

export default function ItemBox({
  name,
  image,
  price,
}: {
  name: string;
  image: string;
  price: number;
}) {
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
          <button className="btn-primary btn">Add to Cart</button>
          <button className="btn-primary btn">Buy Now</button>
        </div>
      </div>
    </section>
  );
}
