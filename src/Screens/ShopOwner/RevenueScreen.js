import {View, Text, StyleSheet, Image, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import ContainerComponent from '../../components/ContainerComponent';
import {globalStyle} from '../../styles/globalStyle';
import {Dropdown} from 'react-native-element-dropdown';
import {appColor} from '../../constants/appColor';
import {fontFamilies} from '../../constants/fontFamilies';
import TextComponent from '../../components/TextComponent';
import Info4txtComponent from './ComposenentShopOwner/Info4txtComponent';
import {formatCurrency} from '../../utils/Validators';

const RevenueScreen = () => {
  const [value, setValue] = useState(date[0].value); //select dropdown
  const [Data, setData] = useState(data); //data mẫu

  const renderItem = ({item}) => {
    const {paymentMethod, gap, shippingfee, orderDate, user, shipper} = item;
    const date = new Date(orderDate);
    const timeString = date.toLocaleTimeString('vi-VN', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    });
    const dateString = date.toLocaleDateString();
    const formattedDate = `${dateString}, (${timeString}) `;
    return (
      <View style={[styles.boxed, {justifyContent: 'center', margin: '3.7%'}]}>
        <View style={{paddingLeft: '2%'}}>
          <Info4txtComponent
            text={formattedDate}
            color1={appColor.subText}
            color2={appColor.primary}
            fontsize={14}
            price={'Thành công'}
            fontFamily2={fontFamilies.semiBold}
          />
        </View>
        <Info4txtComponent
          text={' Khách hàng'}
          price={user.name}
          fontsize={20}
          fontFamily1={fontFamilies.semiBold}
          fontFamily2={fontFamilies.semiBold}
        />
        <Info4txtComponent
          text={' Tài xế'}
          price={shipper.name}
          fontsize={20}
          fontFamily1={fontFamilies.semiBold}
          fontFamily2={fontFamilies.semiBold}
        />
        <Info4txtComponent
          text={' Loại thanh toán'}
          color1={appColor.subText}
          price={paymentMethod}
          fontsize={14}
        />
        <Info4txtComponent
          text={' Khoảng cách'}
          color1={appColor.subText}
          price={gap + ' Km'}
          fontsize={14}
        />
        <Info4txtComponent
          text={' Thu nhập'}
          color1={appColor.subText}
          price={formatCurrency(shippingfee)}
          fontsize={14}
        />
      </View>
    );
  };

  return (
    <ContainerComponent styles={globalStyle.container}>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholder}
        selectedTextStyle={styles.selectedTextStyle}
        iconStyle={{tintColor: 'white'}}
        data={date}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={date[0].label}
        value={value}
        onChange={item => {
          setValue(item.value);
        }}
      />
      {/*Tổng doanh thu gồm số đơn, tổng thu nhập...*/}
      <View style={styles.revenue}>
        <View style={styles.boxed}>
          <View style={styles.wallanddate}>
            <Image
              style={[
                styles.img,
                {
                  flexShrink: value != 'day' ? 0.4 : 0.3,
                  flexGrow: value != 'day' ? 0.3 : 0.2,
                },
              ]}
              source={require('../../assets/images/shopowner/wallet.png')}
            />
            <TextComponent
              text={new Date(Data.startDate).toLocaleDateString('vi-VN')}
              fontsize={value != 'day' ? 16 : 18}
              fontFamily={fontFamilies.bold}
            />
            {value != 'day' && (
              <TextComponent
                text={'-' + new Date(Data.endDate).toLocaleDateString('vi-VN')}
                fontsize={16}
                fontFamily={fontFamilies.bold}
              />
            )}
          </View>
          <Info4txtComponent
            color1={appColor.subText}
            fontsize={14}
            text={'Số đơn:'}
            price={Data.totalOrders}
          />
          <Info4txtComponent
            color1={appColor.subText}
            fontsize={14}
            text={'Tổng thu nhập:'}
            price={formatCurrency(Data.totalRevenue)}
          />
          <Info4txtComponent
            color1={appColor.subText}
            fontsize={14}
            text={'Nhận tiền mặt:'}
            price={formatCurrency(Data.cashTotal)}
          />
          <Info4txtComponent
            color1={appColor.subText}
            fontsize={14}
            text={'Nhận vào app:'}
            price={formatCurrency(Data.appTotal)}
          />
        </View>
      </View>
      {/*Lịch sử đơn hàng-gồm 1 img+text*/}
      <View style={styles.titlehisdeli}>
        <Image
          style={styles.time}
          source={require('../../assets/images/shopowner/time.png')}
        />
        <TextComponent
          text={'Lịch sử đơn hàng'}
          fontFamily={fontFamilies.semiBold}
          fontsize={20}
        />
      </View>
      {/*danh sách đơn hàng và hiển thị thông  không có đơn hàng khi trống*/}
      {Data ? (
        <FlatList
          data={Data}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.faltlist}
        />
      ) : (
        <View style={styles.nondelivery}>
          <Image
            style={styles.delivery}
            source={require('../../assets/images/shopowner/delivery.png')}
          />
          <TextComponent
            text={'Bạn không có đơn hàng nào trong thời gian này'}
            fontsize={20}
            styles={{textAlign: 'center', width: '78%'}}
            fontFamily={fontFamilies.semiBold}
          />
        </View>
      )}
    </ContainerComponent>
  );
};

export default RevenueScreen;

const styles = StyleSheet.create({
  dropdown: {
    backgroundColor: appColor.primary,
    padding: 13,
    width: '42%',
    borderRadius: 10,
  },
  placeholder: {
    fontFamily: fontFamilies.bold,
    color: appColor.white,
  },
  selectedTextStyle: {
    color: appColor.white,
    fontFamily: fontFamilies.bold,
  },
  revenue: {
    marginTop: '4%',
    flexShrink: 1,
    minHeight: '30%',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: appColor.gray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxed: {
    width: '83%',
    height: 175,
    borderWidth: 1,
    backgroundColor: appColor.white,
    borderColor: appColor.gray,
    elevation: 8,
    borderRadius: 20,
    paddingLeft: '4%',
    paddingRight: '4%',
    alignSelf: 'center',
  },
  img: {
    resizeMode: 'contain',
    marginRight: 12,
  },
  wallanddate: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  titlehisdeli: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: '3%',
    marginBottom: '3%',
  },
  time: {
    width: 35,
    aspectRatio: 1,
  },
  nondelivery: {
    flex: 1,
    marginTop: '3%',
    alignItems: 'center',
    gap: 20,
  },
  delivery: {
    flex: 0.3,
    resizeMode: 'contain',
  },
});
//data flatlist
const data = [
  {
    _id: 1,
    status: 'Thành công',
    user: {
      _id: {
        $oid: '670bb7666b13d08dfb02aabc',
      },
      name: 'qtv',
    },
    shipper: {
      _id: {
        $oid: '670bb7666b13d08dfb02aabc',
      },
      name: 'taixe7',
    },
    paymentMethod: 'ZaloPay',
    gap: 6,
    shippingfee: 250000,
    orderDate: ' 2024-11-08T12:16:56.665+00:00',
  },
  {
    _id: 2,
    status: 'Thành công',
    user: {
      _id: {
        $oid: '670bb7666b13d08dfb02aabc',
      },
      name: 'qtv',
    },
    shipper: {
      _id: {
        $oid: '670bb7666b13d08dfb02aabc',
      },
      name: 'taixe7',
    },
    paymentMethod: 'ZaloPay',
    gap: 4,
    shippingfee: 250000,
    orderDate: ' 2024-11-08T12:16:56.665+00:00',
  },
  {
    _id: 3,
    status: 'Thành công',
    user: {
      _id: {
        $oid: '670bb7666b13d08dfb02aabc',
      },
      name: 'qtv',
    },
    shipper: {
      _id: {
        $oid: '670bb7666b13d08dfb02aabc',
      },
      name: 'taixe7',
    },
    paymentMethod: 'ZaloPay',
    gap: 3,
    shippingfee: 25000,
    orderDate: ' 2024-11-08T12:16:56.665+00:00',
  },
];
//data cho dropdown
const date = [
  {label: 'Theo ngày', value: 'day'},
  {label: 'Theo tuần', value: 'week'},
  {label: 'Theo tháng', value: 'month'},
];
