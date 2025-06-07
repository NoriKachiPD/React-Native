import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Child from './Child';

const Parent = () => {
  const [name, setName] = useState('Phát');
  const [age, setAge] = useState(20);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Component Cha (Parent)</Text>
      <Text style={styles.info}>Tên: {name}</Text>
      <Text style={styles.info}>Tuổi: {age}</Text>

      <Child
        name={name}
        age={age}
        onNameChange={setName}
        onAgeChange={(newAge) => setAge(Number(newAge))}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  info: {
    fontSize: 18,
    marginBottom: 5,
  },
});

export default Parent;