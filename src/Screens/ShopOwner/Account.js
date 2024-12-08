import {View, StyleSheet, Image, Switch} from 'react-native';
import React, {useEffect, useState} from 'react';
import {appColor} from '../../constants/appColor';
import ItemAccount from './ComposenentShopOwner/ItemAccount';
import {useNavigation} from '@react-navigation/native';
import {logout} from '../../Redux/Reducers/LoginSlice';
import {useDispatch, useSelector} from 'react-redux';

import {fontFamilies} from '../../constants/fontFamilies';
import {
  GetOfflince,
  GetOnlince,
  GetShop,
  GetShopCategories,
} from '../../Redux/Reducers/ShopOwnerReducer';
import TextComponent from '../../components/TextComponent';
import {green, opacity} from 'react-native-reanimated/lib/typescript/Colors';
import LoadingModal from '../../modal/LoadingModal';

const Account = () => {
  const navigation = useNavigation();
  const {user} = useSelector(state => state.login);
  const {getData, getStatus, GetOnlinceStatus, GetOfflinceStatus} = useSelector(
    state => state.shopowner,
  );
  const [isOnlince, setIsOnlince] = useState(
    getData.status == 'Mở cửa' ? true : false,
  );
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  //navigation
  const gotoScreen = screen => {
    navigation.navigate(screen);
  };

  //lấy loại trước khi vào thong tin nha hang
  useEffect(() => {
    dispatch(GetShopCategories());
  }, []);

  //lay thong tin shop sau khi tu compoent khac tro ve
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(GetShop(user._id));
    });
    return unsubscribe;
  }, [navigation]);

  //call api mo cua/dong cua
  useEffect(() => {
    if (isOnlince && isLoading) {
      dispatch(GetOnlince(user._id));
    } else if (!isOnlince && isLoading) {
      dispatch(GetOfflince(user._id));
    }
  }, [isOnlince]);
  //quan ly trang thai dong/mo cua api-->lay thong tin shop
  useEffect(() => {
    if (GetOfflinceStatus == 'succeeded' || GetOfflinceStatus == 'succeeded') {
      setIsLoading(false);
      dispatch(GetShop(user._id));
    }
  }, [GetOnlinceStatus, GetOfflinceStatus]);

  //tat loading khi lay thong tin shop thanh cong
  useEffect(() => {
    if (getStatus == 'succeeded') {
      setIsLoading(false);
    }
  }, [getStatus]);

  //chuyen switch isOnlince
  const toggleSwitch = () => {
    setIsOnlince(!isOnlince);
    setIsLoading(true);
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{width: '80%'}}>
          <TextComponent
            text={'Xin chào '}
            fontsize={23}
            color={appColor.white}
            fontFamily={fontFamilies.semiBold}
            styles={{opacity: 0.9}}
          />
          <TextComponent
            text={getData.name}
            fontsize={23}
            color={appColor.white}
            fontFamily={fontFamilies.bold}
          />
          <View style={styles.status}>
            <TextComponent
              text={'Mở cửa'}
              color={appColor.white}
              fontFamily={fontFamilies.semiBold}
              styles={{opacity: isOnlince ? 1 : 0.5}}
            />
            <Switch
              thumbColor={appColor.white}
              onValueChange={toggleSwitch}
              value={isOnlince}
            />
          </View>
        </View>
        <View style={styles.imgitem}>
          <Image
            style={{flex: 1}}
            source={{
              uri:
                getData.images[0] ??
                'https://res.cloudinary.com/djywo5wza/image/upload/v1729757743/clone_viiphm.png',
            }}
          />
        </View>
      </View>
      <View style={styles.body}>
        {/*        <ItemAccount
          screen={() => {
            gotoScreen('Profile');
          }}
          text={'Thông tin cá nhân của bạn'}
          icon={'user'}
        /> */}
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
      <LoadingModal visible={isLoading} />
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
  status: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    marginTop: '2%',
  },
});
