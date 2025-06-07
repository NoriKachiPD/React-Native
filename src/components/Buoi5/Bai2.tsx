import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const Bai2 = () => {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const solve = () => {
    const aNum = parseFloat(a);
    const bNum = parseFloat(b);

    if (isNaN(aNum) || isNaN(bNum)) {
      setResult('Vui lòng nhập số hợp lệ.');
    } else if (aNum === 0) {
      setResult(bNum === 0 ? 'Vô số nghiệm' : 'Vô nghiệm');
    } else {
      const x = -bNum / aNum;
      setResult(`x = ${x.toFixed(2)}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>2. Giải phương trình ax + b = 0</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập a"
        keyboardType="numeric"
        value={a}
        onChangeText={setA}
      />
      <TextInput
        style={styles.input}
        placeholder="Nhập b"
        keyboardType="numeric"
        value={b}
        onChangeText={setB}
      />
      <TouchableOpacity style={styles.button} onPress={solve}>
        <Text style={styles.buttonText}>Giải</Text>
      </TouchableOpacity>
      {result && <Text style={styles.result}>{result}</Text>}
    </View>
  );
};

export default Bai2;

const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
    padding: 15,
    backgroundColor: '#e8f5e9',
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#388e3c',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  result: {
    marginTop: 10,
    fontSize: 16,
    color: '#1b5e20',
  },
});