import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import HeaderComponent from '../../components/HeaderComponent';
import {appColor} from '../../constants/appColor';

import InputFood1 from './ComposenentShopOwner/InputFood1';
import TextComponent from '../../components/TextComponent';
import InputFood2 from './ComposenentShopOwner/InputFood2';
import ButtonComponent from '../../components/ButtonComponent';
import SelectImage from './ComposenentShopOwner/SelectImage';
import {useDispatch, useSelector} from 'react-redux';
import {
  AddProduct,
  GetProduct,
  UpdateProduct,
} from '../../Redux/Reducers/ShopOwnerReducer';
import {useNavigation} from '@react-navigation/native';

const EditFood = ({route}) => {
  const navigation = useNavigation();
  const {updateStatus, productStatus, AddProductStatus, ProductCategoriesData} =
    useSelector(state => state.shopowner); //data&status getshipper
  const {user} = useSelector(state => state.login); //thông tin khi đăng nhập
  const {item} = route.params || {}; // Sử dụng || để đảm bảo item không phải là null
  const [name, setName] = useState(item?.name ?? null);
  const [price, setPrice] = useState(item?.price.toString() ?? null);
  const [image, setImage] = useState(item?.images[0] ?? null);
  const [imagePath, setImagePath] = useState(null);
  const [category, setCategory] = useState(
    item?.categories[0] ?? ProductCategoriesData[0],
  ); //nhóm
  const [status, setStatus] = useState(state[0].value);
  const [IsSheetOpen, setIsSheetOpen] = useState(false);
  const [click, setclick] = useState(false);
  const [correct, setCorrect] = useState(item ? true : false);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(JSON.stringify(category, null, 2));
  }, [category]);

  //lấy ảnh sau nhận ảnh bên SelectImage
  useEffect(() => {
    if (imagePath) {
      setImage(imagePath.uri);
    }
  }, [imagePath]);

  const update = () => {
    setclick(true);
    const body = {
      name: name,
      price: price,
      //status: status,
      //image: await uploadImageToCloudinary(imagePath),
    };
    dispatch(UpdateProduct({id: item._id, data: body}));
  };

  const add = () => {
    setclick(true);
    const body = {
      name: name,
      price: price,
      images: [image],
      categories: [category._id],
      description: 'Mô tả sản phẩm',
      shopOwner: user._id,
    };
    console.log(body);
    dispatch(AddProduct({data: body}));
  };
  //khi cap nhat or add thanh cong
  useEffect(() => {
    if (updateStatus == 'succeeded' || AddProductStatus == 'succeeded') {
      dispatch(GetProduct(user._id));
    }
  }, [updateStatus, AddProductStatus]);

  //khi goi lai danh sach san pham thanh cong
  useEffect(() => {
    if (productStatus == 'succeeded' && click) {
      navigation.goBack();
      setclick(false);
      ToastAndroid.show('Thành công', ToastAndroid.SHORT);
    }
  }, [productStatus]);

  //kiem tra da dien day du thong tin chua
  useEffect(() => {
    name && price ? setCorrect(true) : setCorrect(false);
  }, [name, price]);

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
          data={item ? item.categories : ProductCategoriesData}
          value={item ? category.categoryProduct_name : category.name}
          labelField={item ? 'categoryProduct_name' : 'name'}
          onChange={item => {
            setCategory(item);
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
              styles={{opacity: correct ? 1 : 0.5}}
              onPress={() => {
                correct ? update() : null;
              }}
            />
          </>
        ) : (
          <ButtonComponent
            text={'Yêu cầu thêm'}
            color={appColor.white}
            styles={{opacity: correct ? 1 : 0.5}}
            onPress={() => {
              correct ? add() : null;
            }}
          />
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
