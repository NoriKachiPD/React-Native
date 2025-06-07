import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Bai1 = () => {
  const x = 10;
  const y = 5;
  const sum = x + y;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>1. Phép toán và cú pháp</Text>
      <Text style={styles.text}>Ví dụ: {x} + {y} = {sum}</Text>
    </View>
  );
};

export default Bai1;

const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
    padding: 15,
    backgroundColor: '#f0f8ff',
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
  },
});