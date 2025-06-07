// src/components/HelloButton.tsx
import React from 'react';
import { View, Text, Button, Alert } from 'react-native';

interface HelloButtonProps {
  name: string;
}

const HelloButton: React.FC<HelloButtonProps> = ({ name }) => {
  const handleClick = () => {
    Alert.alert('', name);
  };

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Hello {name}</Text>

      <Button title="Click Here To Earn Money!" onPress={handleClick} />
    </View>
  );
};

export default HelloButton;