import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {StyleSheet} from 'react-native';
import ScreenName from '../constants/screenName';
import Gallery from '../screens/gallery/Gallery';
import Settings from '../screens/settings/Settings';
import BottomNavigators from './BottomNavigator';
import Profile from '../screens/profile/Profile';

const Stack = createNativeStackNavigator();

const StackNavigators = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={ScreenName.BottomTab}
        component={BottomNavigators}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={ScreenName.Gallery}
        component={Gallery}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={ScreenName.Dashboard}
        component={Profile}
        options={{headerShown: false}}
      />
      <Stack.Screen name={ScreenName.Settings} component={Settings} />
    </Stack.Navigator>
  );
};

export default StackNavigators;

const styles = StyleSheet.create({});
