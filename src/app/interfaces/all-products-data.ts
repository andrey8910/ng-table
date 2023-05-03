import {ProductData} from "./product-data";

export interface AllProductsData {
  limit: number,
  products: ProductData[]
  total : number,
}
