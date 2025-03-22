import {Button, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {useAppDispatch} from '../../redux/store';
import {setUserLogin} from '../../redux/user/userSlice';
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import Config from 'react-native-config';

const Login = () => {
  const dispatch = useAppDispatch();
  console.log('>>', Config);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '855508307114-nmdbtqdlk60o0uclkpcv2f4hn92phjrb.apps.googleusercontent.com', // client ID of type WEB for your server. Required to get the `idToken` on the user object, and for offline access.
    });
  }, []);

  const login = () => {
    dispatch(setUserLogin(true));
  };

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        console.log(response.data);
        // dispatch(setUserLogin(true));
      } else {
        // sign in was cancelled by user
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            // operation (eg. sign in) already in progress
            console.log('IN_PROGRESS', error.message);
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // Android only, play services not available or outdated
            console.log('PLAY_SERVICES_NOT_AVAILABLE', error.message);
            break;
          default:
            // some other error happened
            console.log('OTHER', error.message);
        }
      } else {
        // an error that's not related to google sign in occurred
        console.log('error', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Login" onPress={login} />
      <Button title="Login with google" onPress={signIn} />
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: 15,
  },
});
