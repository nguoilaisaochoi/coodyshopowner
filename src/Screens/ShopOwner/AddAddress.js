import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {appColor} from '../../constants/appColor';
import HeaderComponent from '../../components/HeaderComponent';
import LineComponent from '../../components/LineComponent';
import MapAPI from '../../core/apiMap/MapAPI';

import SpaceComponent from '../../components/SpaceComponent';
import TextInputComponent from './ComposenentShopOwner/TextInputComponent';
import TextComponent from '../../components/TextComponent';

const AddAddress = ({navigation}) => {
  const [address, setAddress] = useState('');
  const [isShowAddress, setIsShowAddress] = useState(false);
  const [description, setDescription] = useState([]);

  const updateSearch = text => {
    setAddress(text);
    setIsShowAddress(true);
  };

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={{paddingTop: '5%', paddingBottom: '5%'}}
        onPress={() => handleAddressSelect(item)}>
        <TextComponent text={item.description} />
        <SpaceComponent height={10} />
        <LineComponent />
      </TouchableOpacity>
    );
  };

  const getPlacesAutocomplete = async () => {
    let autoComplete = await MapAPI.getPlacesAutocomplete({
      search: encodeURIComponent(address),
    });
    setDescription(autoComplete.predictions);
  };

  const handleAddressSelect = item => {
    setAddress(item.description);
    setIsShowAddress(false);
    navigation.navigate('ShopProfile', {description: item.description});
  };

  useEffect(() => {
    if (address.length >= 1) {
      getPlacesAutocomplete();
    } else {
      setIsShowAddress(false);
    }
  }, [address]);

  return (
    <View style={styles.container}>
      <HeaderComponent text={'Địa chỉ'} isback={true} />
      <View style={styles.body}>
        <TextInputComponent
          text={'Nhập địa chỉ'}
          value={address}
          placeholder="Tìm địa chỉ..."
          onChangeText={text => updateSearch(text)}
        />
        {isShowAddress && (
          <FlatList
            scrollEnabled={false}
            data={description}
            renderItem={renderItem}
          />
        )}
      </View>
    </View>
  );
};

export default AddAddress;

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
