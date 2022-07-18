import React, { useState } from 'react';
import { View, Image, Text, ImageBackground, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { Feather as Icon } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native';
import styles from './styles';

import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../routes';

type PointsScreenProp = StackNavigationProp<RootStackParamList, 'Points'>;

const Home = () => {
  const [uf, setUf] = useState('');
  const [city, setCity] = useState('');
  const navigation = useNavigation<PointsScreenProp>();

  function handleNavigateToPoints() {
    navigation.navigate('Points', { uf, city });
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined } style={{ flex: 1 }}>
      <ImageBackground 
        source={require('../../assets/home-background.png')} 
        style={styles.container}
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')} />
          <Text style={styles.title}>Seu marketplace de coleta de resíduos.</Text>
          <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
        </View>
        <View style={styles.footer}>
          <TextInput 
            style={styles.input}
            placeholder='Digite sua UF'
            value={uf}
            onChangeText={text => setUf(text)}
            maxLength={2}
            autoCapitalize='characters'
            autoCorrect={false}
          />
          <TextInput 
            style={styles.input}
            placeholder='Digite sua Cidade'
            value={city}
            onChangeText={text => setCity(text)}
            autoCorrect={false}
          />
          <RectButton style={styles.button} onPress={handleNavigateToPoints}>
            <View style={styles.buttonIcon}>
            <Text><Icon name='arrow-right' color='#FFF' size={24} /></Text>
            </View>
            <Text style={styles.buttonText}>Entrar</Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

export default Home;
