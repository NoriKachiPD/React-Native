// src/components/HelloScreen.tsx
import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import HelloButton from '../Buoi2/HelloButton';

const HelloScreen = () => {
  const [name, setName] = useState('');

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        placeholder="Enter your name"
        value={name}
        onChangeText={text => setName(text)}
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          margin: 20,
          paddingHorizontal: 10,
        }}
      />

      <HelloButton name={name} />
    </View>
  );
};

export default HelloScreen;