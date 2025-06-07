import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Dimensions, } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList } from '../AppNavigatorProduct';
import BottomNavBar from '../BottomNavBar';

type NavigationPropType = NativeStackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');
const BANNER_ASPECT_RATIO = 1536 / 1024; // Tỷ lệ 3:2

const HomeScreen = () => {
  const navigation = useNavigation<NavigationPropType>();
  const [buttonPressed, setButtonPressed] = useState(false);

  const goToCategories = () => {
    navigation.navigate('CategoryScreen');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerGradient1} />
          <View style={styles.headerGradient2} />
          <Text style={styles.title}>NoriKachi Modern Izakaya</Text>
          <Text style={styles.subtitle}>Khám phá món ăn tuyệt vời ngay hôm nay!</Text>
        </View>

        {/* Banner */}
        <Image
          source={require('../../../Img/2.png')}
          style={[styles.banner, { height: (width - 32) / BANNER_ASPECT_RATIO }]}
        />

        {/* Ưu đãi nổi bật */}
        <View style={styles.dealsContainer}>
          <Text style={styles.dealsTitle}>Ưu Đãi Nổi Bật</Text>
          <View style={styles.dealCard}>
            <View style={styles.dealGradient} />
            <Text style={styles.dealText}>Combo Izakaya - Giảm 20%</Text>
            <Text style={styles.dealSubText}>Chương trình chỉ kéo dài đến 23h59 ngày 16/06/2025 – Đừng bỏ lỡ!</Text>
          </View>
          <View style={styles.dealCard}>
            <View style={styles.dealGradient} />
            <Text style={styles.dealText}>Miễn phí vận chuyển</Text>
            <Text style={styles.dealSubText}>Đơn hàng từ 500.000 VNĐ</Text>
          </View>
        </View>

        {/* Nút khám phá */}
        <TouchableOpacity
          style={[styles.shopButton, { opacity: buttonPressed ? 0.7 : 1 }]}
          onPress={goToCategories}
          onPressIn={() => setButtonPressed(true)}
          onPressOut={() => setButtonPressed(false)}
          activeOpacity={0.7}>
          <View style={styles.buttonGradient} />
          <Text style={styles.shopButtonText}>Khám Phá Sản Phẩm</Text>
        </TouchableOpacity>

        {/* Thông tin cửa hàng */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Thông Tin Cửa Hàng</Text>
          <Text style={styles.infoText}>Tên: NoriKachi Modern Izakaya</Text>
          <Text style={styles.infoText}>Email: Norikachi5002@gmail.com</Text>
          <Text style={styles.infoText}>Hotline: 0935 370 171</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerGradient} />
          <Text style={styles.footerTitle}>NoriKachi Modern Izakaya</Text>
          <Text style={styles.footerText}>Địa chỉ: 99 Tô Hiến Thành, Phước Mỹ, Sơn Trà, Đà Nẵng 550000</Text>
          <Text style={styles.footerText}>Email: Norikachi5002@gmail.com</Text>
          <Text style={styles.footerText}>Hotline: 0935 370 171</Text>
          <View style={styles.socialContainer}>
            <MaterialCommunityIcons
              name="facebook"
              size={18}
              color="#fff"
              style={{ marginHorizontal: 12 }}
            />
            <MaterialCommunityIcons
              name="instagram"
              size={18}
              color="#fff"
              style={{ marginHorizontal: 12 }}
            />
            <MaterialCommunityIcons
              name="twitter"
              size={18}
              color="#fff"
              style={{ marginHorizontal: 12 }}
            />
          </View>
          <Text style={styles.footerCopyright}>© 2025 NoriKachi Tedomi MiriKado. All rights reserved.</Text>
        </View>
      </ScrollView>
      <BottomNavBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    paddingBottom: 10, // Giảm để loại bỏ khoảng trống
  },
  // Header
  header: {
    paddingVertical: 48,
    paddingHorizontal: 24,
    alignItems: 'center',
    backgroundColor: '#4DB6AC',
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
    marginBottom: 24,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
  },
  headerGradient1: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#26A69A',
    opacity: 0.3,
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
  },
  headerGradient2: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#E0F7FA',
    opacity: 0.1,
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 1,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 16,
    color: '#E0F7FA',
    marginTop: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  // Banner
  banner: {
    width: width - 32,
    resizeMode: 'contain',
    borderRadius: 24,
    marginHorizontal: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  // Ưu đãi
  dealsContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  dealsTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#333',
    marginBottom: 16,
  },
  dealCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  dealGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FF7043',
    opacity: 0.1,
    borderRadius: 16,
  },
  dealText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  dealSubText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  // Thông tin
  infoContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    padding: 24,
    borderRadius: 24,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#333',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 12,
    lineHeight: 24,
  },
  // Nút
  shopButton: {
    backgroundColor: '#4DB6AC',
    paddingVertical: 16,
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#4DB6AC',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  buttonGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#26A69A',
    opacity: 0.2,
    borderRadius: 16,
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  // Footer
  footer: {
    backgroundColor: '#4DB6AC',
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderTopLeftRadius: 48,
    borderTopRightRadius: 48,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: -4 },
    shadowRadius: 12,
    marginBottom: -10,
  },
  footerGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#26A69A',
    opacity: 0.3,
    borderTopLeftRadius: 48,
    borderTopRightRadius: 48,
  },
  footerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#E0F7FA',
    marginBottom: 8,
    textAlign: 'center',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16,
  },
  footerCopyright: {
    fontSize: 12,
    color: '#E0F7FA',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default HomeScreen;