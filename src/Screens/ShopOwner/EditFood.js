import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import HeaderComponent from '../../components/HeaderComponent';
import {appColor} from '../../constants/appColor';
import {MultiSelect} from 'react-native-element-dropdown';
import InputFood1 from './ComposenentShopOwner/InputFood1';
import TextComponent from '../../components/TextComponent';
import InputFood2 from './ComposenentShopOwner/InputFood2';
import ButtonComponent from '../../components/ButtonComponent';
import SelectImage from './ComposenentShopOwner/SelectImage';
import {useDispatch, useSelector} from 'react-redux';
import {
  AddProduct,
  DeleteProduct,
  GetProduct,
  GetProductCategories,
  UpdateProduct,
} from '../../Redux/Reducers/ShopOwnerReducer';
import {useNavigation} from '@react-navigation/native';
import {Trash} from 'iconsax-react-native';
import ModalComponent from './ComposenentShopOwner/ModalComponent';
import {uploadImageToCloudinary} from './ComposenentShopOwner/UploadImage';
import LoadingModal from '../../modal/LoadingModal';
import {handleChangeText} from '../../utils/Validators';
import TextInputComponent from './ComposenentShopOwner/TextInputComponent';

const EditFood = ({route}) => {
  const {item} = route.params || {}; // Sử dụng || để đảm bảo item không phải là null
  const navigation = useNavigation();
  const {
    updateStatus,
    productStatus,
    AddProductStatus,
    ProductCategoriesData,
    DeleteProductStatus,
  } = useSelector(state => state.shopowner); //data&status getshipper
  const {user} = useSelector(state => state.login); //thông tin khi đăng nhập
  const [name, setName] = useState(item?.name ?? null);
  const [price, setPrice] = useState(item?.price.toString() ?? null);
  const [image, setImage] = useState(item?.images[0] ?? null);
  const [imagePath, setImagePath] = useState(null);
  const [category, setCategory] = useState(
    item?.categories[0] ?? ProductCategoriesData[0],
  ); //nhóm
  const [IsSheetOpen, setIsSheetOpen] = useState(false);
  const [click, setclick] = useState(false);
  const [correct, setCorrect] = useState(item ? true : false);
  const [description, setDescription] = useState(item?.description ?? null);
  const dispatch = useDispatch();
  const [mycategory, setMyCategory] = useState([]);
  const [modalVisible, setModalVisible] = useState(false); //modal huỷ
  const [isLoading, setIsLoading] = useState(false);

  //lọc nhóm hiện tại lấy id cho vào mycategory
  useEffect(() => {
    if (item) {
      const idcateproduct = item.categories.map(item => {
        return item.categoryProduct_id;
      });
      setMyCategory(idcateproduct);
    }
  }, [item]);

  //lấy ảnh sau nhận ảnh bên SelectImage
  useEffect(() => {
    if (imagePath) {
      setImage(imagePath.uri);
    }
  }, [imagePath]);

  //thực hiện cập nhật
  const update = async () => {
    setclick(true);
    const body = {
      name: name,
      price: price,
      category_ids: mycategory,
      description:description,
      images: await uploadImageToCloudinary(imagePath),
    };
    dispatch(UpdateProduct({id: item._id, data: body}));
  };
  //thực hiện thêm
  const add = async () => {
    setclick(true);
    const body = {
      name: name,
      price: price,
      images: await uploadImageToCloudinary(imagePath),
      categories: mycategory,
      description: description,
      shopOwner: user._id,
    };
    dispatch(AddProduct({data: body}));
  };
  //thực hiện xoá
  const del = () => {
    setclick(true);
    dispatch(DeleteProduct({id: item._id}));
  };

  //khi cap nhat or add thanh cong
  useEffect(() => {
    if (
      updateStatus == 'succeeded' ||
      DeleteProductStatus == 'succeeded' ||
      AddProductStatus == 'succeeded'
    ) {
      setModalVisible(false);
      dispatch(GetProduct(user._id));
    }
  }, [updateStatus, DeleteProductStatus, AddProductStatus]);

  //khi goi lai danh sach san pham thanh cong
  useEffect(() => {
    if (productStatus == 'succeeded' && click) {
      setIsLoading(false);
      navigation.goBack();
      setclick(false);
      ToastAndroid.show('Thành công', ToastAndroid.SHORT);
    }
  }, [productStatus]);

  //kiem tra da dien day du thong tin chua
  useEffect(() => {
    name && price && image && description && mycategory.length >= 1
      ? setCorrect(true)
      : setCorrect(false);
  }, [name, price, image, mycategory, description]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
          value={price ? handleChangeText(price) : price}
          onChangeText={text => setPrice(text)}
          keyboardType="numeric"
        />
        <InputFood1
          title={'Mô tả'}
          value={description}
          onChangeText={text => setDescription(text)}
          column={true}
        />
        <TextComponent text={'NHÓM'} styles={{width: '89%', marginTop: '5%'}} />
        <MultiSelect
          style={styles.multiinput}
          data={ProductCategoriesData}
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
              onPress={() => {
                setModalVisible(true);
              }}
            />
            <ButtonComponent
              text={'Sửa món'}
              width={'45%'}
              color={appColor.white}
              styles={{opacity: correct ? 1 : 0.5}}
              onPress={() => {
                if (correct) {
                  update();
                  setIsLoading(true);
                }
              }}
            />
          </>
        ) : (
          <ButtonComponent
            text={'Thêm'}
            color={appColor.white}
            styles={{opacity: correct ? 1 : 0.5}}
            onPress={() => {
              if (correct) {
                add();
                setIsLoading(true);
              }
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
      {modalVisible && (
        <ModalComponent
          setModalVisible={setModalVisible}
          Presscancel={() => setModalVisible(false)}
          Pressok={() => {
            del();
          }}
          titile={'Xác nhận xoá'}
        />
      )}
      <LoadingModal visible={isLoading} />
    </ScrollView>
  );
};

export default EditFood;
const styles = StyleSheet.create({
  container: {
    backgroundColor: appColor.white,
    flexGrow: 1,
    padding: '5%',
    paddingTop: '12%',
  },
  body: {
    alignItems: 'center',
    flex: 4,
    backgroundColor: appColor.white,
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
    flex: 0.4,
    alignItems: 'flex-end',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 20,
    width: '100%',
    marginTop: '3%',
    paddingBottom: '3%',
    backgroundColor: appColor.white,
  },
  multiinput: {
    width: '90%',
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
