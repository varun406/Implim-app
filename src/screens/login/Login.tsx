import {
  Alert,
  Button,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useAppDispatch} from '../../redux/store';
import {setUserLogin} from '../../redux/user/userSlice';
import {NativeModules} from 'react-native';

const {GoogleCredentialModule} = NativeModules;

const Login = () => {
  const dispatch = useAppDispatch();
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
    isLoggedInWithGoogleCredential: false,
  });

  const invokeGoogleCredential = async () => {
    try {
      const credentials = await GoogleCredentialModule.getCredentials();
      setLoginData(prev => ({
        ...prev,
        isLoggedInWithGoogleCredential: true,
        ...credentials,
      }));
    } catch (error) {
      console.error('Failed to get credentials:', error);
      return null;
    }
  };

  console.log('>>', loginData);

  const handleChange = (name: string, value: string) => {
    setLoginData({...loginData, [name]: value});
  };

  // const createPasskey = async () => {
  //   function generateChallenge() {
  //     const array = new Uint8Array(32); // 32-byte random challenge
  //     crypto.getRandomValues(array); // Fill array with cryptographically secure random values
  //     return btoa(String.fromCharCode(...array)) // Convert to Base64
  //       .replace(/\+/g, '-') // Convert to Base64URL (replace + with -)
  //       .replace(/\//g, '_') // Convert / to _
  //       .replace(/=+$/, ''); // Remove padding '='
  //   }

  //   try {
  //     const requestJson = {
  //       challenge: generateChallenge(), // Base64URL-encoded challenge
  //       timeout: 60000, // Reasonable timeout (60 sec)
  //       rpId: 'openspaceservices.com', // Ensure this matches your relying party ID
  //       allowCredentials: [], // Allow all credentials
  //       userVerification: 'preferred', // Allow "preferred" instead of "required"
  //     };

  //     console.log(requestJson); // Example output

  //     console.log("???",await GoogleCredentialModule.createPasskey(requestJson, true));
  //   } catch (error) {
  //     console.log
  //   }

  // };

  // createPasskey();

  const login = async () => {
    if (!loginData.username && !loginData.password) {
      Alert.alert('Please enter a username and password');
      return null;
    }

    try {
      dispatch(setUserLogin(true));

      // if (!loginData.isLoggedInWithGoogleCredential) {
      //   await GoogleCredentialModule.setPassword(
      //     loginData.username,
      //     loginData.password,
      //   );
      // }
    } catch (error) {
      console.error('Failed to get credentials:', error);
      return null;
    }
  };

  return (
    <ScrollView style={{flexGrow: 1}} contentContainerStyle={{flex: 1}}>
      <View style={styles.container}>
        <TextInput
          placeholder="Username"
          style={styles.input}
          onFocus={invokeGoogleCredential}
          onChangeText={text => {
            handleChange('username', text);
          }}
          value={loginData.username}
        />
        <TextInput
          placeholder="Password"
          style={styles.input}
          onFocus={invokeGoogleCredential}
          onChangeText={text => {
            handleChange('password', text);
          }}
          value={loginData.password}
        />

        <Button title="Login" onPress={login} />
      </View>
    </ScrollView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    rowGap: 20,
    padding: 10,
  },
  input: {
    borderBottomWidth: 1,
  },
});
