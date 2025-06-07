import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const Bai3 = () => {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [operation, setOperation] = useState<'+' | '-' | '*' | '/'>('+');
  const [result, setResult] = useState<string>('');

  const calculate = () => {
    const x = parseFloat(a);
    const y = parseFloat(b);

    if (isNaN(x) || isNaN(y)) {
      setResult('Vui lòng nhập số hợp lệ.');
      return;
    }

    let res: number;
    switch (operation) {
      case '+': res = x + y; break;
      case '-': res = x - y; break;
      case '*': res = x * y; break;
      case '/':
        if (y === 0) {
          setResult('Không thể chia cho 0');
          return;
        }
        res = x / y;
        break;
    }

    setResult(res.toFixed(2));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>3. Máy tính đơn giản</Text>
      <TextInput
        style={styles.input}
        placeholder="Số thứ nhất"
        keyboardType="numeric"
        value={a}
        onChangeText={setA}
      />
      <TextInput
        style={styles.input}
        placeholder="Số thứ hai"
        keyboardType="numeric"
        value={b}
        onChangeText={setB}
      />

      <View style={styles.radioRow}>
        {['+', '-', '*', '/'].map((op) => (
          <TouchableOpacity
            key={op}
            style={[styles.radio, operation === op && styles.radioSelected]}
            onPress={() => setOperation(op as any)}
          >
            <Text style={styles.radioText}>{op}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={calculate}>
        <Text style={styles.buttonText}>Tính</Text>
      </TouchableOpacity>

      {result !== '' && <Text style={styles.result}>Kết quả: {result}</Text>}
    </View>
  );
};

export default Bai3;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#e3f2fd',
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  radioRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  radio: {
    borderWidth: 1,
    borderColor: '#1976d2',
    padding: 10,
    borderRadius: 5,
  },
  radioSelected: {
    backgroundColor: '#1976d2',
  },
  radioText: {
    color: '#000',
  },
  button: {
    backgroundColor: '#1976d2',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  result: {
    marginTop: 10,
    fontSize: 16,
    color: '#0d47a1',
  },
});