import { TypographyH1 } from "../Typography/h1";
import AddCategory from "./AddCategory";
import { UpdateCategoriesSelect } from "./UpdateCategoriesSelect";

const AddUpdateCategory = () => {

  return (
    <section className="flex flex-col justify-center items-start w-full py-24 space-y-24 container max-w-xl">
      <div className="flex flex-col items-start space-y-8 w-full ">
        <TypographyH1 >Categorias</TypographyH1>
        <AddCategory />
        <UpdateCategoriesSelect />
      </div>

    </section>
  );
};

export default AddUpdateCategory;
