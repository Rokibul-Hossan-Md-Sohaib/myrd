/*Custom TextInput*/
import React from 'react';
import { View, TextInput } from 'react-native';
const Mytextinput = (props: any) => {
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
        placeholderTextColor="#fff"
        keyboardType={props.keyboardType}
        onChangeText={props.onChangeText}
        textAlign="center"
        ref={props.refInner}
        blurOnSubmit={false}
        onFocus={props.onFocus}
        showSoftInputOnFocus={props.showSoftInputOnFocus}
        returnKeyType={props.returnKeyType}
        numberOfLines={props.numberOfLines}
        multiline={props.multiline}
        onSubmitEditing={props.onSubmitEditing}
        style={props.style}
        editable={props.editable}
        value={props.value}
      />
    </View>
  );
};
export default Mytextinput;