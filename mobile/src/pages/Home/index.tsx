import React, { useEffect, useState } from 'react';
import { View, Image, Text, ImageBackground, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { Feather as Icon } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native';
import styles from './styles';

import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../routes';

import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

type PointsScreenProp = StackNavigationProp<RootStackParamList, 'Points'>;

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

const Home = () => {
  const [uf, setUf] = useState('');
  const [ufs, setUfs] = useState<string[]>([]);
  const [city, setCity] = useState('');
  const [cities, setCities] = useState<string[]>([]);
  const navigation = useNavigation<PointsScreenProp>();

  function handleNavigateToPoints() {
    navigation.navigate('Points', { uf, city });
  }

  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
      const ufInitials = response.data.map(uf => uf.sigla);
      setUfs(ufInitials);
    });
  }, []);

  useEffect(() => {
    if (!uf) return;
    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
      .then(response => {
        const cityNames = response.data.map(city => city.nome);
        setCities(cityNames);
    });   
  }, [uf]);

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
          <Picker
            selectedValue={uf}
            onValueChange={(itemValue, itemIndex) =>
              setUf(itemValue)
            }
            style={styles.input}
            hitSlop={{ top: 0, bottom: 0, left: 0, right: 0 }}
          >
            <Picker.Item  label='Selecione uma UF' enabled={false}/>
            {ufs.map(uf => (
              <Picker.Item label={uf} value={uf} key={uf} />
            ))}
          </Picker>
          {/*<TextInput 
            style={styles.input}
            placeholder='Digite sua UF'
            value={uf}
            onChangeText={text => setUf(text)}
            maxLength={2}
            autoCapitalize='characters'
            autoCorrect={false}
          />*/}
          {/*<TextInput 
            style={styles.input}
            placeholder='Digite sua Cidade'
            value={city}
            onChangeText={text => setCity(text)}
            autoCorrect={false}
          />*/}
          <Picker
            selectedValue={city}
            onValueChange={(itemValue, itemIndex) =>
              setCity(itemValue)
            }
            style={styles.input}
            hitSlop={{ top: 10, bottom: 10, left: 0, right: 0 }}
            enabled={!!uf}
          >
            <Picker.Item  label='Selecione uma cidade' enabled={false}/>
            {cities.map(city => (
              <Picker.Item label={city} value={city} key={city} />
            ))}
          </Picker>
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
