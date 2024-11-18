import {View, TextInput, StyleSheet} from 'react-native';
import React from 'react';
import TextComponent from '../../../components/TextComponent';
import {appColor} from '../../../constants/appColor';

const InputFood1 = ({title, value, onChangeText}) => {
  return (
    <View style={styles.infofood}>
      <TextComponent
        text={title}
        styles={{width: '28%', textTransform: 'uppercase'}}
      />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
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
  },
  input: {
    borderWidth: 1,
    width: '72%',
    borderRadius: 10,
    borderColor: appColor.lightgray,
    paddingLeft: '3%',
    paddingRight: '3%',
  },
});
