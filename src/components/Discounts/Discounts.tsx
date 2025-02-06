import { AddDiscount } from "./AddDiscount";
import { ExistingDiscounts } from "./ExistingDiscounts";

const Discounts = () => {
  return (
    <section className="py-24 lg:h-screen  flex flex-col  gap-8 justify-center items-center w-full container">
      <h1 className="text-6xl mb-8">Descuentos</h1>
      <div className="flex flex-col lg:flex-row gap-8 items-center w-full max-w-3xl">
        <AddDiscount />
        <ExistingDiscounts />
      </div>
    </section>
  );
};

export default Discounts;
