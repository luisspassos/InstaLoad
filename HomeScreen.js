import React, { useState } from 'react';
import { StyleSheet, Switch, Text, View, TouchableOpacity, TextInput, ActivityIndicator, Image, TouchableWithoutFeedback } from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

export default function Home(props) {

    const toggleSwitch = () => {
        props.setIsEnabled(!props.isEnabled);
        props.StoreData(!props.isEnabled, 'switch')
    }

    const CampoBusca = ({ value, onChange }) => {
        const [link, setLink] = useState(`${value || props.linkClipboard}`)

        return (
            <View >
                <View style={{ marginTop: 5, marginLeft: 167 }}>
                    <Switch
                        style={{ position: 'absolute' }}
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={props.isEnabled ? '#fad59b' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={props.isEnabled}
                    />
                    <Text style={{ fontFamily: 'Roboto_400Regular', position: 'absolute', left: 50, top: 2 }}>Links automáticos</Text>
                </View>


                <View style={styles.campoBusca}>
                    <TextInput
                        value={link}
                        onChangeText={v => setLink(v)}
                        onEndEditing={() => onChange(link)}
                        style={styles.textInput}
                        placeholderTextColor="#AFA0A0"
                        placeholder="Cole o link do instagram aqui"
                    />
                    {
                        (link == '')
                            ?
                            <Ionicons style={styles.iconeBusca} name="search" size={25} />
                            :
                            <TouchableOpacity onPress={() => { setLink(''); props.setLinkClipboard('') }} style={styles.iconeBusca}>
                                <Feather name="x" size={25} />
                            </TouchableOpacity>
                    }
                </View>

                <TouchableOpacity onPress={() => props.baixarArquivo(link)} style={styles.btnBaixar}><MaterialIcons name="file-download" size={30} style={styles.positionBtnBaixar} /><View style={styles.positionCenterBtnBaixar}>
                </View></TouchableOpacity>
                {
                    (props.showCarregamento)
                        ?
                        <View style={styles.ViewCarregamento}>
                            <ActivityIndicator size="large" color='white' />
                            <Text style={styles.TextCarregamento}>Baixando...</Text>
                        </View>
                        :
                        <View />
                }
                {

                    props.infosInsta.map((val, index) => {
                        if (index == props.infosInsta.length - 1 || index == props.infosInsta.length - 2) {
                            return (
                                <View style={styles.conteudoInsta}>
                                    <Image style={styles.imagemInsta} source={{ uri: val.ImagemVideo }}></Image>
                                    <View style={styles.PaddingTextosConteudo}>
                                        <Text style={styles.OwnerNome}>{val.OwnerNome}</Text>
                                        <Text style={styles.LegendaPost}>{val.LegendaPost.substring(0, 16)}...</Text>
                                        <Image source={{ uri: val.ImagemPerfil }} style={styles.ImagemPerfil} />
                                        <Menu style={styles.positionMenu}>
                                            <MenuTrigger customStyles={{ TriggerTouchableComponent: TouchableWithoutFeedback }} style={styles.MenuClick}>
                                                <Ionicons name="ellipsis-vertical" size={20} color="#948979" />
                                            </MenuTrigger>
                                            <MenuOptions optionsContainerStyle={styles.MenuOptions}>
                                                <MenuOption onSelect={() => props.copiarTexto(val.LegendaPost)}>
                                                    <Text style={styles.textCopiarTexto}>Copiar texto</Text>
                                                </MenuOption>
                                            </MenuOptions>
                                        </Menu>
                                    </View>
                                </View>
                            )
                        }
                    }).reverse()
                }
            </View>

        );


    };


    return (
        <View style={styles.ViewPrincipal}>
            <View style={styles.ViewCenter}>
                {CampoBusca({})}
            </View>
        </View>
    )


}

const styles = StyleSheet.create({
    campoBusca: {
        backgroundColor: 'white',
        flexDirection: 'row',
        marginTop: 40,
        width: 348,
        height: 50,
        alignItems: 'center',
        borderRadius: 15,
        elevation: 5,
    },
    textInput: {
        paddingLeft: 50,
        width: 346,
        height: 50,
        borderRadius: 15,
        fontFamily: 'Roboto_400Regular'
    },
    iconeBusca: {
        position: 'absolute',
        marginLeft: 15
    },
    btnBaixar: {
        backgroundColor: '#fad59b',
        marginTop: 30,
        width: 348,
        height: 50,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    conteudoInsta: {
        backgroundColor: 'white',
        marginTop: 38,
        width: 348,
        height: 230,
        borderRadius: 15,
        elevation: 5,
    },
    imagemInsta: {
        width: 348,
        height: 110,
        borderRadius: 15,
    },
    positionBtnBaixar: {
        position: 'absolute'
    },
    positionCenterBtnBaixar: {
        elevation: 6,
        alignItems: 'center',
        justifyContent: 'center'
    },
    ViewPrincipal: {
        flex: 1,
        backgroundColor: 'white'
    },
    ViewCenter: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white'
    },
    ViewCarregamento: {
        backgroundColor: 'black',
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        position: 'absolute',
        top: 270,
        alignSelf: 'center',
        elevation: 6
    },
    TextCarregamento: {
        color: 'white',
        paddingLeft: 15
    },
    PaddingTextosConteudo: {
        padding: 10
    },
    OwnerNome: {
        fontFamily: 'Roboto_700Bold',
        fontSize: 20
    },
    LegendaPost: {
        fontFamily: 'Roboto_400Regular',
        fontSize: 15,
        color: '#948979'
    },
    ImagemPerfil: {
        width: 38,
        height: 38,
        borderRadius: 19,
        marginTop: 10
    },
    positionMenu: {
        position: 'absolute',
        left: 300,
        top: 65
    },
    MenuClick: {
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
    textCopiarTexto: {
        color: 'white',
        fontSize: 15
    }
})
