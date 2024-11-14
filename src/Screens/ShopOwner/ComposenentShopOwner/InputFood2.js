import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {Dropdown} from 'react-native-element-dropdown';
import {appColor} from '../../../constants/appColor';
import TextComponent from '../../../components/TextComponent';

const InputFood2 = ({text, data, value, onChange}) => {
  return (
    <View style={styles.view}>
      <TextComponent text={text} styles={{textTransform: 'uppercase'}} />
      <Dropdown
        style={styles.dropdown}
        data={data}
        labelField="label"
        valueField="value"
        placeholder={data[0].label}
        value={value}
        onChange={onChange}
      />
    </View>
  );
};

export default InputFood2;
const styles = StyleSheet.create({
  view: {
    width: '90%',
    marginTop: '5%',
  },
  dropdown: {
    marginTop: '2%',
    backgroundColor: appColor.white,
    borderWidth: 1,
    padding: 13,
    width: '100%',
    borderRadius: 10,
    borderColor: appColor.lightgray,
  },
});
