import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import TextComponent from '../../../components/TextComponent';
import {fontFamilies} from '../../../constants/fontFamilies';
import {appColor} from '../../../constants/appColor';


//../../assets/images/shipper/user.png
const ItemAccount = ({text, icon, screen}) => {
  const images = {
    user: require('../../../assets/images/shopowner/user.png'),
    setting: require('../../../assets/images/shopowner/settings.png'),
    padlock: require('../../../assets/images/shopowner/padlock.png'),
    logout: require('../../../assets/images/shopowner/logout.png'),
    shop: require('../../../assets/images/shopowner/shopinfo.png'),
  };
  const getImageSource = icons => {
    if (icons === 'user') {
      return images.user;
    } else if (icons == 'setting') {
      return images.setting;
    } else if (icons == 'padlock') {
      return images.padlock;
    } if (icons == 'shop') {
      return images.shop;
    }else {
      return images.logout;
    }
  };
  return (
    <TouchableOpacity activeOpacity={0.5} style={styles.item} onPress={screen}>
      <Image style={[styles.img, {flex: 0.2}]} source={getImageSource(icon)} />
      <TextComponent
        text={text}
        fontsize={18}
        fontfamily={fontFamilies.semiBold}
        styles={{flex: 2, textAlign: 'center'}}
      />
      <Image
        style={[styles.img, {flex: 0.15}]}
        source={require('../../../assets/images/shopowner/enter.png')}
      />
    </TouchableOpacity>
  );
};

export default ItemAccount;
const styles = StyleSheet.create({
  item: {
    flexShrink: 1,
    flexGrow: 0.01,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: '4%',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: appColor.input,
    gap: 10,
  },
  img: {
    aspectRatio: 1,
    resizeMode: 'contain',
  },
});
