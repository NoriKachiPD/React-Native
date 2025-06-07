//components/Buoi7/Layout2.tsx
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  Linking,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import ProductCard from './ProductCard';

const Layout = () => {
  const products = [
    { id: '1', name: 'Bánh Tráng Trộn', price: '25.000đ', image: require('../../Img/1.jpg') },
    { id: '2', name: 'Khô Gà Lá Chanh', price: '55.000đ', image: require('../../Img/2.jpg') },
    { id: '3', name: 'Cơm Cháy Chà Bông', price: '30.000đ', image: require('../../Img/2.jpg') },
    { id: '4', name: 'Chân Gà Sả Tắc', price: '40.000đ', image: require('../../Img/1.jpg') },
    { id: '5', name: 'Snack Rong Biển', price: '22.000đ', image: require('../../Img/1.jpg') },
    { id: '6', name: 'Bánh Snack Tôm', price: '18.000đ', image: require('../../Img/2.jpg') },
    { id: '7', name: 'Trà Sữa Đóng Chai', price: '28.000đ', image: require('../../Img/2.jpg') },
    { id: '8', name: 'Mực Rim Me', price: '65.000đ', image: require('../../Img/1.jpg') },
    { id: '9', name: 'Chả Cá Lã Vọng', price: '45.000đ', image: require('../../Img/1.jpg') },
    { id: '10', name: 'Gà Rán Giòn', price: '55.000đ', image: require('../../Img/2.jpg') },
    { id: '11', name: 'Bánh Xèo', price: '35.000đ', image: require('../../Img/2.jpg') },
    { id: '12', name: 'Nước Mía', price: '15.000đ', image: require('../../Img/1.jpg') },
    { id: '13', name: 'Bánh Bao Chay', price: '20.000đ', image: require('../../Img/1.jpg') },
    { id: '14', name: 'Hạt Dưa Lê', price: '25.000đ', image: require('../../Img/2.jpg') },
    { id: '15', name: 'Khoai Tây Lắc', price: '18.000đ', image: require('../../Img/2.jpg') },
    { id: '16', name: 'Bánh Chuối Nướng', price: '30.000đ', image: require('../../Img/1.jpg') }
  ];

  const openLink = (url: string) => {
    Linking.openURL(url).catch((err) => console.error('Failed to open URL:', err));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require('../../Img/1.jpg')} style={styles.logo} />
        <Image source={require('../../Img/Banner.png')} style={styles.banner} />
      </View>

      {/* Body */}
      <View style={styles.body}>
        <View style={styles.sidebar}>
          <Text style={styles.text}>Menu</Text>

          <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('Đang đi đến Trang chủ')}>
            <Icon name="home" size={20} color="#000" style={styles.menuIcon} />
            <Text style={styles.menuText}>Trang Chủ</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('Đang đi đến Trang sản phẩm')}>
            <Icon name="shopping-basket" size={20} color="#000" style={styles.menuIcon} />
            <Text style={styles.menuText}>Sản phẩm</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('Đang đi đến Trang liên hệ')}>
            <Icon name="phone" size={20} color="#000" style={styles.menuIcon} />
            <Text style={styles.menuText}>Liên Hệ</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('Đang đi đến Trang giới thiệu')}>
            <Icon name="info-circle" size={20} color="#000" style={styles.menuIcon} />
            <Text style={styles.menuText}>Giới thiệu</Text>
          </TouchableOpacity>

          <Text style={styles.footerText}>
            Địa chỉ: 99 Tô Hiến Thành, Phước Mỹ, Sơn Trà, Đà Nẵng 550000
          </Text>
        </View>

        <View style={styles.content}>
          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            renderItem={({ item }) => (
              <ProductCard
                image={item.image}
                name={item.name}
                price={item.price}
                onBuy={() => Alert.alert('Thông báo', `Bạn đã chọn mua: ${item.name}`)}
              />
            )}
          />
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerBox}>
          <View style={styles.footerInfoContainer}>
            <Image source={require('../../Img/2.jpg')} style={styles.footerLogo} />
            <View style={styles.footerDetails}>
              <Text style={styles.footerInfo}>Norikachi - Thế giới đồ ăn vặt</Text>
              <Text style={styles.footerInfo}>Email: phatchau16520@gmail.com</Text>
              <Text style={styles.footerInfo}>
                Địa chỉ: 99 Tô Hiến Thành, Phước Mỹ, Sơn Trà, Đà Nẵng 550000
              </Text>
              <Text style={styles.footerInfo}>SĐT: 0935.370.171</Text>
            </View>
          </View>

          <View style={styles.socialIcons}>
            <TouchableOpacity onPress={() => openLink('https://www.facebook.com')}>
              <Icon name="facebook" size={26} color="#3b5998" style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openLink('https://www.twitter.com')}>
              <Feather name="x" size={26} color="#000000" style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openLink('https://www.instagram.com')}>
              <Icon name="instagram" size={26} color="#e1306c" style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openLink('https://www.linkedin.com')}>
              <Icon name="linkedin" size={26} color="#0077b5" style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openLink('https://www.youtube.com')}>
              <Icon5 name="youtube" size={26} color="#ff0000" style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Layout;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginRight: 10,
    borderRadius: 11,
  },
  banner: {
    flex: 1,
    height: 80,
    resizeMode: 'cover',
    borderRadius: 11,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
  },
//   sidebar: {
//     flex: 1,
//     backgroundColor: '#d3f8e2',
//     marginRight: 10,
//     padding: 10,
//     borderRadius: 11,
//   },
    sidebar: {
    width: 110, // hoặc 250
    backgroundColor: '#d3f8e2',
    marginRight: 10,
    padding: 10,
    borderRadius: 11,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    marginLeft: -5,
  },
  menuIcon: {
    width: 24, // Đảm bảo icon có cùng chiều ngang cố định
    textAlign: 'center',
  },
  menuText: {
    marginLeft: 10,
    fontSize: 13,
    color: '#000',
    fontWeight: 'bold',
  },
  footerText: {
    marginTop: 20,
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
  },
  content: {
    flex: 3,
    backgroundColor: '#fceabb',
    padding: 10,
    borderRadius: 11,
  },
  footer: {
    padding: 0.1,
    backgroundColor: '#f8f8f8',
  },
  footerBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 11,
    padding: 16,
    backgroundColor: '#333',
    margin: 9,
    marginTop: -1,
  },
  footerInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  footerLogo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    borderRadius: 11,
    marginRight: 10,
  },
  footerDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  footerInfo: {
    color: '#fff',
    marginBottom: 3,
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  icon: {
    marginHorizontal: 10,
  },
});