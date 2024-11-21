import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useEffect} from 'react';
import {appColor} from '../../constants/appColor';
import HeaderComponent from '../../components/HeaderComponent';
import {useSelector} from 'react-redux';

const ShopCategories = ({navigation}) => {
  const {GetShopCategoriesData} = useSelector(state => state.shopowner);
  const handleGoBack = datacate => {
    navigation.navigate('ShopProfile', {datacate}); // Quay lại màn hình trước
  };
  const renderItem = ({item}) => {
    const {_id, image, name} = item;
    return (
      <TouchableOpacity
        style={styles.btn}
        activeOpacity={0.5}
        onPress={() => {
          handleGoBack(item);
        }}>
        <Image
          style={{width: 50, height: 50}}
          source={{
            uri: image,
          }}
        />
        <Text>{name}</Text>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <HeaderComponent text={'Loại bán hàng'} isback={true} />
      <View style={styles.body}>
        <FlatList
          data={GetShopCategoriesData}
          renderItem={renderItem}
          keyExtractor={items => items._id}
        />
      </View>
    </View>
  );
};

export default ShopCategories;

const styles = StyleSheet.create({
  container: {
    backgroundColor: appColor.white,
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: '12%',
    paddingLeft: '5%',
    paddingRight: '5%',
  },
  body: {
    flex: 1,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 30,
    borderBottomWidth: 1,
    padding: '2%',
    borderColor: appColor.lightgray,
    marginBottom: '2%',
  },
});
