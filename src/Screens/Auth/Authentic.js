import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ToastAndroid,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import TextComponent from '../../components/TextComponent';
import HeaderComponent from '../../components/HeaderComponent';
import {appColor} from '../../constants/appColor';
import ButtonComponent from '../../components/ButtonComponent';
import LoadingModal from '../../modal/LoadingModal';
import AxiosInstance from '../../helpers/AxiosInstance';
import {onOpenCamera} from '../ShopOwner/ComposenentShopOwner/ImagePicker';
import {uploadImageToCloudinary} from '../ShopOwner/ComposenentShopOwner/UploadImage';

const Authentic = ({navigation, route}) => {
  const [ImagePath, setImagePath] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const {body} = route.params || {};

  const handleRegister = async () => {
    setIsLoading(true);
    const updatedBody = {
      ...body,
      imageVerified: await uploadImageToCloudinary(ImagePath),
    };
    try {
      const response = await AxiosInstance().post(
        '/users/register',
        updatedBody,
      );
      if (response.status == true) {
        ToastAndroid.show('Thành công', ToastAndroid.SHORT);
        setIsLoading(false);
        // Hiển thị alert thông báo
        Alert.alert(
          'Thông báo',
          'Thông tin của bạn đã được gửi thành công! Chúng tôi sẽ xử lý và phản hồi trong vòng 24 giờ',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Login'),
            },
          ],
          {cancelable: false}, // Không cho phép hủy bỏ alert
        );
        return response.data;
      } else {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <HeaderComponent isback={true} text={'Xác thực'} />
      <TextComponent
        text={
          'Vui lòng chụp mặt trước của căn cước công dân để hoàn tất quy trình'
        }
      />
      <TouchableOpacity
        style={styles.boximg}
        activeOpacity={0.9}
        onPress={() => {
          onOpenCamera(setImagePath);
        }}>
        {ImagePath ? (
          <Image
            style={{width: '100%', height: '100%'}}
            source={{
              uri: ImagePath.uri,
            }}
          />
        ) : (
          <>
            <Image
              style={{flex: 0.3, resizeMode: 'contain', alignSelf: 'center'}}
              source={require('../../assets/images/shopowner/upload.png')}
            />
            <TextComponent
              text={'Tải ảnh'}
              styles={{opacity: 0.5, marginTop: '5%'}}
            />
          </>
        )}
      </TouchableOpacity>
      <ButtonComponent
        text={'Gửi'}
        styles={styles.bottom}
        color={appColor.white}
        onPress={() => {
          handleRegister();
        }}
      />
      <LoadingModal visible={isLoading} />
    </View>
  );
};

export default Authentic;
const styles = StyleSheet.create({
  container: {
    backgroundColor: appColor.white,
    flex: 1,
    padding: '5%',
    paddingTop: '12%',
  },
  boximg: {
    marginTop: '2%',
    width: '100%',
    height: '25%',
    overflow: 'hidden',
    borderRadius: 10,
    backgroundColor: appColor.white,
    borderWidth: 1,
    borderColor: appColor.lightgray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottom: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
  },
});
