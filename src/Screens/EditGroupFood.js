import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import HeaderComponent from '../components/HeaderComponent';
import {appColor} from '../constants/appColor';
import ButtonComponent from '../components/ButtonComponent';
import SelectImage from './ShopOwner/ComposenentShopOwner/SelectImage';
import TextComponent from '../components/TextComponent';
import InputFood1 from './ShopOwner/ComposenentShopOwner/InputFood1';

const EditGroupFood = ({route}) => {
  const {item} = route.params || {};
  const [name, setName] = useState(null);
  const [image, setImage] = useState(null);
  const [imagePath, setImagePath] = useState(null);
  const [IsSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    if (item) {
      setName(item.name);
      setImage(item.image);
    }
    console.log(item)
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
      <HeaderComponent
        text={item ? 'Sửa nhóm món ăn' : 'Thêm nhóm món ăn'}
        isback={true}
      />
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
                source={require('../assets/images/shopowner/upload.png')}
              />
              <TextComponent
                text={'Tải ảnh'}
                styles={{opacity: 0.5, marginTop: '5%'}}
              />
            </>
          )}
        </TouchableOpacity>
        <InputFood1
          title={'Tên nhóm'}
          value={name}
          onChangeText={text => setName(text)}
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

export default EditGroupFood;
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
  bottom: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 20,
  },
});
