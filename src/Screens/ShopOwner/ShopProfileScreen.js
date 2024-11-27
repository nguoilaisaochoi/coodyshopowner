import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';

import HeaderComponent from '../../components/HeaderComponent';
import {appColor} from '../../constants/appColor';
import TextComponent from '../../components/TextComponent';
import TextInputComponent from './ComposenentShopOwner/TextInputComponent';
import ButtonComponent from '../../components/ButtonComponent';
import {fontFamilies} from '../../constants/fontFamilies';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useDispatch, useSelector} from 'react-redux';
import {validatePhone} from '../../utils/Validators';
import {
  UpdateShop,
  UpdateShopCategory,
} from '../../Redux/Reducers/ShopOwnerReducer';
import LoadingModal from '../../modal/LoadingModal';

import SelectImage from './ComposenentShopOwner/SelectImage';
import {MultiSelect} from 'react-native-element-dropdown';
import {Trash} from 'iconsax-react-native';
import MapAPI from '../../core/apiMap/MapAPI';

const ShopProfileScreen = ({navigation, route}) => {
  const {description} = route.params || {};
  const {user} = useSelector(state => state.login); //thông tin khi đăng nhập
  const {
    UpdateShopCategoryStatus,
    getData,
    GetShopCategoriesData,
    UpdateShopStatus,
    getStatus,
  } = useSelector(state => state.shopowner);
  const [name, setName] = useState(getData?.name ?? null);
  const [category, setCategory] = useState(GetShopCategoriesData ?? null);
  const [phone, setPhone] = useState(getData?.phone ?? null);
  const [address, setAddress] = useState(getData?.address ?? null);
  const dispath = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(getData.openingHours ? new Date(getData.openingHours):null); //thời gian mở cửa
  const [close, setClose] = useState(getData.closeHours ? new Date(getData.closeHours):null); //thời gian đóng cửa
  const [timeType, setTimeType] = useState(null); //phân biệt thời gian mở và đóng để setState
  const [imagePath, setImagePath] = useState(null); //nhận ảnh khi vừa chọn từ thư viện or chụp
  const [avatar, setAvatar] = useState(getData?.images[0] ?? null); //getData?.image[0]
  const [showPicker, setshowPicker] = useState(false); //bật/tắt DateTimePicker
  const [isSheetOpen, setIsSheetOpen] = useState(false); //quản lí state khi nhấn vào avatar để chọn ảnh
  const [correct, setCorrect] = useState(true); //quản lí state khi đúng mới cho cập nhật(là state cho phép cập nhật, nếu sai thì nút cập nhật bị mờ đi)
  const [isclick, setisClick] = useState(false); //đã click vào button cập nhật hay chưa
  const [mycategory, setMyCategory] = useState([]);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  //cập nhật shipper lên api(tham khảo)
  const update = async () => {
    const body = {
      name: name,
      phone: phone,
      images: [avatar],
      address: address,
      shopCategory_ids: mycategory,
      openingHours: open,
      closeHours: close,
    };
    const body2 = {shopCategory_ids: mycategory};
    dispath(UpdateShop({id: user._id, data: body}));
    dispath(UpdateShopCategory({id: user._id, data: body2}));
  };

  //thông báo cập nhật thanh cong se goi lai thong tin shop
  useEffect(() => {
    if (
      UpdateShopStatus == 'succeeded' &&
      UpdateShopCategoryStatus &&
      isclick
    ) {
      ToastAndroid.show('Cập nhật thành công', ToastAndroid.SHORT);
      setIsLoading(false);
      navigation.goBack();
      setisClick(false);
    } else if (UpdateShopStatus == 'failed' && isclick) {
      ToastAndroid.show('Cập nhật thất bại', ToastAndroid.SHORT);
      setIsLoading(false);
      setisClick(false);
    }
  }, [UpdateShopStatus, UpdateShopCategoryStatus]);

  //quản lí state correct(là state cho phép cập nhật, nếu sai thì nút cập nhật bị mờ đi)
  useEffect(() => {
    const checkphone = checkPhone(phone);
    const date1 = new Date(open);
    const date2 = new Date(close);
    !name ||
    !phone ||
    checkphone ||
    mycategory.length == 0 ||
    (open && date1.getTime() >= date2.getTime())
      ? setCorrect(false)
      : setCorrect(true);
  }, [name, phone, mycategory, open, close]);

  //check phone
  const checkPhone = data => {
    return validatePhone(data) ? null : 'Số điện thoại không hợp lệ';
  };

  //hàm xử lí khi DateTimePicker đc bật
  const handleDateChange = (event, selectedTime) => {
    if (event.type == 'set') {
      if (timeType == 'open') {
        setOpen(selectedTime);
      } else {
        setClose(selectedTime);
      }
      console.log(selectedTime);
    }
    setshowPicker(false);
  };

  //lấy id loại khi vào component
  useEffect(() => {
    const idcategory = getData.shopCategory.map(item => {
      return item.shopCategory_id;
    });
    setMyCategory(idcategory);
  }, [getData]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (description) {
        setAddress(description);
        getGeocoding();
      }
    });
    return unsubscribe;
  }, [navigation, description]);

  //nhận ảnh khi thực hiện chụp or chọn ảnh từ thư viện(chưa đưa vào api)
  useEffect(() => {
    if (imagePath) {
      setAvatar(imagePath.uri);
    }
  }, [imagePath]);

  //lay toa do
  const getGeocoding = async () => {
    try {
      if (address) {
        let geocoding = await MapAPI.getForwardGeocoding({
          description: encodeURIComponent(address),
        });
        // console.log('geocoding', geocoding.results[0].formatted_address);
        setLatitude(geocoding.results[0].geometry.location.lat);
        setLongitude(geocoding.results[0].geometry.location.lng);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  //
  return (
    <View style={styles.container}>
      <HeaderComponent text={'Thông nhà hàng'} isback={true} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{flexGrow: 1, justifyContent: 'space-between'}}>
        {/*avatar*/}
        <View style={{alignItems: 'center'}}>
          <TouchableOpacity
            style={styles.body1}
            activeOpacity={0.85}
            onPress={() => {
              setIsSheetOpen(true);
            }}>
            <View style={styles.boximg}>
              <Image
                style={{width: 99, height: 99}}
                source={{
                  uri:
                    avatar ??
                    'https://res.cloudinary.com/djywo5wza/image/upload/v1729757743/clone_viiphm.png',
                }}
              />
            </View>
            <Image
              style={styles.camera}
              source={require('../../assets/images/shopowner/camera.png')}
            />
          </TouchableOpacity>
          <View style={styles.rate}>
            <TextComponent text={'Đánh giá: '} color={appColor.subText} />
            <TextComponent text={getData.rating + ' '} />
            <Image
              style={{width: 15, height: 15}}
              source={require('../../assets/images/shopowner/star.png')}
            />
          </View>
        </View>
        {/**/}

        {/*input*/}
        <TextInputComponent
          text={'TÊN NHÀ HÀNG'}
          value={name}
          onChangeText={text => setName(text)}
          error={name ? null : 'Đây là thông tin bắt buộc'}
        />
        <TextInputComponent
          text={'HOTLINE'}
          value={phone}
          onChangeText={text => setPhone(text)}
          error={phone ? checkPhone(phone) : 'Đây là thông tin bắt buộc'}
        />
        <TextComponent text={'LOẠI HÌNH BÁN HÀNG'} />
        <MultiSelect
          style={styles.input}
          data={GetShopCategoriesData}
          labelField="name"
          valueField="_id"
          value={mycategory ?? 'trống'}
          selectedTextStyle={{color: appColor.text}}
          itemTextStyle={{color: appColor.text}}
          placeholderStyle={{color: appColor.subText}}
          placeholder={'Chọn loại bán hàng...'}
          onChange={item => {
            setMyCategory(item);
          }}
          renderSelectedItem={(item, unSelect) => (
            <TouchableOpacity
              onPress={() => unSelect && unSelect(item)}
              activeOpacity={0.8}>
              <View style={styles.selectedStyle}>
                <TextComponent
                  styles={styles.textSelectedStyle}
                  text={item.name}
                  fontsize={14}
                />
                <Trash color="black" size={17} />
              </View>
            </TouchableOpacity>
          )}
        />
        <View style={{marginTop: '3%'}} />

        <TextComponent text={'ĐỊA CHỈ'} fontFamily={fontFamilies.bold} />
        <TouchableOpacity
          style={[styles.input, {minHeight: 50}]}
          onPress={() => {
            navigation.navigate('ShopCategories');
          }}>
          <TextComponent
            text={address}
            fontsize={14}
            numberOfLines={1}
            ellipsizeMode={'tail'}
          />
        </TouchableOpacity>

        {/*Mở cửa và đóng cửa*/}
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{width: '45%'}}>
            <TextComponent text={'MỞ CỬA'} fontFamily={fontFamilies.bold} />
            <TouchableOpacity
              onPress={() => {
                setshowPicker(true);
                setTimeType('open');
              }}
              style={styles.button}
              activeOpacity={0.5}>
              <TextComponent
                fontFamily={fontFamilies.regular}
                fontsize={14}
                text={open ? open.toLocaleTimeString() : '--:--'}
              />
            </TouchableOpacity>
          </View>
          <View style={{width: '45%'}}>
            <TextComponent text={'ĐÓNG CỬA'} fontFamily={fontFamilies.bold} />
            <TouchableOpacity
              onPress={() => {
                setshowPicker(true);
                setTimeType('close');
              }}
              style={styles.button}
              activeOpacity={0.5}>
              <TextComponent
                fontFamily={fontFamilies.regular}
                fontsize={14}
                text={close ? close.toLocaleTimeString() : '--:--'}
              />
            </TouchableOpacity>
          </View>
          {showPicker && (
            <DateTimePicker
              mode={'time'}
              value={new Date()}
              onChange={handleDateChange}
            />
          )}
        </View>
        {/**/}

        <View style={{flex: 1}} />
        {/*Button cập nhật*/}
        <View style={styles.footer}>
          <ButtonComponent
            text={'Cập nhật'}
            color={appColor.white}
            height={51}
            styles={{opacity: correct ? 1 : 0.5, marginBottom: '5%'}}
            onPress={
              correct
                ? () => {
                    update();
                    setIsLoading(true);
                    setisClick(true);
                  }
                : null
            }
          />
        </View>
      </ScrollView>

      {isSheetOpen && (
        <SelectImage
          setImagePath={setImagePath}
          setIsSheetOpen={setIsSheetOpen}
        />
      )}
      <LoadingModal visible={isLoading} />
    </View>
  );
};

export default ShopProfileScreen;
const styles = StyleSheet.create({
  container: {
    backgroundColor: appColor.white,
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: '12%',
    paddingLeft: '5%',
    paddingRight: '5%',
  },
  bg: {
    backgroundColor: 'rgba(217.81, 217.81, 217.81, 0.50)',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  optionavatar: {
    flex: 1,
    zIndex: 2,
    backgroundColor: appColor.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  body1: {
    width: 97,
    height: 95,
  },
  boximg: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: appColor.subText,
  },
  camera: {
    position: 'absolute',
    width: 30,
    height: 30,
    zIndex: 1,
    bottom: -13,
    right: -13,
  },
  dropdown: {
    backgroundColor: appColor.white,
    padding: 18,
    height: 58,
    marginTop: 10,
    marginBottom: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: appColor.input,
  },
  placeholder: {
    color: appColor.text,
    opacity: 0.5,
  },
  selectedTextStyle: {
    color: appColor.text,
    opacity: 0.5,
  },
  button: {
    borderWidth: 1,
    borderRadius: 10,
    height: 58,
    marginTop: 10,
    marginBottom: 15,
    borderColor: appColor.input,
    padding: 18,
  },
  rate: {
    marginTop: '4.3%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  footer: {
    marginTop: 'auto', // Đảm bảo footer luôn ở dưới cùng
    marginBottom: 'auto',
  },
  input: {
    marginTop: 10,
    backgroundColor: appColor.white,
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 10,
    padding: 18,
    height: 58,
    color: appColor.text,
    borderColor: appColor.lightgray,
  },
  selectedStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: 'white',
    shadowColor: '#000',
    marginTop: '3%',
    marginRight: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  textSelectedStyle: {
    marginRight: 5,
  },
});
