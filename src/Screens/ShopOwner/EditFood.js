import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import HeaderComponent from '../../components/HeaderComponent';
import {appColor} from '../../constants/appColor';

import InputFood1 from './ComposenentShopOwner/InputFood1';
import TextComponent from '../../components/TextComponent';
import InputFood2 from './ComposenentShopOwner/InputFood2';
import ButtonComponent from '../../components/ButtonComponent';
import SelectImage from './ComposenentShopOwner/SelectImage';

const EditFood = ({route}) => {
  const {item} = route.params || {}; // Sử dụng || để đảm bảo item không phải là null
  const [name, setName] = useState(null);
  const [price, setPrice] = useState(null);
  const [image, setImage] = useState(null);
  const [imagePath, setImagePath] = useState(null);
  const [category, setCategory] = useState(group[0].value); //nhóm
  const [status, setStatus] = useState(state[0].value);
  const [IsSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    if (item) {
      setName(item.name);
      setPrice(item.price.toString());
      setImage(item.images[0]);
      console.log(item.images[0]);
    }
  }, []);

  //lấy ảnh sau nhận ảnh bên SelectImage
  useEffect(() => {
    if (imagePath) {
      setImage(imagePath.uri);
    }
  }, [imagePath]);

  return (
    <View style={styles.container}>
      {/*header */}
      <HeaderComponent text={item ? 'Sửa món' : 'Thêm món'} isback={true} />
      {/*body */}
      <View style={styles.body}>
        <TouchableOpacity
          style={styles.boximg}
          activeOpacity={0.9}
          onPress={() => {
            setIsSheetOpen(true);
          }}>
          {image ? (
            <Image
              style={{width: '100%', height: '100%'}}
              source={{
                uri: image,
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
        <InputFood1
          title={'Tên món'}
          value={name}
          onChangeText={text => setName(text)}
        />
        <InputFood1
          title={'Giá bán'}
          value={price}
          onChangeText={text => setPrice(text)}
        />
        <InputFood2
          text={'Nhóm'}
          data={group}
          value={group}
          onChange={item => {
            setCategory(item.value);
          }}
        />
        <InputFood2
          text={'trạng thái'}
          data={state}
          value={status}
          onChange={item => {
            setStatus(item.value);
          }}
        />
      </View>

      {/*bottom*/}
      {/*hiện yêu cầu thêm nếu khôg có item, có thì là xoá&sửa */}
      <View style={styles.bottom}>
        {item ? (
          <>
            <ButtonComponent
              text={'Xoá món'}
              width={'45%'}
              backgroundColor={appColor.white}
              borderColor={appColor.white}
            />
            <ButtonComponent
              text={'Sửa món'}
              width={'45%'}
              color={appColor.white}
            />
          </>
        ) : (
          <ButtonComponent text={'Yêu cầu thêm'} color={appColor.white} />
        )}
      </View>
      {IsSheetOpen && (
        <SelectImage
          setImagePath={setImagePath}
          setIsSheetOpen={setIsSheetOpen}
        />
      )}
    </View>
  );
};

export default EditFood;
const styles = StyleSheet.create({
  container: {
    backgroundColor: appColor.white,
    flex: 1,
    padding: '5%',
    paddingTop: '12%',
  },
  body: {
    alignItems: 'center',
    flex: 4,
  },
  boximg: {
    marginTop: '2%',
    width: '41%',
    aspectRatio: 1,
    overflow: 'hidden',
    borderRadius: 10,
    backgroundColor: appColor.white,
    borderWidth: 1,
    borderColor: appColor.lightgray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infofood: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 40,
    marginTop: '5%',
  },
  input: {
    borderWidth: 1,
    width: '60%',
    borderRadius: 10,
    borderColor: appColor.lightgray,
    paddingLeft: '3%',
  },
  dropdown: {
    marginTop: '5%',
    backgroundColor: appColor.white,
    borderWidth: 1,
    padding: 13,
    width: '100%',
    borderRadius: 10,
    borderColor: appColor.lightgray,
  },
  bottom: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 20,
  },
});
//data cho dropdown
const group = [
  {label: 'Bánh nướng', value: '1'},
  {label: 'Bánh nướng2', value: '2'},
  {label: 'Bánh nướng3', value: '3'},
];
const state = [
  {label: 'Đang bán', value: '1'},
  {label: 'Hết món', value: '2'},
];
