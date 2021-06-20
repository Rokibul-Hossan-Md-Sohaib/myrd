/*Custom Button*/
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
const Mybutton = (props: any) => {
  return (
    <TouchableOpacity style={{...styles.button, ...props.style}} disabled={props.disabled} onPress={props.customClick}>
      <Text style={styles.text}>{props.title}</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: 'green',
    borderRadius: 7,
    color: '#ffffff',
    padding: 10,
    marginTop: 16,
    marginLeft: 20,
    marginRight: 20,
  },
  text: {
    color: '#ffffff',
    fontWeight: 'bold'
  },
});
export default Mybutton;