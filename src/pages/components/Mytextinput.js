/*Custom TextInput*/
import React from 'react';
import { View, TextInput } from 'react-native';
const Mytextinput = props => {
  return (
    <View
      style={{
        marginLeft: 20,
        marginRight: 20,
        marginTop: 10,
        borderColor: '#000',
        borderRadius: 17,
        borderWidth: 1,
        height: 45
      }}>
      <TextInput
        underlineColorAndroid="transparent"
        secureTextEntry={props.secureTextEntry}
        placeholder={props.placeholder}
        placeholderTextColor="#007FFF"
        keyboardType={props.keyboardType}
        onChangeText={props.onChangeText}
        textAlign="center"
        returnKeyType={props.returnKeyType}
        numberOfLines={props.numberOfLines}
        multiline={props.multiline}
        onSubmitEditing={props.onSubmitEditing}
        style={props.style}
        blurOnSubmit={false}
        editable={props.editable}
        value={props.value}
      />
    </View>
  );
};
export default Mytextinput;