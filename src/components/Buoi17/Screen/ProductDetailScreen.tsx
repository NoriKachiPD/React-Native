import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, Modal, ScrollView, Animated } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../AppNavigatorProduct';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ProductDatabase, { Product } from '../ProductDatabase';
import Ionicons from 'react-native-vector-icons/Ionicons';

type ProductDetailScreenRouteProp = RouteProp<RootStackParamList, 'ProductDetailScreen'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProductDetailScreen'>;

const formatPrice = (price: string | number): string => {
  const numPrice = Number(price);
  if (isNaN(numPrice)) return '0 ₫';
  return numPrice.toLocaleString('vi-VN') + ' ₫';
};

const ProductDetailScreen = () => {
  const route = useRoute<ProductDetailScreenRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { productId } = route.params;

  const [product, setProduct] = useState<Product | null>(null);
  const [countdown, setCountdown] = useState<number>(0);
  const [showOrderModal, setShowOrderModal] = useState<boolean>(false);
  const [modalScale] = useState(new Animated.Value(0)); // Animation cho Modal

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log('Fetching product with ID:', productId);
        const allProducts = await ProductDatabase.getProducts();
        console.log('All products:', allProducts);
        const foundProduct = allProducts.find(p => p.id === productId);
        console.log('Found product:', foundProduct);
        setProduct(foundProduct || null);
        if (!foundProduct) {
          Alert.alert('Lỗi', 'Sản phẩm không tồn tại trong cơ sở dữ liệu');
        }
      } catch (e) {
        console.error('Error fetching product:', e);
        Alert.alert('Lỗi', 'Không thể tải chi tiết sản phẩm');
      }
    };
    fetchProduct();
  }, [productId]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showOrderModal && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => {
          const next = prev - 1;
          if (next <= 0) {
            setShowOrderModal(false);
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showOrderModal, countdown]);

  useEffect(() => {
    if (showOrderModal) {
      Animated.spring(modalScale, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();
    } else {
      modalScale.setValue(0);
    }
  }, [showOrderModal, modalScale]);

  const handleOrder = () => {
    if (!product) return;

    Alert.alert(
      'Xác nhận đặt món',
      `Bạn có muốn đặt món "${product.name}" với giá ${formatPrice(product.price)}?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xác nhận',
          onPress: () => {
            setCountdown(10);
            setShowOrderModal(true);
          },
        },
      ]
    );
  };

  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Sản phẩm không tồn tại</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.image }}
            style={styles.image}
            onError={() => console.log(`Failed to load image for ${product.name}`)}
          />
        </View>
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.price}>{formatPrice(product.price)}</Text>
        <Text style={styles.description}>{product.description || 'Không có mô tả'}</Text>
        <TouchableOpacity style={styles.orderButton} onPress={handleOrder}>
          <Text style={styles.buttonText}>Đặt món</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Quay lại</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={showOrderModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowOrderModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalContent, { transform: [{ scale: modalScale }] }]}>
            <Ionicons name="checkmark-circle" size={60} color="#26A69A" style={styles.modalIcon} />
            <Text style={styles.modalTitle}>Đặt món thành công</Text>
            <Text style={styles.modalMessage}>
              Món "{product.name}" đã được đặt thành công, bếp đang làm món cho quý khách và sẽ đem ra trong thời gian tới. Thông báo này sẽ đóng sau {countdown}s.
            </Text>
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowOrderModal(false)}>
              <Text style={styles.modalCloseText}>Đóng</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9', // Xanh nhạt tươi sáng
  },
  scrollContent: {
    padding: 15,
    alignItems: 'center',
    paddingBottom: 30,
  },
  imageContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 8,
    marginBottom: 15,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 8,
    borderWidth: 2,
    borderColor: '#FFCA28', // Viền vàng
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    transform: [{ scale: 1.03 }],
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: '#E91E63', // Hồng phấn nổi bật
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF5722', // Cam
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    fontWeight: '500',
    color: '#424242',
    textAlign: 'center',
    marginBottom: 25,
    paddingHorizontal: 10,
    lineHeight: 22,
  },
  orderButton: {
    backgroundColor: '#26A69A', // Xanh ngọc
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 25,
    marginBottom: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#FFCA28', // Viền vàng
  },
  backButton: {
    backgroundColor: '#0288D1', // Xanh dương
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 25,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#FFCA28', // Viền vàng
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#F1F8E9', // Xanh nhạt pastel
    padding: 20,
    borderRadius: 20,
    width: '90%',
    alignItems: 'center',
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    borderWidth: 2,
    borderColor: '#E91E63', // Viền hồng
  },
  modalIcon: {
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#26A69A', // Xanh ngọc
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  modalCloseButton: {
    backgroundColor: '#FF5722', // Cam
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: '#FFCA28', // Viền vàng
  },
  modalCloseText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default ProductDetailScreen;