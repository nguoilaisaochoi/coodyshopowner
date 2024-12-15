import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {appColor} from '../../constants/appColor';

import {fontFamilies} from '../../constants/fontFamilies';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {appInfor} from '../../constants/appInfor';
import FoodList from './FoodList';
import FoodGroup from './FoodGroup';
import TextComponent from '../../components/TextComponent';
import FoodListdel from './FoodListdel';
import FoodGroupdel from './FoodGroupdel';

const Food = () => {
  const [selected, setSelected] = useState('Món'); //selected món & nhóm món ăn
  const transx = useSharedValue(0); //animated
  //animatedStyle
  const animatedStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      width: '25%',
      zIndex: 1,
      transform: [{translateX: transx.value}],
      height: 2,
      paddingLeft: '3%',
      paddingRight: '3%',
      backgroundColor: appColor.primary,
    };
  });
  
  //animated
  useEffect(() => {
    if (selected == 'Món') {
      transx.value = withTiming(0, {
        duration: 300,
      });
    } else if (selected == 'Món đã xoá') {
      transx.value = withTiming(appInfor.sizes.width * 0.23, {
        duration: 300,
      });
    } else if (selected == 'Nhóm') {
      transx.value = withTiming(appInfor.sizes.width * 0.47, {
        duration: 300,
      });
    } else {
      transx.value = withTiming(appInfor.sizes.width * 0.71, {
        duration: 300,
      });
    }
  }, [selected]);

  return (
    <View style={styles.container}>
      {/*headner */}
      <View style={styles.header}>
        <Animated.View style={animatedStyle} />
        {/*món*/}
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            setSelected('Món');
          }}>
          <TextComponent
            text={'Món'}
            styles={{
              fontFamily: fontFamilies.bold,
              color: selected == 'Món' ? appColor.primary : appColor.text,
            }}
            fontsize={15}
          />
        </TouchableOpacity>
        {/*món đã xoá*/}
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            setSelected('Món đã xoá');
          }}>
          <TextComponent
            text={'Món đã xoá'}
            styles={{
              fontFamily: fontFamilies.bold,
              color:
                selected == 'Món đã xoá' ? appColor.primary : appColor.text,
            }}
            fontsize={15}
          />
        </TouchableOpacity>
        {/*nhóm*/}
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            setSelected('Nhóm');
          }}>
          <TextComponent
            text={'Nhóm'}
            styles={{
              fontFamily: fontFamilies.bold,
              color: selected == 'Nhóm' ? appColor.primary : appColor.text,
            }}
            fontsize={15}
          />
        </TouchableOpacity>
        {/*nhóm đã xoá*/}
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            setSelected('Nhóm đã xoá');
          }}>
          <TextComponent
            text={'Nhóm đã xoá'}
            styles={{
              fontFamily: fontFamilies.bold,
              color:
                selected == 'Nhóm đã xoá' ? appColor.primary : appColor.text,
            }}
            fontsize={15}
          />
        </TouchableOpacity>
      </View>
      {/*body */}
      {selected == 'Món' && <FoodList />}
      {selected == 'Nhóm' && <FoodGroup />}
      {selected == 'Món đã xoá' && <FoodListdel />}
      {selected == 'Nhóm đã xoá' && <FoodGroupdel />}
    </View>
  );
};

export default Food;
const styles = StyleSheet.create({
  container: {
    backgroundColor: appColor.white,
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: '10%',
  },
  header: {
    flexDirection: 'row',
    flex: 0.08,
    alignItems: 'flex-end',
    borderBottomWidth: 1,
    borderBottomColor: appColor.lightgray,
    marginLeft: '3%',
    marginRight: '3%',
  },
  btn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    textAlign:'center'
  },
});
