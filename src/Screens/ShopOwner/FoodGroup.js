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
import TextComponent from './ComposenentShopOwner/TextComponent';
import {useNavigation} from '@react-navigation/native';

const FoodGroup = () => {
  const [Group, setGroup] = useState(null);

  //set data mẫu khi vừa vào component
  const navigation = useNavigation();
  useEffect(() => {
    setGroup(data);
  }, []);

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.item}
        activeOpacity={0.8}
        onPress={() => {
          navigation.navigate('GroupFoodEdit', {item: item});
        }}>
        <TextComponent text={item.name} />
        <Image
          style={styles.img}
          source={require('../../assets/images/shopowner/edit.png')}
        />
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <FlatList
        data={Group}
        renderItem={renderItem}
        keyExtractor={item => item._id.$oid}
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
    backgroundColor: appColor.note,
    padding: '3%',
    marginBottom: '3%',
    borderRadius: 10,
    elevation: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
