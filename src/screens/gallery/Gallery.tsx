import {Dimensions, Image, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Logo, LogoText, LogoWithText} from '../../assets/image';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import screenName from '../../constants/screenName';

const SCALE_TIMING = 1500;
const TEXT_LOGO_REVEAL_TIMING = 1800;

const Gallery = ({navigation}) => {
  const scaleAnimValue = useSharedValue(80);
  const revealWidth = useSharedValue(0);

  useEffect(() => {
    scaleAnimValue.value = withTiming(0.6, {duration: SCALE_TIMING});

    revealWidth.value = withDelay(
      SCALE_TIMING,
      withTiming(221.5, {duration: TEXT_LOGO_REVEAL_TIMING}),
    );

    setTimeout(() => {
      navigation.navigate(screenName.Dashboard);
    }, SCALE_TIMING * 2 + TEXT_LOGO_REVEAL_TIMING);
  }, []);

  const animatedScaleStyles = useAnimatedStyle(() => ({
    transform: [{scale: scaleAnimValue.value}],
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    width: revealWidth.value,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Animated.Image
          source={Logo}
          style={[styles.logo, animatedScaleStyles]}
          sharedTransitionTag="logo"
        />

        <Animated.View style={[styles.imageContainer, animatedTextStyle]}>
          <Image source={LogoText} style={styles.image} resizeMode="contain" />
        </Animated.View>
      </View>
    </View>
  );
};

export default Gallery;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 60.45,
    height: 47.812,
  },
  imageContainer: {
    overflow: 'hidden',
  },
  image: {
    width: 221.5,
    height: 28.709,
  },
});
