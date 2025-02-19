import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {appColor} from '../../constants/appColor';

import {fontFamilies} from '../../constants/fontFamilies';
import {formatCurrency} from '../../utils/Validators';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import TextComponent from '../../components/TextComponent';
import ModalComponent from './ComposenentShopOwner/ModalComponent';
import {
  GetProduct,
  RestoreProduct,
} from '../../Redux/Reducers/ShopOwnerReducer';
import LoadingModal from '../../modal/LoadingModal';

const FoodListdel = () => {
  const {user} = useSelector(state => state.login); //thông tin khi đăng nhập
  const navigation = useNavigation();
  const {getproductData, productStatus, RestoreProductStatus} = useSelector(
    state => state.shopowner,
  );
  const dispatch = useDispatch();
  const [Food, setfood] = useState(null);
  const [modalVisible, setModalVisible] = useState(false); //modal huỷ
  const [idProduct, setIdProduct] = useState(null); //lấy id product
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  //set data khi vừa vào component
  useEffect(() => {
    if (productStatus == 'succeeded') {
      setfood(getproductData.filter(product => product.status == 'Ngừng bán'));
      setModalVisible(false);
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [productStatus]);

  //Refreshing api
  const fetchRevenue = () => {
    setRefreshing(true);
    dispatch(GetProduct(user._id));
  };

  //check co ngung ban hay chua
  const gotonavigate = item => {
    setModalVisible(true);
    setIdProduct(item._id);
  };

  //khoi phuc mon
  const restore = () => {
    setIsLoading(true);
    dispatch(RestoreProduct({id: idProduct}));
  };
  //kiem tra khoi phuc nếu khoi phuc thanh cong goi lai ds sp
  useEffect(() => {
    if (RestoreProductStatus == 'succeeded' && isLoading) {
      dispatch(GetProduct(user._id));
    }
  }, [RestoreProductStatus]);

  const renderItem = ({item}) => {
    const {name, price, images, status} = item;
    return (
      <TouchableOpacity
        style={styles.item}
        activeOpacity={0.8}
        onPress={() => {
          gotonavigate(item);
        }}>
        <View style={styles.boximg}>
          <Image
            style={{flex: 1}}
            source={{
              uri: images[0],
            }}
          />
        </View>
        <View style={styles.itemdetail}>
          <View>
            <TextComponent text={name} color={appColor.text} />
            <TextComponent
              text={formatCurrency(price)}
              color={appColor.text}
              fontfamily={fontFamilies.bold}
            />
          </View>
          <TextComponent
            text={status}
            color={status == 'Còn món' ? 'green' : 'red'}
            fontfamily={fontFamilies.bold}
            fontsize={15}
          />
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <FlatList
        data={Food}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        refreshing={refreshing}
        onRefresh={fetchRevenue}
      />
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

export default FoodListdel;
const styles = StyleSheet.create({
  container: {
    backgroundColor: appColor.white,
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: '10%',
    alignItems: 'center',
  },
  item: {
    width: '90%',
    minHeight: '13%',
    backgroundColor: appColor.white,
    elevation: 10,
    flexDirection: 'row',
    padding: '2%',
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: '3%',
    marginTop: '2%',
  },
  boximg: {
    marginTop: '2%',
    width: 80,
    height: 80,
    overflow: 'hidden',
    borderRadius: 10,
  },
  itemdetail: {
    width: '70%',
    marginLeft: '2%',
    gap: 10,
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
      $oid: '67134ef65647791835ac3b47',
    },
    name: 'Pizza Phô Mai',
    price: 250000,
    images: [
      'https://delivery.pizza4ps.com/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2Fdelivery-system-v2%2F03-04-2022-Image%2F10000005_2.jpg&w=1920&q=75',
    ],
    categories: [
      {
        categoryProduct_id: {
          $oid: '671348ee5647791835ac3a89',
        },
        categoryProduct_name: 'Pizza Nhân Phô Mai',
        _id: {
          $oid: '67134ef65647791835ac3b48',
        },
      },
      {
        categoryProduct_id: {
          $oid: '671348fd5647791835ac3a93',
        },
        categoryProduct_name: 'Pizza Nhân Hành',
        _id: {
          $oid: '67134ef65647791835ac3b49',
        },
      },
    ],
    description: 'Còn hàng',
    shopOwner: {
      shopOwner_id: {
        $oid: '671345a35647791835ac3a2d',
      },
      shopOwner_name: 'Gianluigi Donnarumma',
    },
    create_at: {
      $date: '2024-10-19T06:17:26.409Z',
    },
    update_at: {
      $date: '2024-10-19T06:17:26.409Z',
    },
    __v: 0,
  },
  {
    _id: {
      $oid: '67134f3d5647791835ac3b50',
    },
    name: 'Pizza Xúc Xích',
    price: 250000,
    images: [
      'https://delivery.pizza4ps.com/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2Fdelivery-system-v2%2F03-04-2022-Image%2F10000010_2.jpg&w=1920&q=75',
    ],
    categories: [
      {
        categoryProduct_id: {
          $oid: '671348e05647791835ac3a84',
        },
        categoryProduct_name: 'Pizza Xúc Xích',
        _id: {
          $oid: '67134f3d5647791835ac3b51',
        },
      },
      {
        categoryProduct_id: {
          $oid: '671348fd5647791835ac3a93',
        },
        categoryProduct_name: 'Pizza Nhân Hành',
        _id: {
          $oid: '67134f3d5647791835ac3b52',
        },
      },
    ],
    description: 'Còn hàng',
    shopOwner: {
      shopOwner_id: {
        $oid: '671345a35647791835ac3a2d',
      },
      shopOwner_name: 'Gianluigi Donnarumma',
    },
    create_at: {
      $date: '2024-10-19T06:18:37.509Z',
    },
    update_at: {
      $date: '2024-10-19T06:18:37.509Z',
    },
    __v: 0,
  },
  {
    _id: {
      $oid: '67134df45647791835ac3b35',
    },
    name: 'HamBurger Bò',
    price: 250000,
    images: [
      'https://mcdonalds.vn/uploads/2018/food/burgers/xcheesedlx_bb.png.pagespeed.ic.T9fdYoxRFN.webp',
    ],
    categories: [
      {
        categoryProduct_id: {
          $oid: '671348a95647791835ac3a6b',
        },
        categoryProduct_name: 'Hambergur Bò',
        _id: {
          $oid: '67134df45647791835ac3b36',
        },
      },
      {
        categoryProduct_id: {
          $oid: '6713487c5647791835ac3a57',
        },
        categoryProduct_name: 'Hambergur nhân thịt',
        _id: {
          $oid: '67134df45647791835ac3b37',
        },
      },
    ],
    description: 'Còn hàng',
    shopOwner: {
      shopOwner_id: {
        $oid: '671345a35647791835ac3a2d',
      },
      shopOwner_name: 'Gianluigi Donnarumma',
    },
    create_at: {
      $date: '2024-10-19T06:13:08.264Z',
    },
    update_at: {
      $date: '2024-10-19T06:13:08.264Z',
    },
    __v: 0,
  },
  {
    _id: {
      $oid: '67134e445647791835ac3b3e',
    },
    name: 'HamBurger Thập Cẩm',
    price: 250000,
    images: [
      'https://mcdonalds.vn/uploads/2018/food/burgers/xbigmac_bb.png.pagespeed.ic.t-4L-nzxfN.webp',
    ],
    categories: [
      {
        categoryProduct_id: {
          $oid: '671348a95647791835ac3a6b',
        },
        categoryProduct_name: 'Hambergur Bò',
        _id: {
          $oid: '67134e445647791835ac3b3f',
        },
      },
      {
        categoryProduct_id: {
          $oid: '671348865647791835ac3a5c',
        },
        categoryProduct_name: 'Hambergur Hải Sản',
        _id: {
          $oid: '67134e445647791835ac3b40',
        },
      },
    ],
    description: 'Còn hàng',
    shopOwner: {
      shopOwner_id: {
        $oid: '671345a35647791835ac3a2d',
      },
      shopOwner_name: 'Gianluigi Donnarumma',
    },
    create_at: {
      $date: '2024-10-19T06:14:28.338Z',
    },
    update_at: {
      $date: '2024-10-19T06:14:28.338Z',
    },
    __v: 0,
  },
];
