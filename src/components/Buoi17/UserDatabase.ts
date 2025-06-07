import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: number; // Thêm id
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
      // Tìm max id hiện có
      let maxId = users.reduce((max, u) => (u.id && u.id > max ? u.id : max), 0);
      let updated = false;

      const newUsers = users.map(u => {
        if (typeof u.id !== 'number' || u.id === null || u.id === undefined) {
          maxId++;
          updated = true;
          return { ...u, id: maxId };
        }
        return u;
      });

      if (updated) {
        await UserDatabase.saveUsers(newUsers);
        console.log(`Đã cập nhật id cho các user thiếu id, tổng cộng: ${maxId}`);
      } else {
        console.log('Không có user nào cần thêm id.');
      }
    } catch (e) {
      console.error('Lỗi khi cập nhật id cho user:', e);
    }
  },

  init: async (): Promise<void> => {
    try {
      await UserDatabase.migrateAddIdToUsers(); // Cập nhật id cho user thiếu id
      const users = await UserDatabase.getUsers();
      const adminExists = users.some(
        (u) => u.username === 'admin' && u.password === 'admin'
      );
      // Nếu bạn muốn tạo admin mặc định khi chưa có thì mở phần này ra
      // if (!adminExists) {
      //   users.push({
      //     id: users.length + 1, // Gán id cho admin
      //     username: 'admin',
      //     password: 'admin',
      //     level: 1,
      //     email: 'phatchau16520@gmail.com',
      //     phone: '0935370171',
      //     image: 'src/Img/1.jpg',
      //   });
      //   await UserDatabase.saveUsers(users);
      //   console.log('Tài khoản admin mặc định đã được tạo.');
      // }
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
      const newUser: User = { ...user, id: users.length + 1 }; // Gán id
      users.push(newUser);
      await UserDatabase.saveUsers(users);
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
      if (index === -1) return false;
      users[index] = updatedUser;
      await UserDatabase.saveUsers(users);
      return true;
    } catch (e) {
      console.error('Error updating user:', e);
      return false;
    }
  },

  deleteUser: async (id: number): Promise<boolean> => {
    try {
      const users = await UserDatabase.getUsers();
      const filteredUsers = users.filter((u) => u.id !== id);
      if (filteredUsers.length === users.length) return false;
      await UserDatabase.saveUsers(filteredUsers);
      return true;
    } catch (e) {
      console.error('Error deleting user:', e);
      return false;
    }
  },
};

export default UserDatabase;