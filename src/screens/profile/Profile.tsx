import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Animated from 'react-native-reanimated';
import {Logo, LogoText} from '../../assets/image';

const Profile = () => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        {/* Shared transition tag for the logo */}
        <Animated.Image
          source={Logo}
          style={styles.logo}
          sharedTransitionTag="logo"
        />

        {/* Shared transition tag for the text */}
        <Animated.Image
          source={LogoText}
          style={styles.image}
          sharedTransitionTag="logoText"
        />
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 90,
    height: 71,
  },
  imageContainer: {
    overflow: 'hidden',
  },
  image: {
    width: 162,
    height: 21,
    marginTop: 20,
  },
});
