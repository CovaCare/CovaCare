import React from 'react';
import { Image, View } from 'react-native';
import { styles } from '../styles/Logo.styles';

export const Logo = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../../../assets/images/covacare.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}; 