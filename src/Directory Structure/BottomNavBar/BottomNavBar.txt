import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from './AppNavigatorProduct';
import { User } from './UserDatabase';

type NavigationPropType = NativeStackNavigationProp<RootStackParamList>;
type RoutePropType = NativeStackScreenProps<RootStackParamList>['route'];

const BottomNavBar = () => {
  const navigation = useNavigation<NavigationPropType>();
  const route = useRoute<RoutePropType>();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error loading user from AsyncStorage:', error);
      }
    };
    loadUser();
  }, []);

  const isActive = (screen: keyof RootStackParamList) => route.name === screen;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.tab, isActive('HomeScreen') && styles.activeTab]}
        onPress={() => navigation.navigate({ name: 'HomeScreen', params: undefined })}
      >
        <MaterialCommunityIcons
          name="home"
          size={30}
          color={isActive('HomeScreen') ? '#4DB6AC' : '#888'}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, isActive('CategoryScreen') && styles.activeTab]}
        onPress={() => navigation.navigate({ name: 'CategoryScreen', params: undefined })}
      >
        <MaterialCommunityIcons
          name="shopping"
          size={30}
          color={isActive('CategoryScreen') ? '#4DB6AC' : '#888'}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, isActive('ProfileScreen') && styles.activeTab]}
        onPress={() => navigation.navigate({ name: 'ProfileScreen', params: {} })}
      >
        <MaterialCommunityIcons
          name="account"
          size={30}
          color={isActive('ProfileScreen') ? '#4DB6AC' : '#888'}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 4,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#e0f7f5',
  },
});

export default BottomNavBar;