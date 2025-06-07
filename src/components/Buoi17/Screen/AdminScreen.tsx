import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList } from '../AppNavigatorProduct';

type AdminScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AdminScreen = () => {
  const navigation = useNavigation<AdminScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>

      <TouchableOpacity
        style={[styles.card, { backgroundColor: '#4DB6AC' }]}
        onPress={() => navigation.navigate('UserManagementScreen')}
        activeOpacity={0.85}
      >
        <MaterialCommunityIcons name="account-group" size={32} color="#fff" style={styles.icon} />
        <Text style={styles.cardText}>Quản Lý Tài khoản</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, { backgroundColor: '#F06292' }]}
        onPress={() => navigation.navigate('CategoryManagementScreen')}
        activeOpacity={0.85}
      >
        <MaterialCommunityIcons name="shape-outline" size={32} color="#fff" style={styles.icon} />
        <Text style={styles.cardText}>Quản Lý Loại sản phẩm</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, { backgroundColor: '#9575CD' }]}
        onPress={() => navigation.navigate('ProductManagementScreen')}
        activeOpacity={0.85}
      >
        <MaterialCommunityIcons name="cube-outline" size={32} color="#fff" style={styles.icon} />
        <Text style={styles.cardText}>Quản Lý Sản phẩm</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingVertical: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#333',
    marginBottom: 40,
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 28,
    borderRadius: 20,
    marginBottom: 20,
    width: '85%',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  cardText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginLeft: 18,
  },
  icon: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 50,
    padding: 8,
  },
});

export default AdminScreen;