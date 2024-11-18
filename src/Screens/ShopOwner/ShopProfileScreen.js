import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';

import HeaderComponent from '../../components/HeaderComponent';
import {appColor} from '../../constants/appColor';
import TextComponent from '../../components/TextComponent';
import TextInputComponent from './ComposenentShopOwner/TextInputComponent';
import ButtonComponent from '../../components/ButtonComponent';
import {fontFamilies} from '../../constants/fontFamilies';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useDispatch, useSelector} from 'react-redux';
import {validatePhone} from '../../utils/Validators';
import {GetShipper, UpdateShipper} from '../../Redux/Reducers/ShopOwnerReducer';
import LoadingModal from '../../modal/LoadingModal';
import {uploadImageToCloudinary} from './ComposenentShopOwner/UploadImage';
import SelectImage from './ComposenentShopOwner/SelectImage';

const ShopProfileScreen = () => {
  const {updateStatus, getData} = useSelector(state => state.shopowner); //demo-- có thể tinh chỉnh lại
  const [name, setName] = useState(getData?.name ?? null);
  const [category, setCategory] = useState(getData?.category ?? null);
  const [phone, setPhone] = useState(getData?.phone ?? null);
  const [address, setAddress] = useState(getData?.address ?? null);
  const dispath = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(getData?.open ?? null); //thời gian mở cửa
  const [close, setClose] = useState(getData?.close ?? null); //thời gian đóng cửa
  const [timeType, setTimeType] = useState(null); //phân biệt thời gian mở và đóng để setState
  const [imagePath, setImagePath] = useState(null); //nhận ảnh khi vừa chọn từ thư viện or chụp
  const [avatar, setAvatar] = useState(getData?.images[0] ?? null); //getData?.image[0]
  const [showPicker, setshowPicker] = useState(false); //bật/tắt DateTimePicker
  const [isSheetOpen, setIsSheetOpen] = useState(false); //quản lí state khi nhấn vào avatar để chọn ảnh
  const [correct, setCorrect] = useState(true); //quản lí state khi đúng mới cho cập nhật(là state cho phép cập nhật, nếu sai thì nút cập nhật bị mờ đi)
  const [isclick, setisClick] = useState(false); //đã click vào button cập nhật hay chưa

  //cập nhật shipper lên api(tham khảo)
  const update = async () => {
    const body = {
      name: name,
      phone: phone,
      category: category,
      //birthDate: new Date(birthDate),
      vehicleBrand: vehicleBrand,
      vehiclePlate: vehiclePlate,
      status: 'active',
      image: await uploadImageToCloudinary(imagePath),
    };
    dispath(UpdateShipper({id: user._id, data: body}));
  };

  //check phone
  const checkPhone = data => {
    return validatePhone(data) ? null : 'Số điện thoại không hợp lệ';
  };

  //quản lí state correct(là state cho phép cập nhật, nếu sai thì nút cập nhật bị mờ đi)
  useEffect(() => {
    const checkphone = checkPhone(phone);
    !name || !phone || checkphone ? setCorrect(false) : setCorrect(true);
  }, [name, phone]);

  //thông báo cập nhật
  useEffect(() => {
    if (updateStatus == 'succeeded' && isclick) {
      ToastAndroid.show('Cập nhật thành công', ToastAndroid.SHORT);
      setIsLoading(false);
      dispath(GetShipper(user._id));
      setisClick(false);
    } else if (updateStatus == 'failed' && isclick) {
      ToastAndroid.show('Cập nhật thất bại', ToastAndroid.SHORT);
      setIsLoading(false);
      setisClick(false);
    }
  }, [updateStatus]);

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

  //nhận ảnh khi thực hiện chụp or chọn ảnh từ thư viện(chưa đưa vào api)
  useEffect(() => {
    if (imagePath) {
      setAvatar(imagePath.uri);
    }
  }, [imagePath]);

  //
  return (
    <View style={styles.container}>
      <HeaderComponent text={'Thông nhà hàng'} isback={true} />
      <ScrollView showsVerticalScrollIndicator={false}>
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
            <TextComponent text={'5' + ' '} />
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
          text={'LOẠI HÌNH BÁN HÀNG'}
          value={category}
          onChangeText={text => setEmail(text)}
          error={category ? null : 'Đây là thông tin bắt buộc'}
        />
        <TextInputComponent
          text={'ĐỊA CHỈ'}
          value={address}
          onChangeText={text => setPhone(text)}
          error={address ? null : 'Đây là thông tin bắt buộc'}
        />
        <TextInputComponent
          text={'HOTLINE'}
          value={phone}
          onChangeText={text => setPhone(text)}
          error={phone ? checkPhone(phone) : 'Đây là thông tin bắt buộc'}
        />

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
                styles={{opacity: 0.5}}
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
                styles={{opacity: 0.5}}
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
    marginTop: '10%',
  },
});
