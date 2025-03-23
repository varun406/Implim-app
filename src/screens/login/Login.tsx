import {Button, Platform, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {useAppDispatch} from '../../redux/store';
import {addUsername, setUserLogin} from '../../redux/user/userSlice';
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import {AuthConfiguration, authorize} from 'react-native-app-auth';
import Config from 'react-native-config';

const Login = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: Config.GOOGLE_CLIENT_ID, // client ID of type WEB for your server. Required to get the `idToken` on the user object, and for offline access.
    });
  }, []);

  const login = () => {
    dispatch(setUserLogin(true));
  };

  const onGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        let idToken = null;
        console.log(response.data);
        // Try the new style of google-sign in result, from v13+ of that module
        idToken = response.data?.idToken;
        if (!idToken) {
          // if you are using older versions of google-signin, try old style result
          idToken = response?.idToken;
        }
        if (!idToken) {
          throw new Error('No ID token found');
        }
        dispatch(addUsername(response.data.user.name));
        dispatch(setUserLogin(true));
      } else {
        // sign in was cancelled by user
        console.log('sign in was cancelled by user', response.data);
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

  const onMicrosoftSignIn = async () => {
    const config: AuthConfiguration = {
      serviceConfiguration: {
        authorizationEndpoint: `https://login.microsoftonline.com/${Config.TENANT_ID}/oauth2/v2.0/authorize`,
        tokenEndpoint: `https://login.microsoftonline.com/${Config.TENANT_ID}/oauth2/v2.0/token`,
      },
      clientId: Config.CLIENT_ID || '',
      redirectUrl:
        Platform.OS == 'android'
          ? 'com.implim://com.implim/android/callback'
          : 'com.implim://com.implim/ios/callback',
      scopes: ['openid', 'profile', 'email', 'offline_access'],
      connectionTimeoutSeconds: 5,
    };

    console.log('>>', config);

    try {
      // Log in to get an authentication token
      const authState = await authorize(config);
      console.log('>>', authState);
    } catch (error) {
      console.log('>>>ERROR', error);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Login" onPress={login} />
      <Button title="Login with google" onPress={onGoogleSignIn} />
      <Button
        title="Login with microsoft"
        onPress={() => onMicrosoftSignIn()}
      />
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
