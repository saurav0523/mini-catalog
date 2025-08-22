// Define the Product interface
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  rating: number;
  reviews: number;
}

// Import the products data with proper typing
import productsData from '../../data/products.json';

// Type assertion to ensure the imported data matches our interface
const products: Product[] = productsData as Product[];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchProducts = async (): Promise<Product[]> => {
  await delay(800); 
  return products;
};

export const fetchProductById = async (id: string): Promise<Product | null> => {
  await delay(500);
  const product = products.find(p => p.id === id);
  return product || null;
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  await delay(600);
  const lowercaseQuery = query.toLowerCase();
  return products.filter(
    product =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.category.toLowerCase().includes(lowercaseQuery)
  );
};
