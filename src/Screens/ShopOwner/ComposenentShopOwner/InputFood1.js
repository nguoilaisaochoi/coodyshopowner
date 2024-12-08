import {View, TextInput, StyleSheet} from 'react-native';
import React from 'react';
import TextComponent from '../../../components/TextComponent';
import {appColor} from '../../../constants/appColor';

const InputFood1 = ({title, value, onChangeText, keyboardType, column}) => {
  return (
    <View style={[styles.infofood, {flexDirection: column ? 'column' : 'row'}]}>
      <TextComponent
        text={title}
        color={appColor.text}
        styles={{width: column ? '100%' : '28%', textTransform: 'uppercase'}}
      />
      <TextInput
        style={[styles.input, {width: column ? '100%' : '72%'}]}
        value={value}
        color={appColor.text}
        onChangeText={onChangeText}
        keyboardType={keyboardType ?? 'default'}
      />
    </View>
  );
};

export default InputFood1;
const styles = StyleSheet.create({
  infofood: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '5%',
    textAlign: 'left',
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: appColor.lightgray,
    paddingLeft: '3%',
    paddingRight: '3%',
  },
});
