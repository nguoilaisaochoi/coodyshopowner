import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Alert,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {appColor} from '../../constants/appColor';
import TextComponent from '../../components/TextComponent';
import {fontFamilies} from '../../constants/fontFamilies';
import {formatCurrency} from '../../utils/Validators';
import ButtonComponent from '../../components/ButtonComponent';
import {connectSocket, disconnectSocket, getSocket} from '../../socket/socket';
import {useDispatch, useSelector} from 'react-redux';
import {
  GetOfflince,
  GetProduct,
  GetProductCategories,
  GetShop,
} from '../../Redux/Reducers/ShopOwnerReducer';

const HomeScreen = () => {
  const [Order, setOrder] = useState([]); //set,read api data đơn hàng
  const {user} = useSelector(state => state.login); //thông tin khi đăng nhập
  const {getData} = useSelector(state => state.shopowner);
  const [modalVisible, setModalVisible] = useState(false); //modal huỷ
  //const IDshopowner = useState('671346345647791835ac3a3b');
  const [confirmedOrders, setConfirmedOrders] = useState({});
  const [orderIdToCancel, setOrderIdToCancel] = useState(null);
  const [reason, setReason] = useState(null); //lưu lí do huỷ đơn
  const dispatch = useDispatch();
  //
  useEffect(() => {
    connectSocket();
    callAPI();
    const socketInstance = getSocket();
    socketInstance.emit('join_room', user._id);
    const handleNewOrder = dataGot => {
      const newOrder = dataGot.order;
      setOrder(oldOrders => [...oldOrders, newOrder]);
    };
    const handlecancelOrder = data => {
      setOrder(prevOrders =>
        prevOrders.filter(order => order._id !== data.orderId),
      );
      ToastAndroid.show(
        'Đơn ' + data.orderId.slice(-3) + ' đã bị huỷ',
        ToastAndroid.LONG,
      );
      setReason(null);
    };
    //nhận đơn
    socketInstance.on('new_order_created', handleNewOrder);
    //huỷ đơn
    socketInstance.on('order_cancelled', handlecancelOrder);
    //xoá danh sách khi tài đế đẫ lấy món
    socketInstance.on('order_status_updated', data => {
      if (data.status == 'Đang giao hàng') {
        setOrder(prevOrders =>
          prevOrders.filter(order => order._id !== data.orderId),
        );
      }
    });

    return () => {
      disconnectSocket();
      dispatch(GetOfflince(user._id));
    };
  }, []);
  //
  const callAPI = () => {
    dispatch(GetShop(user._id));
    dispatch(GetProduct(user._id));
    dispatch(GetProductCategories(user._id));
  };
  //log
  const confirmOrder = orderId => {
    const socketInstance = getSocket();
    if (getData.status != 'Mở cửa') {
      ToastAndroid.show('Không thể nhận đơn khi đóng cửa', ToastAndroid.SHORT);
    } else {
      socketInstance.emit('confirm_order', orderId);
    }
  };
  const cancelOrder = orderId => {
    const socketInstance = getSocket();
    socketInstance.emit('cancel_order', orderId, reason);
    setOrder(prevOrders => prevOrders.filter(order => order._id !== orderId));
    setOrderIdToCancel(null);
  };
  //danh sách các sản phẩm chi tiết (số lượng thông tin sản phẩm của đơn)
  const renderItemdetail = ({item}) => {
    const {name, images, price, quantity, note} = item;
    return (
      <View style={styles.itemlist}>
        <View style={styles.itemcount}>
          <TextComponent
            text={quantity + ' X'}
            fontsize={22}
            fontFamily={fontFamilies.bold}
          />
        </View>
        <View style={styles.itemdetail}>
          <View style={styles.boximg}>
            <Image
              style={{width: 65, height: 65}}
              source={{
                uri: images[0],
              }}
            />
          </View>
          <View style={styles.itemtextdetail}>
            <TextComponent text={name} fontFamily={fontFamilies.semiBold} />
            <TextComponent
              text={formatCurrency(price)}
              fontFamily={fontFamilies.bold}
            />
            {note.length >= 1 && (
              <TextComponent
                text={note}
                fontFamily={fontFamilies.medium}
                color={appColor.subText}
                fontsize={13}
              />
            )}
          </View>
        </View>
      </View>
    );
  };
  //list đơn hàng
  const renderItem = ({item}) => {
    const {_id, items, totalPrice, voucher, shippingfee} = item;
    //gán giá trị cho biến isConfirmed dựa trên
    //key _id có tồn tại trong đối tượng confirmedOrders hay không.
    const isConfirmed = confirmedOrders[_id];

    return (
      <View style={styles.content}>
        <View style={[{backgroundColor: appColor.primary}, styles.iditem]}>
          <TextComponent
            text={'Đơn: ' + item._id.slice(-3)}
            fontsize={12}
            color={appColor.white}
            fontFamily={fontFamilies.semiBold}
          />
        </View>
        <View style={styles.itemheader}>
          {!isConfirmed && ( // Chỉ hiển thị nút nếu chưa được xác nhận
            <>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[{backgroundColor: appColor.white}, styles.iditem]}
                onPress={() => {
                  setModalVisible(true);
                  setOrderIdToCancel(_id);
                }}>
                <TextComponent
                  text={'Huỷ đơn'}
                  fontsize={12}
                  color={appColor.subText}
                  fontFamily={fontFamilies.semiBold}
                />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.6}
                style={[{backgroundColor: appColor.primary}, styles.iditem]}
                onPress={() => {
                  confirmOrder(_id);
                  getData.status == 'Mở cửa'
                    ? setConfirmedOrders({...confirmedOrders, [_id]: true})
                    : null;
                }}>
                <TextComponent
                  text={'Xác nhận'}
                  fontsize={12}
                  color={appColor.white}
                  fontFamily={fontFamilies.semiBold}
                  styles={{textAlign: 'center'}}
                />
              </TouchableOpacity>
            </>
          )}
        </View>
        {/**/}
        <FlatList
          data={items}
          renderItem={renderItemdetail}
          keyExtractor={items => items._id}
        />
        {/**/}
        <View style={styles.itembottom}>
          <View style={{flexDirection: 'row'}}>
            <TextComponent
              text={'Tổng tiền: '}
              fontFamily={fontFamilies.bold}
            />
            <TextComponent
              text={formatCurrency(totalPrice - shippingfee)}
              fontFamily={fontFamilies.bold}
              color={appColor.primary}
            />
            {voucher && (
              <TextComponent
                text={` (Đã giảm: ${formatCurrency(voucher.discountAmount)})`}
                color={appColor.text}
                fontFamily={fontFamilies.bold}
              />
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextComponent
          text={'Danh Sách Đơn Hàng Đang Chờ Món'}
          color={appColor.white}
          fontFamily={fontFamilies.bold}
          fontsize={20}
        />
      </View>
      <View style={styles.body}>
        {Order.length == 0 ? (
          <View style={styles.conentnull}>
            <Image
              style={styles.img}
              source={require('../../assets/images/shopowner/shop.png')}
            />
            <TextComponent
              text={
                getData.status == 'Mở cửa'
                  ? 'Bạn chưa có đơn hàng nào'
                  : 'Bạn đang đóng cửa'
              }
              color={appColor.text}
              fontFamily={fontFamilies.bold}
              fontsize={20}
            />
          </View>
        ) : (
          <View>
            {/*flatlist */}
            <FlatList
              data={Order}
              renderItem={renderItem}
              keyExtractor={item => item._id}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalview}>
            <View style={styles.modalcontent}>
              <TextComponent
                text={'Lý do hủy đơn'}
                fontFamily={fontFamilies.bold}
                fontsize={25}
              />
              <TextInput
                style={styles.input}
                value={reason}
                onChangeText={text => setReason(text)}
              />
              <View style={styles.viewbutton}>
                <ButtonComponent
                  text={'Đóng'}
                  width={'40%'}
                  color={appColor.text}
                  backgroundColor={appColor.white}
                  borderColor={appColor.white}
                  textStyle={{fontFamily: fontFamilies.bold}}
                  onPress={() => setModalVisible(false)}
                />
                <ButtonComponent
                  text={'Xác nhận huỷ'}
                  width={'40%'}
                  color={appColor.white}
                  fontsize={15}
                  textStyle={{fontFamily: fontFamilies.bold}}
                  onPress={() => {
                    setModalVisible(false), cancelOrder(orderIdToCancel);
                  }}
                />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

export default HomeScreen;
const styles = StyleSheet.create({
  container: {
    backgroundColor: appColor.white,
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: '10%',
  },
  header: {
    flex: 0.1,
    backgroundColor: appColor.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
  },
  body: {
    flex: 1,
    padding: '2%',
  },
  conentnull: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    flex: 0.15,
    aspectRatio: 1,
  },
  iditem: {
    padding: '1%',
    borderRadius: 5,
    width: 75,
    height: 39,
    flexShrink: 1,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemheader: {
    paddingTop: '3%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemlist: {
    flexDirection: 'row',
    marginTop: '5%',
    minHeight: 65,
  },
  boximg: {
    width: 65,
    height: 65,
    overflow: 'hidden',
    borderRadius: 10,
  },
  itemdetail: {
    marginLeft: '2%',
    width: '80%',
    backgroundColor: appColor.white,
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: '2%',
    borderRadius: 10,
    elevation: 5,
  },

  itemcount: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemtextdetail: {
    gap: 5,
    flex: 1,
    marginLeft: '3%',
  },
  content: {
    borderBottomWidth: 1,
    padding: '3%',
    borderColor: appColor.lightgray,
    marginBottom: '3%',
  },
  itembottom: {
    paddingTop: '2%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalview: {
    flex: 1,
    backgroundColor: 'rgba(217.81,217.81, 217.81, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalcontent: {
    width: '77%',
    minHeight: '28%',
    backgroundColor: appColor.white,
    borderRadius: 20,
    elevation: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3%',
    gap: 30,
  },
  viewbutton: {
    flexDirection: 'row',
    width: '100%',
    gap: 20,
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    width: '100%',
    borderRadius: 10,
    borderColor: appColor.lightgray,
    padding: '5%',
    color: appColor.text,
  },
});
const data = [
  {
    _id: {
      $oid: '67317460ff6bbabc5b71dabf',
    },
    items: [
      {
        _id: {
          $oid: '671351bd5647791835ac3b86',
        },
        name: 'ComBo 3 bánh Donut Xoài',
        images: [
          'https://product.hstatic.net/1000104153/product/banh_donut_xoai_9d3e624a625d471b82ee4f2d1d967440_master.jpg',
        ],
        price: 250000,
        quantity: 1,
      },
      {
        _id: {
          $oid: '671351bd5647791835ac3b88',
        },
        name: 'ComBo 3 bánh Donut Xoài',
        images: [
          'https://product.hstatic.net/1000104153/product/banh_donut_xoai_9d3e624a625d471b82ee4f2d1d967440_master.jpg',
        ],
        price: 250000,
        quantity: 1,
      },
    ],
    shippingAddress: {
      userId: {
        $oid: '67316b54ff6bbabc5b71d9ac',
      },
      recipientName: 'khach4',
      address:
        'Công Viên Phần Mềm Quang Trung, Tân Chánh Hiệp, Quận 12, Hồ Chí Minh',
      latitude: 10.853832672000067,
      longitude: 106.62833998400004,
      phone: '0123457778',
      label: 'Nhà',
      created_at: {
        $date: '2024-11-11T02:27:21.189Z',
      },
      updated_at: {
        $date: '2024-11-11T02:27:21.189Z',
      },
      _id: {
        $oid: '67316b89ff6bbabc5b71d9ca',
      },
      __v: 0,
    },
    paymentMethod: 'Tiền mặt',
    totalPrice: 250000,
    user: {
      _id: {
        $oid: '67316b54ff6bbabc5b71d9ac',
      },
      name: 'khach4',
      phone: '0123456789',
      image: '',
    },
    shopOwner: {
      _id: {
        $oid: '671346345647791835ac3a3b',
      },
      name: 'Matteo Darmian',
      address: '117 Đ. Nguyễn Văn Quá, Đông Hưng Thuận, Quận 12, Hồ Chí Minh',
      images: ['https://hylammon.com.vn/wp-content/uploads/2022/08/DONUT.jpg'],
      rating: 5,
      latitude: 10.830168564378376,
      longitude: 106.62703239080632,
    },
    shipper: {
      _id: {
        $oid: '6715ef6e76d98d22832d33a5',
      },
      name: 'Taixe88',
      phone: '0123456788',
      image: [
        'http://res.cloudinary.com/djywo5wza/image/upload/v1730858670/coodyfood/q8ag0yfymrmcvljpmhhp.jpg',
      ],
    },
    voucher: null,
    shippingfee: 15000,
    distance: 0,
    orderDate: {
      $date: '2024-11-11T03:05:04.788Z',
    },
    status: 'Đơn hàng đã được giao hoàn tất',
    updatedAt: {
      $date: '2024-11-11T03:05:04.788Z',
    },
    __v: 0,
  },

  {
    _id: {
      $oid: '67316c1eff6bbabc5b71d9eb',
    },
    items: [
      {
        _id: {
          $oid: '671351bd5647791835ac3b86',
        },
        name: 'ComBo 3 bánh Donut Xoài',
        images: [
          'https://product.hstatic.net/1000104153/product/banh_donut_xoai_9d3e624a625d471b82ee4f2d1d967440_master.jpg',
        ],
        price: 260000,
        quantity: 3,
      },
      {
        _id: {
          $oid: '671351bd5647791835ac3b87',
        },
        name: 'ComBo 3 bánh Donut Xoài',
        images: [
          'https://product.hstatic.net/1000104153/product/banh_donut_xoai_9d3e624a625d471b82ee4f2d1d967440_master.jpg',
        ],
        price: 260000,
        quantity: 2,
      },
      {
        _id: {
          $oid: '671351bd5647791835ac3b88',
        },
        name: 'ComBo 3 bánh Donut Xoài',
        images: [
          'https://product.hstatic.net/1000104153/product/banh_donut_xoai_9d3e624a625d471b82ee4f2d1d967440_master.jpg',
        ],
        price: 260000,
        quantity: 4,
      },
    ],
    shippingAddress: {
      userId: {
        $oid: '67316b54ff6bbabc5b71d9ac',
      },
      recipientName: 'khach4',
      address:
        'Công Viên Phần Mềm Quang Trung, Tân Chánh Hiệp, Quận 12, Hồ Chí Minh',
      latitude: 10.853832672000067,
      longitude: 106.62833998400004,
      phone: '0123457778',
      label: 'Nhà',
      created_at: {
        $date: '2024-11-11T02:27:21.189Z',
      },
      updated_at: {
        $date: '2024-11-11T02:27:21.189Z',
      },
      _id: {
        $oid: '67316b89ff6bbabc5b71d9ca',
      },
      __v: 0,
    },
    paymentMethod: 'Tiền mặt',
    totalPrice: 260000,
    user: {
      _id: {
        $oid: '67316b54ff6bbabc5b71d9ac',
      },
      name: 'khach4',
      phone: '0123456789',
      image: '',
    },
    shopOwner: {
      _id: {
        $oid: '671346345647791835ac3a3b',
      },
      name: 'Matteo Darmian',
      address:
        '117 Đ. Nguyễn Văn Quá, Đông Hưng Thuận, Quận 12, Hồ Chí Minh, Việt Nam',
      images: ['https://hylammon.com.vn/wp-content/uploads/2022/08/DONUT.jpg'],
      rating: 5,
      latitude: 10.830168564378376,
      longitude: 106.62703239080632,
    },
    shipper: {
      _id: {
        $oid: '6715ef6e76d98d22832d33a5',
      },
      name: 'Taixe88',
      phone: '0123456788',
      image: [
        'http://res.cloudinary.com/djywo5wza/image/upload/v1730858670/coodyfood/q8ag0yfymrmcvljpmhhp.jpg',
      ],
    },
    voucher: null,
    shippingfee: 15000,
    distance: 0,
    orderDate: {
      $date: '2024-11-11T02:29:50.098Z',
    },
    status: 'Đơn hàng đã được giao hoàn tất',
    updatedAt: {
      $date: '2024-11-11T02:29:50.098Z',
    },
    __v: 0,
  },
];
