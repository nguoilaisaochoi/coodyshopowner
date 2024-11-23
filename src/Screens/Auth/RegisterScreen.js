import { FlatList, Image, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import ContainerComponent from '../../components/ContainerComponent';
import SpaceComponent from '../../components/SpaceComponent';
import RowComponent from '../../components/RowComponent';
import TextComponent from '../../components/TextComponent';
import { fontFamilies } from '../../constants/fontFamilies';
import { appColor } from '../../constants/appColor';
import InputComponent from '../../components/InputComponent';
import ButtonComponent from '../../components/ButtonComponent';
import { appInfor } from '../../constants/appInfor';
import { globalStyle } from '../../styles/globalStyle';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import {
  validateEmail,
  validatePass,
  validatePhone,
} from '../../utils/Validators';
import AxiosInstance from '../../helpers/AxiosInstance';
import LoadingModal from '../../modal/LoadingModal';
import { Trash } from 'iconsax-react-native';
import LineComponent from '../../components/LineComponent';
import MapAPI from '../../core/apiMap/MapAPI';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [category, setCategory] = useState([]);
  const [value, setValue] = useState([]);
  const [isShowAddress, setIsShowAddress] = useState(false);
  const [description, setDescription] = useState([]);
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  console.log('value', value);
  console.log('description', description);
  console.log('latitude', latitude);
  console.log('longitude', longitude);
  console.log('address', address);


  useEffect(() => {
    const emailcheck = validateEmail(email);
    const phonecheck = validatePhone(phone);
    const passcheck = checkpass(password);
    !email ||
      !phone ||
      !rePassword ||
      !phone ||
      !password ||
      !emailcheck ||
      !phonecheck ||
      !name ||
      !address ||
      !value ||
      passcheck
      ? setCorrect(false)
      : setCorrect(true);
  }, [email, password, phone, rePassword, address, value]);

  const checkEmail = data => {
    return validateEmail(data) ? null : 'Email không đúng định dạng';
  };

  const checkPhone = data => {
    return validatePhone(data) ? null : 'Số điện thoại không đúng định dạng';
  };
  const checkpass = pass => {
    return pass.length >= 6 ? null : 'Mật khẩu phải 6 ký tự trở lên';
  };

  const checkrepass = (pass, repass) => {
    return pass == repass ? null : 'Mật khẩu không khớp';
  };
  const checkCategory = data => {
    return data ? null : 'Chưa chọn loại cửa hàng';
  };

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      const response = await AxiosInstance().post('/users/register', {
        email,
        password,
        phone,
        name,
        // gender: 'male',
        role: 'shopOwner',
        shopCategory_ids: value,
        address,
        latitude,
        longitude,
        // birthDate: new Date('2000-01-01'),
      });
      if (response.status == true) {
        ToastAndroid.show('Thành công', ToastAndroid.SHORT);
        setIsLoading(false);
        // navigation.navigate('Login');
        return response.data;
      } else {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const getCategories = async () => {
    try {
      setIsLoading(true);
      const response = await AxiosInstance().get('/shopCategories')
      if (response.status == true) {
        const categories = response.data.map(item => ({
          label: item.name, // Chuyển đổi dữ liệu thành định dạng mà MultiSelect yêu cầu
          value: item._id,
        }));
        setCategory(categories);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const getPlacesAutocomplete = async () => {
    let autoComplete = await MapAPI.getPlacesAutocomplete({
      search: encodeURIComponent(address),
    });
    setDescription(autoComplete.predictions);
  };

  const getGeocoding = async () => {
    try {
      if (address) {
        let geocoding = await MapAPI.getForwardGeocoding({
          description: encodeURIComponent(address),
        });
        // console.log('geocoding', geocoding.results[0].formatted_address);
        setLatitude(geocoding.results[0].geometry.location.lat)
        setLongitude(geocoding.results[0].geometry.location.lng)

      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const updateSearch = (text) => {
    setAddress(text);
    setIsShowAddress(true)
  };
  const handleAddressSelect = async (item) => {
    setAddress(item.description);
    setIsShowAddress(false);
    await getGeocoding();
  };
  useEffect(() => {
    if (address.length >= 1) {
      getPlacesAutocomplete();
    } else {
      setIsShowAddress(false)
    }
  }, [address]);

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={{ paddingTop: 10 }} onPress={() => handleAddressSelect(item)}>
        <TextComponent text={item.description} />
        <SpaceComponent height={10} />
        <LineComponent />
      </TouchableOpacity >
    );
  }

  return (
    <ContainerComponent isScroll={true} styles={globalStyle.container}>
      <Image
        source={require('../../assets/images/auth/login-regis/logo.png')}
      />
      <SpaceComponent height={30} />
      <RowComponent>
        <TextComponent
          text={'Coody '}
          fontsize={28}
          fontFamily={fontFamilies.bold}
          color={appColor.primary}
        />
        <TextComponent
          text={'Xin Chào'}
          fontsize={28}
          fontFamily={fontFamilies.bold}
        />
      </RowComponent>
      <SpaceComponent height={10} />
      <TextComponent
        text={'Vui lòng nhập thông tin của bạn'}
        fontFamily={fontFamilies.bold}
        color={appColor.subText}
      />
      <SpaceComponent height={30} />
      <InputComponent
        label={'Họ tên'}
        placeholder={'Nhập họ tên'}
        value={name}
        onChangeText={text => setName(text)}
        error={name ? null : 'Thiếu thông tin!'}
      />
      <SpaceComponent height={30} />
      <InputComponent
        label={'Email'}
        placeholder={'Nhập email'}
        value={email}
        onChangeText={text => setEmail(text)}
        error={email ? checkEmail(email) : 'Thiếu thông tin!'}
      />
      <SpaceComponent height={20} />
      <InputComponent
        label={'Số điện thoại'}
        placeholder={'Nhập số điện thoại'}
        value={phone}
        onChangeText={text => setPhone(text)}
        error={phone ? checkPhone(phone) : 'Thiếu thông tin!'}
      />
      <SpaceComponent height={20} />
      <InputComponent
        label={'Mật khẩu'}
        placeholder={'Nhập mật khẩu'}
        value={password}
        onChangeText={text => setPassword(text)}
        error={password ? checkpass(password) : 'Thiếu thông tin!'}
        isPassword
      />
      <SpaceComponent height={20} />
      <InputComponent
        label={'Xác nhận mật khẩu'}
        placeholder={'Nhập lại mật khẩu'}
        value={rePassword}
        onChangeText={text => setRePassword(text)}
        error={
          password ? checkrepass(password, rePassword) : 'Thiếu thông tin!'
        }
        isPassword
        isRePassword
      />
      <SpaceComponent height={20} />
      <InputComponent
        label={'Địa chỉ'}
        placeholder={'Nhập địa chỉ'}
        value={address}
        onChangeText={updateSearch}
      />
      {
        isShowAddress &&
        <FlatList
          scrollEnabled={false}
          data={description}
          renderItem={renderItem}
        // style={{ maxHeight: 200 }}
        />
      }
      <SpaceComponent height={20} />
      {category && <MultiSelect
        style={styles.dropdown}
        placeholderStyle={styles.placeholder}
        selectedTextStyle={styles.selectedTextStyle}
        iconStyle={{ tintColor: 'black' }}
        data={category}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={'Chọn loại cửa hàng'}
        value={value}
        onChange={item => {
          setValue(item);
        }}
        renderSelectedItem={(item, unSelect) => (
          <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
            <View style={styles.selectedStyle}>
              <TextComponent styles={styles.textSelectedStyle} text={item.label} fontsize={14} />
              <Trash color="black" size={17} />
            </View>
          </TouchableOpacity>
        )}
      />}
      <SpaceComponent height={30} />
      <ButtonComponent
        text={'Tạo tài khoản'}
        color={appColor.white}
        onPress={correct ? handleRegister : null}
        styles={{ opacity: correct ? 1 : 0.5 }}
      />
      <SpaceComponent height={20} />
      <ButtonComponent
        text={'Trở về đăng nhập'}
        color={appColor.primary}
        backgroundColor={appColor.white}
        onPress={() => navigation.navigate('Login')}
      />
      <SpaceComponent height={70} />
      <LoadingModal visible={isLoading} />
    </ContainerComponent>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  textSelectedStyle: {
    marginRight: 5,
  },
  selectedStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: 'white',
    shadowColor: '#000',
    marginTop: 8,
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
  dropdown: {
    backgroundColor: appColor.white,
    padding: 13,
    width: '100%',
    borderRadius: 10,
    height: 60,
    borderColor: appColor.subText,
    borderWidth: 1,
  },
  placeholder: {
    fontFamily: fontFamilies.bold,
    color: appColor.text,
  },
  selectedTextStyle: {
    color: appColor.white,
    fontFamily: fontFamilies.bold,
  },
  a: {
    paddingBottom: 50,
  },
});

var DATA = [
  {
    label: 'Cửa hàng thời trang',
    value: '1'
  },
  {
    label: 'Cửa hàng thực phẩm',
    value: '2'
  },
  {
    label: 'Cửa hàng điện thoại',
    value: '3'
  }
]
