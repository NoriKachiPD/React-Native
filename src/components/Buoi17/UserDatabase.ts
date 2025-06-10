import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: number;
  username: string;
  password: string;
  level: number; // 1 = admin, 3 = user
  email: string;
  phone: string;
  image: string;
}

const USERS_KEY = 'USERS_KEY';

const UserDatabase = {
  migrateAddIdToUsers: async (): Promise<void> => {
    try {
      const users = await UserDatabase.getUsers();
      let maxId = 0;
      const idSet = new Set<number>();
      let updated = false;

      // Kiểm tra và sửa trùng id
      const newUsers = users.map((u, index) => {
        if (typeof u.id !== 'number' || u.id === null || u.id === undefined || idSet.has(u.id)) {
          // Nếu id không hợp lệ hoặc đã tồn tại, gán id mới
          maxId = Math.max(maxId, users.reduce((max, user) => (user.id && user.id > max ? user.id : max), 0));
          maxId++;
          idSet.add(maxId);
          updated = true;
          console.log(`Gán lại id=${maxId} cho user ${u.username} (trước đó id=${u.id})`);
          return { ...u, id: maxId };
        }
        idSet.add(u.id);
        maxId = Math.max(maxId, u.id);
        return u;
      });

      if (updated) {
        await UserDatabase.saveUsers(newUsers);
        console.log(`Đã sửa ${newUsers.length} user, maxId=${maxId}`);
      } else {
        console.log('Không có user nào cần sửa id.');
      }
    } catch (e) {
      console.error('Lỗi khi cập nhật id cho user:', e);
    }
  },

  init: async (): Promise<void> => {
    try {
      await UserDatabase.migrateAddIdToUsers();
      const users = await UserDatabase.getUsers();
      const adminExists = users.some(
        (u) => u.username === 'admin' && u.password === 'admin'
      );
      if (!adminExists) {
        const maxId = users.reduce((max, u) => (u.id && u.id > max ? u.id : max), 0);
        users.push({
          id: maxId + 1,
          username: 'admin',
          password: 'admin',
          level: 1,
          email: 'phatchau16520@gmail.com',
          phone: '0935370171',
          image: '1.jpg',
        });
        await UserDatabase.saveUsers(users);
        console.log('UserDatabase initialized with default admin.');
      }
    } catch (e) {
      console.error('Lỗi khi khởi tạo tài khoản admin:', e);
    }
  },

  getUsers: async (): Promise<User[]> => {
    try {
      const jsonValue = await AsyncStorage.getItem(USERS_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error('Failed to load users from storage', e);
      return [];
    }
  },

  saveUsers: async (users: User[]): Promise<void> => {
    try {
      const jsonValue = JSON.stringify(users);
      await AsyncStorage.setItem(USERS_KEY, jsonValue);
    } catch (e) {
      console.error('Failed to save users to storage', e);
    }
  },

  addUser: async (user: Omit<User, 'id'>): Promise<boolean> => {
    try {
      const users = await UserDatabase.getUsers();
      const exists = users.some(
        (u) => u.username === user.username || u.email === user.email || u.phone === user.phone
      );
      if (exists) return false;
      const maxId = users.reduce((max, u) => (u.id && u.id > max ? u.id : max), 0);
      const newUser: User = { ...user, id: maxId + 1 };
      users.push(newUser);
      await UserDatabase.saveUsers(users);
      console.log(`Thêm user ${newUser.username} với id=${newUser.id}`);
      return true;
    } catch (e) {
      console.error('Error adding user:', e);
      return false;
    }
  },

  authenticate: async (
    identifier: string,
    password: string
  ): Promise<{ success: boolean; level?: number; user?: User }> => {
    try {
      const users = await UserDatabase.getUsers();
      const foundUser = users.find(
        (u) =>
          (u.username === identifier || u.email === identifier || u.phone === identifier) &&
          u.password === password
      );
      if (foundUser) {
        return { success: true, level: foundUser.level, user: foundUser };
      }
      return { success: false };
    } catch (e) {
      console.error('Error authenticating user:', e);
      return { success: false };
    }
  },

  updateUser: async (updatedUser: User): Promise<boolean> => {
    try {
      const users = await UserDatabase.getUsers();
      const index = users.findIndex((u) => u.id === updatedUser.id);
      if (index === -1) {
        console.error(`User với id ${updatedUser.id} không tồn tại`);
        return false;
      }
      users[index] = updatedUser;
      await UserDatabase.saveUsers(users);
      console.log(`Cập nhật user ${updatedUser.username} với id=${updatedUser.id}`);
      return true;
    } catch (e) {
      console.error('Error updating user:', e);
      return false;
    }
  },

  deleteUser: async (id: number): Promise<boolean> => {
    try {
      const users = await UserDatabase.getUsers();
      const initialLength = users.length;
      // Xóa tất cả user có id khớp
      const filteredUsers = users.filter((u) => u.id !== id);
      if (filteredUsers.length === initialLength) {
        console.log(`Không tìm thấy user với id=${id}`);
        return false;
      }
      await UserDatabase.saveUsers(filteredUsers);
      console.log(`Đã xóa ${initialLength - filteredUsers.length} user(s) với id=${id}`);
      return true;
    } catch (e) {
      console.error('Error deleting user:', e);
      return false;
    }
  },
};

export default UserDatabase;