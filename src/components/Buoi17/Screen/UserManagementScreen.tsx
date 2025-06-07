import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Image, ScrollView, } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import UserDatabase, { User } from '../UserDatabase';
import { RootStackParamList } from '../AppNavigatorProduct';

type UserManagementScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'UserManagementScreen'>;

const UserManagementScreen = () => {
  const navigation = useNavigation<UserManagementScreenNavigationProp>();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'user'>('all');

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, filterRole]);

  const loadUsers = async () => {
    const userList = await UserDatabase.getUsers();
    const validUsers = userList.filter(user => user.id && typeof user.id === 'number');
    setUsers(validUsers);
  };

  const filterUsers = () => {
    if (filterRole === 'admin') {
      setFilteredUsers(users.filter(u => u.level === 1));
    } else if (filterRole === 'user') {
      setFilteredUsers(users.filter(u => u.level === 3));
    } else {
      setFilteredUsers(users.filter(u => u.level === 1 || u.level === 3));
    }
  };

  const onDeleteUser = async (id: number) => {
    Alert.alert('Xác nhận', 'Bạn có chắc muốn xóa user này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          const success = await UserDatabase.deleteUser(id);
          Alert.alert('Thông báo', success ? 'Xóa user thành công' : 'Xóa user thất bại');
          if (success) loadUsers();
        },
      },
    ]);
  };

  const renderHeader = () => (
    <View style={styles.headerRow}>
      <Text style={[styles.headerText, styles.avatarColumn]}>Avatar</Text>
      <Text style={[styles.headerText, styles.usernameColumn]}>Username</Text>
      <Text style={[styles.headerText, styles.emailColumn]}>Email</Text>
      <Text style={[styles.headerText, styles.phoneColumn]}>Phone</Text>
      <Text style={[styles.headerText, styles.roleColumn]}>Role</Text>
      <Text style={[styles.headerText, styles.actionsColumn]}>Actions</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quản Lý User</Text>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filterRole === 'all' && styles.activeFilter]}
          onPress={() => setFilterRole('all')}
        >
          <Text style={styles.buttonText}>Tất cả</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filterRole === 'admin' && styles.activeFilter]}
          onPress={() => setFilterRole('admin')}
        >
          <Text style={styles.buttonText}>Admin</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filterRole === 'user' && styles.activeFilter]}
          onPress={() => setFilterRole('user')}
        >
          <Text style={styles.buttonText}>User</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal>
        <View style={{ minWidth: 700 }}>
          {renderHeader()}
          <FlatList
            data={filteredUsers}
            keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
            renderItem={({ item }) => (
              <View style={styles.itemRow}>
                <View style={[styles.cell, styles.avatarColumn]}>
                  <Image
                    source={
                      item.image && item.image.startsWith('file://')
                        ? { uri: item.image }
                        : { uri: 'https://via.placeholder.com/50' }
                    }
                    style={styles.avatar}
                    onError={(e) =>
                      console.log(`Failed to load avatar for user ${item.username}`)
                    }
                  />
                </View>
                <Text style={[styles.cell, styles.usernameColumn, styles.cellText]}>
                  {item.username}
                </Text>
                <Text style={[styles.cell, styles.emailColumn, styles.cellText]}>
                  {item.email}
                </Text>
                <Text style={[styles.cell, styles.phoneColumn, styles.cellText]}>
                  {item.phone}
                </Text>
                <Text style={[styles.cell, styles.roleColumn, styles.cellText]}>
                  {item.level === 1 ? 'Admin' : item.level === 3 ? 'User' : `Level ${item.level}`}
                </Text>
                <View style={[styles.cell, styles.actionsColumn, styles.actionsCell]}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => navigation.navigate('EditUserScreen', { user: item })}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.buttonText}>Sửa</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => onDeleteUser(item.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.buttonText}>Xóa</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddUserScreen')}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Thêm User</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
    gap: 10,
  },
  filterButton: {
    backgroundColor: '#4DB6AC',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  activeFilter: {
    backgroundColor: '#00796B',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#e0e0e0',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#fff',
  },
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  avatarColumn: {
    width: 60,
  },
  usernameColumn: {
    width: 120,
  },
  emailColumn: {
    width: 180,
  },
  phoneColumn: {
    width: 120,
  },
  roleColumn: {
    width: 80,
  },
  actionsColumn: {
    width: 140,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  cellText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  actionsCell: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  editButton: {
    backgroundColor: '#4DB6AC',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  deleteButton: {
    backgroundColor: '#FF5722',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  addButton: {
    backgroundColor: '#4DB6AC',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    elevation: 5,
    shadowColor: '#4DB6AC',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default UserManagementScreen;