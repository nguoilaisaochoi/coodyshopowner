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
import {Dropdown} from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useDispatch, useSelector} from 'react-redux';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import {validateEmail, validatePhone} from '../../utils/Validators';
import {GetShipper, UpdateShipper} from '../../Redux/Reducers/ShopOwnerReducer';
import LoadingModal from '../../modal/LoadingModal';
import {uploadImageToCloudinary} from './ComposenentShopOwner/UploadImage';
import {onImageLibrary, onOpenCamera} from './ComposenentShopOwner/ImagePicker';

const ProfileScreen = () => {
  const {updateStatus, getData} = useSelector(state => state.shopowner); //demo-- có thể tinh chỉnh lại
  const [name, setName] = useState(getData?.name ?? null);
  const [email, setEmail] = useState(getData?.email ?? null);
  const [phone, setPhone] = useState(getData?.phone ?? null);
  const [birthDate, setbirthDate] = useState(getData?.birthDate ?? null);
  const [gender, setGender] = useState(
    getData?.gender == 'male' ? 'Nam' : 'Nữ',
  );
  const [imagePath, setImagePath] = useState(null);
  const [avatar, setAvatar] = useState(getData?.images[0] ?? null); //getData?.image[0]
  const [showPicker, setshowPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispath = useDispatch();
  const [isSheetOpen, setIsSheetOpen] = useState(false); //quản lí state khi nhấn vào avatar để chọn ảnh
  const [correct, setCorrect] = useState(true); //quản lí state khi đúng mới cho cập nhật(là state cho phép cập nhật, nếu sai thì nút cập nhật bị mờ đi)
  const [isclick, setisClick] = useState(false); //đã click vào button cập nhật hay chưa
  const sheetRef = useRef(null); //để snap index bottomsheet

  //cập nhật shipper lên api(tham khảo)
  const update = async () => {
    const body = {
      name: name,
      phone: phone,
      email: email,
      birthDate: new Date(birthDate),
      vehicleBrand: vehicleBrand,
      vehiclePlate: vehiclePlate,
      gender: gender == 'Nam' ? 'male' : 'female',
      status: 'active',
      image: await uploadImageToCloudinary(imagePath),
    };
    dispath(UpdateShipper({id: user._id, data: body}));
  };

  //check phone
  const checkPhone = data => {
    return validatePhone(data) ? null : 'Số điện thoại không hợp lệ';
  };

  //check email
  const checkEmail = data => {
    return validateEmail(data) ? null : 'Email không hợp lệ';
  };

  //quản lí state correct(là state cho phép cập nhật, nếu sai thì nút cập nhật bị mờ đi)
  useEffect(() => {
    const checkphone = checkPhone(phone);
    const checkemail = checkEmail(email);
    !name || !phone || !email || checkemail || checkphone
      ? setCorrect(false)
      : setCorrect(true);
  }, [name, phone, email]);

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
  const handleDateChange = (event, selectedDate) => {
    if (event.type == 'set') {
      const currentDate = selectedDate;
      setbirthDate(currentDate);
    }
    setshowPicker(false);
  };

  // Mở Bottom Sheet
  const openSheet = () => {
    sheetRef.current.snapToIndex(0);
    setIsSheetOpen(true);
  };
  // Đóng Bottom Sheet
  const closeSheet = () => {
    sheetRef.current.close();
    setIsSheetOpen(false);
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
      <HeaderComponent text={'Thông tin cá nhân'} isback={true} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/*avatar*/}
        <View style={{alignItems: 'center'}}>
          <TouchableOpacity
            style={styles.body1}
            activeOpacity={0.85}
            onPress={() => {
              openSheet();
            }}>
            <View style={styles.boximg}>
              <Image
                style={{width: 99, height: 99}}
                source={{
                  uri: avatar
                    ? avatar
                    : 'https://res.cloudinary.com/djywo5wza/image/upload/v1729757743/clone_viiphm.png',
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
          text={'HỌ VÀ TÊN'}
          value={name}
          onChangeText={text => setName(text)}
          error={name ? null : 'Đây là thông tin bắt buộc'}
        />
        <TextInputComponent
          text={'EMAIL'}
          value={email}
          onChangeText={text => setEmail(text)}
          error={email ? checkEmail(email) : 'Đây là thông tin bắt buộc'}
        />
        <TextInputComponent
          text={'SỐ ĐIỆN THOẠI'}
          value={phone}
          onChangeText={text => setPhone(text)}
          error={phone ? checkPhone(phone) : 'Đây là thông tin bắt buộc'}
        />
        <TextComponent text={'GIỚI TÍNH'} />
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholder}
          selectedTextStyle={styles.selectedTextStyle}
          iconStyle={{}}
          itemTextStyle={{color: appColor.text}}
          data={data}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={gender}
          value={gender}
          onChange={item => {
            setGender(item.value);
          }}
        />
        <TextComponent text={'NGÀY SINH'} fontFamily={fontFamilies.bold} />
        <View>
          <TouchableOpacity
            onPress={() => {
              setshowPicker(true);
            }}
            style={styles.button}
            activeOpacity={0.5}>
            <TextComponent
              fontFamily={fontFamilies.regular}
              fontsize={14}
              text={
                birthDate
                  ? new Date(birthDate).toLocaleDateString('vi-VN')
                  : '--/--/----'
              }
              styles={{opacity: 0.5}}
            />
          </TouchableOpacity>
          {showPicker && (
            <DateTimePicker
              mode={'date'}
              value={new Date(birthDate) || new Date()}
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

      {/*làm tối nền khi bottomsheet hiện lên*/}
      {isSheetOpen && (
        <TouchableOpacity
          activeOpacity={1}
          style={styles.bg}
          onPress={() => {
            closeSheet();
          }}
        />
      )}

      {/*bottomsheet chụp ảnh&&chọn ảnh từ thư viện*/}
      <BottomSheet
        ref={sheetRef}
        handleComponent={null}
        snapPoints={['18%']}
        index={-1}
        containerStyle={{flex: 1, zIndex: 2}}>
        <BottomSheetView style={styles.optionavatar}>
          <ButtonComponent
            text={'Chụp ảnh'}
            width={'40%'}
            color={appColor.white}
            height={51}
            onPress={() => {
              onOpenCamera(setImagePath);
              closeSheet();
            }}
          />
          <ButtonComponent
            text={'Thư viện'}
            width={'40%'}
            color={appColor.white}
            height={51}
            onPress={() => {
              onImageLibrary(setImagePath);
              closeSheet();
            }}
          />
        </BottomSheetView>
      </BottomSheet>
      <LoadingModal visible={isLoading} />
    </View>
  );
};

export default ProfileScreen;
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
});
//data cho dropdown
const data = [
  {label: 'Nam', value: 'Nam'},
  {label: 'Nữ', value: 'Nữ'},
];
