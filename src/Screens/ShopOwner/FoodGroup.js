import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {appColor} from '../../constants/appColor';

import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import TextComponent from '../../components/TextComponent';
import ModalComponent from './ComposenentShopOwner/ModalComponent';
import LoadingModal from '../../modal/LoadingModal';
import {
  GetProductCategories,
  RestoreProductCate,
} from '../../Redux/Reducers/ShopOwnerReducer';

const FoodGroup = () => {
  const {
    ProductCategoriesData,
    ProductCategoriesStatus,
    RestoreProductCateStatus,
  } = useSelector(state => state.shopowner);
  const {user} = useSelector(state => state.login); //thông tin khi đăng nhập
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false); //modal huỷ
  const [idGroup, setIdGroup] = useState(null); //lấy id group
  const [Group, setGroup] = useState(null); //lấy id group
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (ProductCategoriesStatus == 'succeeded') {
      setGroup(ProductCategoriesData);
      setModalVisible(false);
      setIsLoading(false);
    }
  }, [ProductCategoriesStatus]);

  //khoi phuc mon
  const restore = () => {
    setIsLoading(true);
    dispatch(RestoreProductCate({id: idGroup}));
  };

  //kiem tra khoi phuc
  useEffect(() => {
    if (RestoreProductCateStatus == 'succeeded' && isLoading) {
      dispatch(GetProductCategories(user._id));
    }
  }, [RestoreProductCateStatus]);
  
  //kiem tra truoc khi chuyen navigate
  const gotonavigate = item => {
    if (item.isDeleted) {
      setModalVisible(true);
      setIdGroup(item._id);
    } else {
      navigation.navigate('GroupFoodEdit', {item: item});
    }
  };

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={[styles.item, {opacity: item.isDeleted ? 0.7 : 1}]}
        activeOpacity={0.8}
        onPress={() => {
          gotonavigate(item);
        }}>
        <TextComponent text={item.name} />
        {!item.isDeleted && (
          <Image
            style={styles.img}
            source={require('../../assets/images/shopowner/edit.png')}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={Group}
        renderItem={renderItem}
        keyExtractor={item => item._id}
      />
      <TouchableOpacity
        style={styles.imgadd}
        activeOpacity={0.7}
        onPress={() => {
          navigation.navigate('GroupFoodEdit');
        }}>
        <Image
          style={{width: '100%', resizeMode: 'contain'}}
          source={require('../../assets/images/shopowner/add.png')}
        />
      </TouchableOpacity>
      {modalVisible && (
        <ModalComponent
          setModalVisible={setModalVisible}
          Presscancel={() => setModalVisible(false)}
          Pressok={() => {
            restore();
          }}
          titile={'Xác nhận khôi phục'}
        />
      )}
      <LoadingModal visible={isLoading} />
    </View>
  );
};

export default FoodGroup;

const styles = StyleSheet.create({
  container: {
    backgroundColor: appColor.white,
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: '10%',
  },
  item: {
    width: '80%',
    alignSelf: 'center',
    backgroundColor: appColor.white,
    padding: '3%',
    marginBottom: '3%',
    borderRadius: 10,
    elevation: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '2%',
  },
  img: {
    width: '8%',
    aspectRatio: 1,
  },
  imgadd: {
    width: '14%',
    aspectRatio: 1,
    resizeMode: 'contain',
    position: 'absolute',
    right: 15,
    bottom: 40,
  },
});
const data = [
  {
    _id: {
      $oid: '67133a514c1d270a206d5271',
    },
    name: 'Hambergur',
    created_at: {
      $date: '2024-10-19T04:49:21.614Z',
    },
    updated_at: {
      $date: '2024-10-19T04:49:21.614Z',
    },
    __v: 0,
    image: 'https://cdn-icons-png.flaticon.com/128/3075/3075977.png',
  },
  {
    _id: {
      $oid: '67133aae4c1d270a206d5273',
    },
    name: 'Pizza',
    created_at: {
      $date: '2024-10-19T04:50:54.781Z',
    },
    updated_at: {
      $date: '2024-10-19T04:50:54.781Z',
    },
    __v: 0,
    image: 'https://cdn-icons-png.flaticon.com/128/1404/1404945.png',
  },
];
