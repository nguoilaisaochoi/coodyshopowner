import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import HeaderComponent from '../components/HeaderComponent';
import {appColor} from '../constants/appColor';
import ButtonComponent from '../components/ButtonComponent';
import SelectImage from './ShopOwner/ComposenentShopOwner/SelectImage';
import TextComponent from '../components/TextComponent';
import InputFood1 from './ShopOwner/ComposenentShopOwner/InputFood1';
import {useDispatch, useSelector} from 'react-redux';
import {
  AddProductCate,
  DeleteProductCate,
  GetProductCategories,
  UpdateProductCate,
  UpdateShopCategory,
} from '../Redux/Reducers/ShopOwnerReducer';
import ModalComponent from './ShopOwner/ComposenentShopOwner/ModalComponent';

const EditGroupFood = ({route, navigation}) => {
  const {user} = useSelector(state => state.login); //thông tin khi đăng nhập
  const {
    AddProductCateStatus,
    DeleteProductCateStatus,
    ProductCategoriesStatus,
    UpdateProductCateStatus,
  } = useSelector(state => state.shopowner); //data&status getshipper
  const {item} = route.params || {};
  const [name, setName] = useState(item?.name ?? null);
  const [imagePath, setImagePath] = useState(null);
  const [IsSheetOpen, setIsSheetOpen] = useState(false);
  const [click, setclick] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); //modal huỷ
  const dispatch = useDispatch();

  //them nhom
  const add = () => {
    setclick(true);
    const body = {
      name: name,
      shopOwner: user._id,
    };
    dispatch(AddProductCate({data: body}));
  };

  //xoa
  const delgroup = () => {
    setclick(true);
    dispatch(DeleteProductCate(item._id));
  };
  //update
  const update = () => {
    setclick(true);
    dispatch(UpdateProductCate({id: item._id, data: {name: name}}));
  };
  //neu thanh cong goi lai api lay nhom mon an
  useEffect(() => {
    if (
      AddProductCateStatus == 'succeeded' ||
      DeleteProductCateStatus == 'succeeded' ||
      UpdateProductCateStatus == 'succeeded'
    ) {
      dispatch(GetProductCategories(user._id));
    }
  }, [AddProductCateStatus, DeleteProductCateStatus, UpdateProductCateStatus]);

  //cap nhat lai nhom mon
  useEffect(() => {
    if (ProductCategoriesStatus == 'succeeded' && click) {
      setclick(false);
      setModalVisible(false);
      navigation.goBack();
      ToastAndroid.show('Thành công', ToastAndroid.SHORT);
    }
  }, [ProductCategoriesStatus]);

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
              text={'Xoá nhóm món'}
              width={'45%'}
              backgroundColor={appColor.white}
              borderColor={appColor.white}
              onPress={() => {
                setModalVisible(true);
              }}
            />
            <ButtonComponent
              text={'Sửa nhóm món'}
              width={'45%'}
              color={appColor.white}
              onPress={() => {
                update();
              }}
            />
          </>
        ) : (
          <ButtonComponent
            text={'Thêm'}
            color={appColor.white}
            onPress={() => {
              add();
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
            delgroup();
          }}
          titile={'Xác nhận xoá'}
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
