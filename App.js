const userInstagram = require("user-instagram");
const instagramGetUrl = require("instagram-url-direct")

import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts, Roboto_700Bold, Roboto_400Regular } from '@expo-google-fonts/roboto';
import AppLoading from 'expo-app-loading';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { MenuProvider } from 'react-native-popup-menu';
import Home from './HomeScreen';
import Historico from './HistoricoScreen'
import * as Clipboard from 'expo-clipboard';

export default function App() {

  const [desabilitarView, setDesabilitarView] = useState(false)
  const [showCarregamento, setShowCarregamento] = useState(false);
  const [linkClipboard, setLinkClipboard] = useState('');
  const [infosInsta, setInfosInsta] = useState([]);
  const [isEnabled, setIsEnabled] = useState(true);
  const [clipboard, setClipboard] = useState('');

  const copiarTexto = (legenda) => {
    Clipboard.setString(legenda)
    popupsBottom('Legenda Copiada');
  }

  const functionsDownload = () => {
    setLinkClipboard(clipboard)
    baixarArquivo(clipboard)
  }

  const Erro = (erro) => {
    if (clipboard != '') {
      console.error(erro);
      popupsBottom('Link inválido');
      setShowCarregamento(false);
      setDesabilitarView(false)
    }
  }

  const popupsBottom = (mensagem) => {
    ToastAndroid.showWithGravity(
      mensagem,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM
    );
  };

  const baixarArquivo = async (links) => {

    setLinkClipboard(links)

    try {

      if (links.lastIndexOf('https://www.instagram.com/', 0) == -1) {
        return popupsBottom('Forneça um link correto do Instagram');
      }

      const permissao = await MediaLibrary.getPermissionsAsync()
      if (permissao.status !== 'granted') {
        return MediaLibrary.requestPermissionsAsync();
      }

      setShowCarregamento(true);
      setDesabilitarView(true);

      const linkDownload = await instagramGetUrl(links);
      const linkReelsDownload = linkDownload.url_list

      const linkSplit = links.split('/');
      const shortcode = linkSplit[4];

      const infos = await userInstagram.getPostData(shortcode)

      linkReelsDownload.forEach((index, value) => {
        let formato = '';

        if (index.indexOf('.mp4') != -1) {
          formato = '.mp4'
        } else {
          formato = '.jpg'
        }

        FileSystem.downloadAsync(
          index,
          FileSystem.documentDirectory + `${value}${formato}`,
        )
          .then(({ uri }) => {
            MediaLibrary.saveToLibraryAsync(uri);
            popupsBottom('Download concluído');
            setShowCarregamento(false);
            setDesabilitarView(false)

            let infosInstaData = [...infosInsta, {
              LegendaPost: infos.caption || '',
              OwnerNome: infos.owner.username || '',
              ImagemPerfil: infos.owner.profilePicture || '',
              ImagemVideo: infos.displayUrl || ''
            }]

            setInfosInsta(infosInstaData)
            StoreData(infosInstaData, 'InstaData')

          })
      })

    } catch (e) {
      Erro()
    }

  };

  useEffect(() => {
    if (clipboard.lastIndexOf('https://www.instagram.com/', 0) == -1) return;
    isEnabled
      ?
      functionsDownload()
      :
      null
  }, [clipboard])

  useEffect(() => {
    let timer = setInterval(() => {
      (async () => {
        try {
          let text = await Clipboard.getStringAsync();
          text.lastIndexOf('https://www.instagram.com/', 0) != -1 ? setClipboard(text) : null;
        } catch (e) { }

      })();
    }, 1000)
    return () => clearInterval(timer);
  }, [])

  useEffect(() => {

    getData('InstaData', setInfosInsta([]), setInfosInsta)
    getData('switch', null, setIsEnabled)

  }, [])

  const getData = async (key, param1, param2) => {
    try {
      let jsonValue = await AsyncStorage.getItem(key)
      jsonValue == null ? param1 : param2(JSON.parse(jsonValue));

    } catch (e) { }
  }

  const StoreData = async (value, key) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem(key, jsonValue)
    } catch (e) { }
  }

  function HomeScreen() {
    return (
      <Home copiarTexto={copiarTexto} StoreData={StoreData} popupsBottom={popupsBottom} baixarArquivo={baixarArquivo} isEnabled={isEnabled} setIsEnabled={setIsEnabled} infosInsta={infosInsta} linkClipboard={linkClipboard} setLinkClipboard={setLinkClipboard} showCarregamento={showCarregamento} />
    )
  }

  function HistoricoScreen({ navigation }) {
    useEffect(() => {
      if(clipboard.lastIndexOf('https://www.instagram.com/', 0) == -1) return;
      isEnabled ? navigation.navigate("Home") : null;
    }, [clipboard])
  
    return (
      <Historico copiarTexto={copiarTexto} infosInsta={infosInsta} />
    )
  }

  const Tab = createMaterialTopTabNavigator();

  let [fontsLoaded] = useFonts({
    Roboto_700Bold,
    Roboto_400Regular
  });

  if (!fontsLoaded) {
    return <AppLoading />
  } else {
    return (
      <View pointerEvents={desabilitarView ? 'none' : 'auto'} style={styles.container}>
        <MenuProvider>
          <StatusBar style="auto" />
          <NavigationContainer >
            <StatusBar hidden />
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color }) => {
                  let iconHome;
                  let iconClipboard;
                  if (route.name === 'Home') {
                    iconHome = focused
                      ? 'home'
                      : 'home';
                  } else if (route.name === 'Historico') {
                    iconClipboard = focused ? 'clipboard-text' : 'clipboard-text';
                  }
                  return (
                    <View style={styles.CenterIconBar}>
                      <Ionicons style={styles.iconHome} name={iconHome} color={color} size={50} />
                      <MaterialCommunityIcons style={styles.iconClipboard} name={iconClipboard} color={color} size={50} />
                    </View>
                  );
                },
              })}
              tabBarOptions={{
                activeTintColor: '#fad59b',
                inactiveTintColor: 'black',
                showLabel: false,
                showIcon: true,
                tabStyle: { width: 100, height: 80 },
                indicatorStyle: { backgroundColor: '#fad59b', height: 3 },
                style: { elevation: 0 }
              }}
            >
              <Tab.Screen name="Home" component={HomeScreen} />
              <Tab.Screen name="Historico" component={HistoricoScreen} />
            </Tab.Navigator>
          </NavigationContainer>
        </MenuProvider>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  CenterIconBar: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconHome: {
    width: 50
  },
  iconClipboard: {
    width: 50,
    position: 'absolute'
  }
});

