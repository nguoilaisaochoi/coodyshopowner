import {View, StyleSheet, Image} from 'react-native';
import React, {useEffect} from 'react';
import {appColor} from '../../constants/appColor';
import ItemAccount from './ComposenentShopOwner/ItemAccount';
import {useNavigation} from '@react-navigation/native';
import {logout} from '../../Redux/Reducers/LoginSlice';
import {useDispatch, useSelector} from 'react-redux';
import {GetShipper} from '../../Redux/Reducers/ShipperReducer';
import TextComponent from './ComposenentShopOwner/TextComponent';
import {fontFamilies} from '../../constants/fontFamilies';
import {opacity} from 'react-native-reanimated/lib/typescript/Colors';

const Account = () => {
  const navigation = useNavigation();
  const {user} = useSelector(state => state.login);
  const {getData, getStatus} = useSelector(state => state.shipper);
  const dispatch = useDispatch();

  //navigation
  const gotoScreen = screen => {
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{width: '80%'}}>
          <TextComponent
            text={'Xin chào '}
            fontsize={23}
            color={appColor.white}
            fontfamily={fontFamilies.semiBold}
            styles={{opacity: 0.9}}
          />
          <TextComponent
            text={'NAME'}
            fontsize={23}
            color={appColor.white}
            fontfamily={fontFamilies.bold}
          />
        </View>
        <View style={styles.imgitem}>
          <Image
            style={{flex: 1}}
            source={{
              uri: 'https://res.cloudinary.com/djywo5wza/image/upload/v1729757743/clone_viiphm.png',
            }}
          />
        </View>
      </View>
      <View style={styles.body}>
        <ItemAccount
          screen={() => {
            gotoScreen('Profile');
          }}
          text={'Thông tin cá nhân của bạn'}
          icon={'user'}
        />
        <ItemAccount
          screen={() => {
            gotoScreen('ShopProfile');
          }}
          text={'Thông tin nhà hàng'}
          icon={'shop'}
        />
        <ItemAccount
          text={'Đổi mật khẩu'}
          icon={'padlock'}
          screen={() => {
            gotoScreen('ChangePass');
          }}
        />
        <ItemAccount
          text={'Đăng xuất'}
          screen={() => {
            dispatch(logout());
          }}
        />
      </View>
    </View>
  );
};

export default Account;
const styles = StyleSheet.create({
  container: {
    paddingTop: '10%',
    flex: 1,
    backgroundColor: appColor.white,
  },
  header: {
    flex: 0.4,
    backgroundColor: appColor.primary,
    padding: '2%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  body: {
    flex: 2,
    backgroundColor: appColor.white,
    padding: '10%',
    gap: 21,
  },
  headertext: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 25,
  },
  btn: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
  },
  item: {
    flexShrink: 1,
    height: 58,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: '4%',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: appColor.input,
  },
  img: {
    aspectRatio: 1,
    resizeMode: 'contain',
  },
  imgitem: {
    width: '20%',
    aspectRatio: 1,
    borderRadius: 10,
    marginRight: '5%',
    backgroundColor: appColor.gray,
    overflow: 'hidden',
    borderRadius: 99,
  },
});
