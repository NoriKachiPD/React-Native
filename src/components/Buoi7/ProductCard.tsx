import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

interface ProductCardProps {
  image: any;
  name: string;
  price: string;
  onBuy: () => void;
}

const ProductCard = ({ image, name, price, onBuy }: ProductCardProps) => {
  return (
    <View style={styles.card}>
        <Image
            source={typeof image === 'string' ? { uri: image } : image}
            style={styles.image}
        />
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.price}>{price}</Text>
        <TouchableOpacity style={styles.button} onPress={onBuy}>
        <Text style={styles.buttonText}>Mua ngay</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 11,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 11,
    marginBottom: 5,
  },
  name: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 3,
  },
  price: {
    fontSize: 13,
    color: '#e53935',
    fontWeight: 'bold',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#4caf50',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});