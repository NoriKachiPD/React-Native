import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

type Props = {
  name: string;
  age: number;
  onNameChange: (newName: string) => void;
  onAgeChange: (newAge: number) => void;
};

const Child = ({ name, age, onNameChange, onAgeChange }: Props) => {
  return (
    <View style={styles.childContainer}>
      <Text style={styles.title}>Component Con</Text>

      <TextInput
        placeholder="Nhập tên mới"
        style={styles.input}
        value={name}
        onChangeText={onNameChange}
      />

      <TextInput
        placeholder="Nhập tuổi mới"
        style={styles.input}
        keyboardType="numeric"
        value={age.toString()}
        onChangeText={(text) => {
          const num = parseInt(text, 10);
          if (!isNaN(num)) {
            onAgeChange(num);
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  childContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#e0f7fa',
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    padding: 8,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default Child;