// src/components/Props_or_StateBuoi3/HelloProps.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type HelloProps = {
  name: string;
  age: number;
};

const HelloProps: React.FC<HelloProps> = ({ name, age }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello {name}, you are {age} years old.</Text>
    </View>
  );
};

export default HelloProps;

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center'
  },
  text: {
    fontSize: 20
  }
});

// // App.tsx
// import React from 'react';
// import HelloProps from './components/Props_or_StateBuoi3/HelloProps';

// const App = () => {
//   return <HelloProps name="Phát" age={22} />;
// };

// export default App;