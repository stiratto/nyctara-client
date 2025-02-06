import AddProduct from "./AddProduct"
import { DeleteBulkProducts } from "./DeleteBulkProducts"

const ProductAdminPanel = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12"><AddProduct /><DeleteBulkProducts /></div>
  )
}

export default ProductAdminPanel
