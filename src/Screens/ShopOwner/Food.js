import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {appColor} from '../../constants/appColor';
import TextComponent from './ComposenentShopOwner/TextComponent';
import {fontFamilies} from '../../constants/fontFamilies';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {appInfor} from '../../constants/appInfor';
import FoodList from './FoodList';
import FoodGroup from './FoodGroup';

const Food = () => {
  const [selected, setSelected] = useState('Món'); //selected món & nhóm món ăn
  const transx = useSharedValue(0); //animated
  //animatedStyle
  const animatedStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      width: '50%',
      zIndex: 1,
      transform: [{translateX: transx.value}],
      height: 2,
      backgroundColor: appColor.primary,
    };
  });
  //animated
  useEffect(() => {
    selected == 'Món'
      ? (transx.value = withTiming(0, {
          duration: 300,
        }))
      : (transx.value = withTiming(appInfor.sizes.width * 0.5, {
          duration: 300,
        }));
  }, [selected]);

  return (
    <View style={styles.container}>
      {/*headner */}
      <View style={styles.header}>
        <Animated.View style={animatedStyle} />
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
            fontsize={18}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            setSelected('Nhóm món ăn');
          }}>
          <TextComponent
            text={'Nhóm món ăn'}
            styles={{
              fontFamily: fontFamilies.bold,
              color:
                selected == 'Nhóm món ăn' ? appColor.primary : appColor.text,
            }}
            fontsize={18}
          />
        </TouchableOpacity>
      </View>
      {/*body */}
      {selected == 'Món' ? <FoodList /> : <FoodGroup />}
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
    gap: 5,
  },
  btn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
});
