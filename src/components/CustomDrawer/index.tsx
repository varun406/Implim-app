import {Button, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useRef} from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {useAppDispatch} from '../../redux/store';
import {logout, setUserLogin} from '../../redux/user/userSlice';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

const CustomDrawer = props => {
  const dispatch = useAppDispatch();

  const handlelogout = async () => {
    await GoogleSignin.revokeAccess(); // Clear account selection cache
    await GoogleSignin.signOut(); // Sign out from Google
    dispatch(logout());
  };

  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{flex: 1, backgroundColor: 'white'}}>
        <View style={{flex: 1, padding: 20}}>
          <DrawerItemList {...props} />
        </View>
        <View style={{marginTop: 'auto'}}>
          <Button title="Logout" onPress={handlelogout} />
        </View>
      </DrawerContentScrollView>
    </View>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({});
