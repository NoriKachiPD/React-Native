//components/Buoi11/database.ts
import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

let db: SQLiteDatabase | null = null;

const getDb = async (): Promise<SQLiteDatabase> => {
  if (db) return db;
  db = await SQLite.openDatabase({ name: 'myDatabase.db', location: 'default' });
  return db;
};

export type Category = { id: number; name: string; };
export type Product = { id: number; name: string; price: number; img: string; categoryId: number; };

const initialCategories: Category[] = [
  { id: 1, name: 'Áo' }, { id: 2, name: 'Giày' }, { id: 3, name: 'Balo' }, { id: 4, name: 'Mũ' }, { id: 5, name: 'Túi' },
];

const initialProducts: Product[] = [
  { id: 1, name: 'Áo sơ mi', price: 250000, img: '1.jpg', categoryId: 1 },
  { id: 2, name: 'Giày sneaker', price: 1100000, img: '2.jpg', categoryId: 2 },
  { id: 3, name: 'Balo thời trang', price: 490000, img: '2.jpg', categoryId: 3 },
  { id: 4, name: 'Mũ lưỡi trai', price: 120000, img: '1.jpg', categoryId: 4 },
  { id: 5, name: 'Túi xách nữ', price: 980000, img: '1.jpg', categoryId: 5 },
];

export const initDatabase = async (onSuccess?: () => void): Promise<void> => {
  try {
    const database = await getDb();

    database.transaction(tx => {
      tx.executeSql('DROP TABLE IF EXISTS products');
      tx.executeSql('DROP TABLE IF EXISTS categories');

      tx.executeSql('CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY, name TEXT)');
      initialCategories.forEach(c =>
        tx.executeSql('INSERT OR IGNORE INTO categories (id, name) VALUES (?, ?)', [c.id, c.name])
      );

      tx.executeSql(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        price REAL,
        img TEXT,
        categoryId INTEGER,
        FOREIGN KEY (categoryId) REFERENCES categories(id)
      )`);
      initialProducts.forEach(p =>
        tx.executeSql('INSERT OR IGNORE INTO products (id, name, price, img, categoryId) VALUES (?, ?, ?, ?, ?)',
          [p.id, p.name, p.price, p.img, p.categoryId])
      );
    },
    (err) => console.error('❌ Transaction error:', err),
    () => {
      console.log('✅ Database initialized');
      if (onSuccess) onSuccess();
    });

  } catch (error) {
    console.error('❌ initDatabase error:', error);
  }
};

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const db = await getDb();
    const [results] = await db.executeSql('SELECT * FROM categories');
    const categories: Category[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      categories.push(results.rows.item(i));
    }
    return categories;
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    return [];
  }
};

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const db = await getDb();
    const [results] = await db.executeSql('SELECT * FROM products');
    const products: Product[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      products.push(results.rows.item(i));
    }
    return products;
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    return [];
  }
};

export const addProduct = async (product: Omit<Product, 'id'>) => {
  try {
    const db = await getDb();
    await db.executeSql(
      'INSERT INTO products (name, price, img, categoryId) VALUES (?, ?, ?, ?)',
      [product.name, product.price, product.img, product.categoryId]
    );
    console.log('✅ Product added');
  } catch (error) {
    console.error('❌ Error adding product:', error);
  }
};

export const updateProduct = async (product: Product) => {
  try {
    const db = await getDb();
    await db.executeSql(
      'UPDATE products SET name = ?, price = ?, categoryId = ?, img = ? WHERE id = ?',
      [product.name, product.price, product.categoryId, product.img, product.id]
    );
    console.log('✅ Product updated');
  } catch (error) {
    console.error('❌ Error updating product:', error);
  }
};

export const deleteProduct = async (id: number) => {
  try {
    const db = await getDb();
    await db.executeSql('DELETE FROM products WHERE id = ?', [id]);
    console.log('✅ Product deleted');
  } catch (error) {
    console.error('❌ Error deleting product:', error);
  }
};

export const fetchProductsByCategory = async (categoryId: number): Promise<Product[]> => {
  try {
    const db = await getDb();
    const [results] = await db.executeSql('SELECT * FROM products WHERE categoryId = ?', [categoryId]);
    const products: Product[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      products.push(results.rows.item(i));
    }
    return products;
  } catch (error) {
    console.error('❌ Error fetching products by category:', error);
    return [];
  }
};