import {View, StyleSheet, ToastAndroid} from 'react-native';
import React, {useEffect, useState} from 'react';
import {appColor} from '../../constants/appColor';
import {useDispatch, useSelector} from 'react-redux';
import {
  AddProductCate,
  DeleteProductCate,
  GetProductCategories,
  UpdateProductCate,
  UpdateShopCategory,
} from '../../Redux/Reducers/ShopOwnerReducer';
import HeaderComponent from '../../components/HeaderComponent';
import ButtonComponent from '../../components/ButtonComponent';
import SelectImage from './ComposenentShopOwner/SelectImage';
import InputFood1 from './ComposenentShopOwner/InputFood1';
import ModalComponent from './ComposenentShopOwner/ModalComponent';
import LoadingModal from '../../modal/LoadingModal';

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
  const [isLoading, setIsLoading] = useState(false);
  const [correct, setCorrect] = useState(item ? true : false);
  //them nhom
  const add = () => {
    setclick(true);
    const body = {
      name: name,
      shopOwner: user._id,
    };
    dispatch(AddProductCate({data: body}));
  };

  //xoa nhom
  const delgroup = () => {
    setclick(true);
    dispatch(DeleteProductCate(item._id));
  };

  //update
  const update = () => {
    setclick(true);
    dispatch(UpdateProductCate({id: item._id, data: {name: name}}));
  };
  //check null value
  useEffect(() => {
    !name ? setCorrect(false) : setCorrect(true);
  }, [name]);
  //neu thanh cong goi lai api lay nhom mon an
  useEffect(() => {
    if (
      AddProductCateStatus == 'succeeded' ||
      UpdateProductCateStatus == 'succeeded'
    ) {
      dispatch(GetProductCategories(user._id));
    }
  }, [AddProductCateStatus, UpdateProductCateStatus]);

  //neu thanh cong goi lai api lay nhom mon an
  useEffect(() => {
    if (DeleteProductCateStatus == 'succeeded') {
      dispatch(GetProductCategories(user._id));
    }
  }, [DeleteProductCateStatus]);

  //cap nhat lai nhom mon
  useEffect(() => {
    if (ProductCategoriesStatus == 'succeeded' && click) {
      setclick(false);
      setIsLoading(false);
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
              styles={{opacity: correct ? 1 : 0.5}}
              color={appColor.white}
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
            delgroup();
            setModalVisible(false)
          }}
          titile={'Xác nhận xoá'}
        />
      )}
      <LoadingModal visible={isLoading} />
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
