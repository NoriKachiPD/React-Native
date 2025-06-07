//components/Buoi12/database.ts
import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

let db: SQLiteDatabase | null = null;

const getDb = async (): Promise<SQLiteDatabase> => {
  if (db) return db;
  db = await SQLite.openDatabase({ name: 'myDatabase.db', location: 'default' });
  return db;
};

export type Category = {
  id: number;
  name: string;
};

export type Product = {
  id: number;
  name: string;
  price: number;
  img: string;
  categoryId: number;
};

const initialCategories: Category[] = [
  { id: 1, name: 'Áo' },
  { id: 2, name: 'Giày' },
  { id: 3, name: 'Balo' },
  { id: 4, name: 'Mũ' },
  { id: 5, name: 'Túi' },
];

const initialProducts: Product[] = [
  { id: 1, name: 'Áo sơ mi', price: 250000, img: '1.jpg', categoryId: 1 },
  { id: 2, name: 'Giày sneaker', price: 1100000, img: '2.jpg', categoryId: 2 },
  { id: 3, name: 'Balo thời trang', price: 490000, img: '1.jpg', categoryId: 3 },
  { id: 4, name: 'Mũ lưỡi trai', price: 120000, img: '2.jpg', categoryId: 4 },
  { id: 5, name: 'Túi xách nữ', price: 980000, img: '1.jpg', categoryId: 5 },
];

export const initDatabase = async (onSuccess?: () => void): Promise<void> => {
  try {
    const database = await getDb();

    database.transaction((tx) => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY, name TEXT)');
      initialCategories.forEach((category) => {
        tx.executeSql('INSERT OR IGNORE INTO categories (id, name) VALUES (?, ?)', [category.id, category.name]);
      });

      tx.executeSql(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        price REAL,
        img TEXT,
        categoryId INTEGER,
        FOREIGN KEY (categoryId) REFERENCES categories(id)
      )`);

      initialProducts.forEach((product) => {
        tx.executeSql(
          'INSERT OR IGNORE INTO products (id, name, price, img, categoryId) VALUES (?, ?, ?, ?, ?)',
          [product.id, product.name, product.price, product.img, product.categoryId]
        );
      });
    },
    (error) => console.error('❌ Transaction error:', error),
    () => {
      console.log('✅ Database initialized');
      if (onSuccess) onSuccess();
    });

  } catch (error) {
    console.error('❌ initDatabase outer error:', error);
  }
};

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const db = await getDb();
    const res = await db.executeSql('SELECT * FROM categories');
    const rows = res[0].rows;
    const list: Category[] = [];
    for (let i = 0; i < rows.length; i++) list.push(rows.item(i));
    return list;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const db = await getDb();
    const res = await db.executeSql('SELECT * FROM products');
    const rows = res[0].rows;
    const list: Product[] = [];
    for (let i = 0; i < rows.length; i++) list.push(rows.item(i));
    return list;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const addProduct = async (product: Omit<Product, 'id'>) => {
  const db = await getDb();
  await db.executeSql(
    'INSERT INTO products (name, price, img, categoryId) VALUES (?, ?, ?, ?)',
    [product.name, product.price, product.img, product.categoryId]
  );
};

export const updateProduct = async (product: Product) => {
  const db = await getDb();
  await db.executeSql(
    'UPDATE products SET name = ?, price = ?, img = ?, categoryId = ? WHERE id = ?',
    [product.name, product.price, product.img, product.categoryId, product.id]
  );
};

export const deleteProduct = async (id: number) => {
  const db = await getDb();
  await db.executeSql('DELETE FROM products WHERE id = ?', [id]);
};

export const searchProducts = async (keyword: string): Promise<Product[]> => {
  const db = await getDb();
  const res = await db.executeSql(`
    SELECT p.* FROM products p 
    JOIN categories c ON p.categoryId = c.id
    WHERE p.name LIKE ? OR c.name LIKE ?
  `, [`%${keyword}%`, `%${keyword}%`]);
  const rows = res[0].rows;
  const list: Product[] = [];
  for (let i = 0; i < rows.length; i++) list.push(rows.item(i));
  return list;
};