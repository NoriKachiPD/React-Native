// src/components/Props_or_StateBuoi3/HelloState.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const HelloState: React.FC = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Enter your age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        style={styles.input}
      />
      <Text style={styles.text}>Hello {name}, you are {age} years old.</Text>
    </View>
  );
};

export default HelloState;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10 },
  text: { fontSize: 20 }
});

// // App.tsx
// import React from 'react';
// import HelloState from './components/Props_or_StateBuoi3/HelloState';

// const App = () => {
//   return <HelloState />;
// };

// export default App;