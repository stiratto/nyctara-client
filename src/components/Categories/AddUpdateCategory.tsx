import AddCategory from "./AddCategory";
import { UpdateCategoriesSelect } from "./UpdateCategoriesSelect";

const AddUpdateCategory = () => {

  return (
    <section className="flex flex-col justify-center items-center w-full py-24 space-y-24">
      <div className="flex flex-col justify-center items-center space-y-8 w-full ">
        <h1 className="text-6xl mb-8">Categorias</h1>

        <AddCategory />
        <UpdateCategoriesSelect />
      </div>

    </section>
  );
};

export default AddUpdateCategory;
