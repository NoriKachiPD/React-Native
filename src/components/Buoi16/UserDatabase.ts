// src/database/UserDatabase.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export type User = {
  username: string;
  password: string;
};

const USERS_KEY = 'USERS_KEY';

const UserDatabase = {
  // Lấy danh sách users từ AsyncStorage, trả về mảng User hoặc rỗng nếu chưa có
  getUsers: async (): Promise<User[]> => {
    try {
      const jsonValue = await AsyncStorage.getItem(USERS_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error('Failed to load users from storage', e);
      return [];
    }
  },

  // Lưu danh sách users vào AsyncStorage
  saveUsers: async (users: User[]): Promise<void> => {
    try {
      const jsonValue = JSON.stringify(users);
      await AsyncStorage.setItem(USERS_KEY, jsonValue);
    } catch (e) {
      console.error('Failed to save users to storage', e);
    }
  },

  // Thêm user mới, trả về true nếu thành công, false nếu user đã tồn tại
  addUser: async (user: User): Promise<boolean> => {
    const users = await UserDatabase.getUsers();
    const exists = users.some((u) => u.username === user.username);
    if (exists) return false;
    users.push(user);
    await UserDatabase.saveUsers(users);
    return true;
  },

  // Xác thực user, trả về true nếu username và password đúng
  authenticate: async (username: string, password: string): Promise<boolean> => {
    const users = await UserDatabase.getUsers();
    return users.some((u) => u.username === username && u.password === password);
  },
};

export default UserDatabase;