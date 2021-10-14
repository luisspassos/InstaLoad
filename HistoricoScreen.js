import React from 'react';
import { StyleSheet, Text, View, Image, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { Ionicons } from '@expo/vector-icons';

export default function Historico(props) {
    return (
        <ScrollView contentContainerStyle={styles.contentCenter} style={styles.ScrollViewPrincipal}>
             <View style={{marginTop: 15}}>
            {
                
                props.infosInsta.map(val => {
                    return (
                       
                            <View style={styles.boxConteudo}>
                                <Image source={{ uri: val.ImagemVideo }} style={styles.ImagemVideo} />
                                <View style={styles.PaddingTexts}>
                                    <Text style={styles.OwnerNome}>{val.OwnerNome.substring(0, 14)}</Text>
                                    <Text style={styles.LegendaPost}>{val.LegendaPost.substring(0, 16)}...</Text>
                                </View>
                                <Menu style={styles.Menu}>
                                    <MenuTrigger customStyles={{ TriggerTouchableComponent: TouchableWithoutFeedback }} style={styles.menuClick} >
                                        <Ionicons name="ellipsis-vertical" size={20} color="#948979" />
                                    </MenuTrigger>
                                    <MenuOptions optionsContainerStyle={styles.MenuOptions}>
                                        <MenuOption onSelect={() => props.copiarTexto(val.LegendaPost)}>
                                            <Text style={styles.textMenuOptions}>Copiar texto</Text>
                                        </MenuOption>
                                    </MenuOptions>
                                </Menu>
                            </View>
                        
                    )
                }).reverse()
                
            }
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    contentCenter: { 
        alignItems: 'center'
    },
    ScrollViewPrincipal: { 
        flex: 1, 
        backgroundColor: 'white' 
    },
    boxConteudo: { 
        backgroundColor: 'white', 
        width: 348, 
        height: 115, 
        elevation: 5, 
        marginTop: 10, 
        borderRadius: 15, 
        flexDirection: 'row', 
        marginBottom: 10 
    },
    ImagemVideo: { 
        width: 123, 
        height: 115, 
        borderRadius: 15 
    },
    OwnerNome: { 
        fontFamily: 'Roboto_700Bold', 
        fontSize: 22 
    },
    LegendaPost: { 
        fontFamily: 'Roboto_400Regular', 
        fontSize: 17, 
        color: '#948979' 
    },
    Menu: { 
        elevation: 6, 
        position: 'absolute', 
        left: 310, 
        top: 65 
    },
    menuClick: { 
        height: 50, 
        justifyContent: 'center', 
        width: 50, 
        alignItems: 'center' 
    },
    MenuOptions: { 
        marginLeft: 40, 
        backgroundColor: 'black', 
        height: 40, 
        justifyContent: 'center', 
        paddingLeft: 5 
    },
    textMenuOptions: { 
        color: 'white', 
        fontSize: 15 
    },
    PaddingTexts: { 
        padding: 10 
    }
})