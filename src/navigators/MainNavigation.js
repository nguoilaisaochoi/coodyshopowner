import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import TextComponent from '../components/TextComponent';
import {appColor} from '../constants/appColor';
import HomeScreen from '../Screens/ShopOwner/HomeScreen';
import RevenueScreen from '../Screens/ShopOwner/RevenueScreen';
import Account from '../Screens/ShopOwner/Account';
import ProfileScreen from '../Screens/ShopOwner/ProfileScreen';

import VerifyShipper from '../Screens/ShopOwner/VerifyShipper';
import ChangePassScreen from '../Screens/ShopOwner/ChangePassScreen';
import Food from '../Screens/ShopOwner/Food';
import EditFood from '../Screens/ShopOwner/EditFood';
import EditGroupFood from '../Screens/EditGroupFood';
import ShopProfileScreen from '../Screens/ShopOwner/ShopProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Tab" component={TabNavigation} />
      <Stack.Screen name="VerifyShipper" component={VerifyShipper} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="ChangePass" component={ChangePassScreen} />
      <Stack.Screen name="Food" component={Food} />
      <Stack.Screen name="EditFood" component={EditFood} />
      <Stack.Screen name="GroupFoodEdit" component={EditGroupFood} />
      <Stack.Screen name="ShopProfile" component={ShopProfileScreen} />
    </Stack.Navigator>
  );
};

const TabNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={styles.viewTabItem}>
              <Image
                source={
                  focused
                    ? require('../assets/images/tabBar/home2.png')
                    : require('../assets/images/tabBar/home.png')
                }
                style={styles.imgTab}
                resizeMode="contain"
                tintColor={focused ? appColor.primary : appColor.text}
              />
              <TextComponent
                text={'Trang chủ'}
                fontsize={10}
                color={focused ? appColor.primary : appColor.text}
                styles={{marginTop: 5}}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Revenue"
        component={RevenueScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={styles.viewTabItem}>
              <Image
                source={
                  focused
                    ? require('../assets/images/tabBar/credit2.png')
                    : require('../assets/images/tabBar/credit.png')
                }
                style={styles.imgTab}
                resizeMode="contain"
                tintColor={focused ? appColor.primary : appColor.text}
              />
              <TextComponent
                text={'Doanh thu'}
                fontsize={10}
                color={focused ? appColor.primary : appColor.text}
                styles={{marginTop: 5}}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Food"
        component={Food}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={styles.viewTabItem}>
              <Image
                source={
                  focused
                    ? require('../assets/images/tabBar/food2.png')
                    : require('../assets/images/tabBar/food.png')
                }
                style={styles.imgTab}
                resizeMode="contain"
                tintColor={focused ? appColor.primary : appColor.text}
              />
              <TextComponent
                text={'Món ăn'}
                fontsize={10}
                color={focused ? appColor.primary : appColor.text}
                styles={{marginTop: 5}}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={Account}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={styles.viewTabItem}>
              <Image
                source={
                  focused
                    ? require('../assets/images/tabBar/user2.png')
                    : require('../assets/images/tabBar/user.png')
                }
                style={styles.imgTab}
                resizeMode="contain"
                tintColor={focused ? appColor.primary : appColor.text}
              />
              <TextComponent
                text={'Tài khoản'}
                fontsize={10}
                color={focused ? appColor.primary : appColor.text}
                styles={{marginTop: 5}}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigation;

const styles = StyleSheet.create({
  containerFavor: {
    position: 'absolute',
    top: -20,
    padding: 4,
    backgroundColor: appColor.white,
    borderRadius: 70 / 2,
    borderColor: appColor.primary,
    borderWidth: 2,
  },
  imgFavor: {
    width: 25,
    height: 25,
  },
  shadow: {
    shadowColor: 'rgba(0, 0, 0, 0.9)',
    elevation: 5,
  },
  viewFavor: {
    // position: 'absolute',
    // top: -25,
    width: 55,
    height: 55,
    // padding: 5,
    backgroundColor: appColor.primary,
    borderBlockColor: appColor.text,
    borderRadius: 60 / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBar: {
    height: 60,
    backgroundColor: appColor.white,
  },
  imgTab: {
    width: 25,
    height: 25,
  },
  viewTabItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
