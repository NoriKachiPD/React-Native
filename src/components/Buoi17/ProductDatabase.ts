import AsyncStorage from '@react-native-async-storage/async-storage';

const CATEGORIES_KEY = 'CATEGORIES_KEY';
const PRODUCTS_KEY = 'PRODUCTS_KEY';

export interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
}

export interface Product {
  id: string;
  name: string;
  price: string;
  image: string; // Tên file ảnh, ví dụ: 'ComGa.jpg'
  categoryId: number;
}

const ProductDatabase = {
  getCategories: async (): Promise<Category[]> => {
    try {
      const jsonValue = await AsyncStorage.getItem(CATEGORIES_KEY);
      return jsonValue ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error('Failed to load categories', e);
      return [];
    }
  },

  saveCategories: async (categories: Category[]): Promise<void> => {
    try {
      await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    } catch (e) {
      console.error('Failed to save categories', e);
    }
  },

  getProducts: async (): Promise<Product[]> => {
    try {
      const jsonValue = await AsyncStorage.getItem(PRODUCTS_KEY);
      return jsonValue ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error('Failed to load products', e);
      return [];
    }
  },

  saveProducts: async (products: Product[]): Promise<void> => {
    try {
      await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products', e);
    }
  },

  addCategory: async (category: Category): Promise<void> => {
    const categories = await ProductDatabase.getCategories();
    categories.push(category);
    await ProductDatabase.saveCategories(categories);
  },

  updateCategory: async (updatedCategory: Category): Promise<void> => {
    let categories = await ProductDatabase.getCategories();
    categories = categories.map(c => (c.id === updatedCategory.id ? updatedCategory : c));
    await ProductDatabase.saveCategories(categories);
  },

  deleteCategory: async (id: number): Promise<void> => {
    let categories = await ProductDatabase.getCategories();
    categories = categories.filter(c => c.id !== id);
    await ProductDatabase.saveCategories(categories);

    let products = await ProductDatabase.getProducts();
    products = products.filter(p => p.categoryId !== id);
    await ProductDatabase.saveProducts(products);
  },

  addProduct: async (product: Product): Promise<void> => {
    const products = await ProductDatabase.getProducts();
    products.push(product);
    await ProductDatabase.saveProducts(products);
  },

  updateProduct: async (updatedProduct: Product): Promise<void> => {
    let products = await ProductDatabase.getProducts();
    products = products.map(p => (p.id === updatedProduct.id ? updatedProduct : p));
    await ProductDatabase.saveProducts(products);
  },

  deleteProduct: async (id: string): Promise<void> => {
    let products = await ProductDatabase.getProducts();
    products = products.filter(p => p.id !== id);
    await ProductDatabase.saveProducts(products);
  },
};

export default ProductDatabase;