import products from '../../data/products.json';

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

// Simulate API delay for realistic feel
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchProducts = async (): Promise<Product[]> => {
  await delay(800); // Simulate network delay
  return products as Product[];
};

export const fetchProductById = async (id: string): Promise<Product | null> => {
  await delay(500); // Simulate network delay
  const product = products.find(p => p.id === id);
  return (product as Product) || null;
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  await delay(600); // Simulate network delay
  const lowercaseQuery = query.toLowerCase();
  return products.filter(
    product =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.category.toLowerCase().includes(lowercaseQuery)
  ) as Product[];
};
