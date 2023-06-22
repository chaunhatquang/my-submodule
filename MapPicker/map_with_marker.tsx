import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Dimensions, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Callout, Marker } from "react-native-maps";
import Toast from "react-native-root-toast";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import FastImage from "react-native-fast-image";
import { ITrafficAccident } from "../../../define";
import { fetchData } from "../Services/api";
import { renderLoadingIndicator } from "../Utils/LoadingIndicator";
import WebView from "react-native-webview";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { handleDirecttionWithPlatform } from "../Common/Direction";

let config = require("../Config/config.json");
const URL = config.BASE_URL;

const MapWithMarker = () => {
    const [isMapReady, setIsMapReady] = useState(false);
    const [markers, setMarkers] = useState<ITrafficAccident[]>([]);
    const mapRef = useRef(null);
    const navigation = useNavigation<any>();
    const [loading, setLoading] = useState(false);
    const [selectedMarker, setSelectedMarker] = useState<ITrafficAccident | null>();
    const [modalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchAllMarkers();
    }, [])

    const fetchAllMarkers = async () => {
        const params = {
            "serviceid": "5hmQQTMsGrNmA86vcBj11A==",
            "thamso": {
                "tukhoa": "",
                "loaitngt": "0",
                "mucdo": "0",
                "diabanxayra": "0",
                "thoigian": "0",
                "loaiphuongtien": "0",
                "tuyenduong": "0",
                "nguyennhan": "0"
            },
            "page": "1",
            "perpage": "500"
        }
        setLoading(true);
        const res: any = await fetchData(URL, params);
        setLoading(false);
        const { code, message, data } = res;
        if (code === 0) {
            setMarkers(data);
        } else {
            setMarkers([]);
            Toast.show(message);
            return;
        }
    }

    const onMapReady = () => {
        setIsMapReady(true);
    }

    const handleMarkerPress = (marker: ITrafficAccident) => {
        setSelectedMarker(marker);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setSelectedMarker(null);
        setModalVisible(false);
    };

    const handleMapPress = () => {
        if (modalVisible) {
            handleCloseModal();
        }
    };

    const windowHeight = Dimensions.get('window').height;
    const modalHeight = windowHeight / 3;

    return (
        <View style={styles.container}>
            {loading && isMapReady ? renderLoadingIndicator() : <MapView
                ref={mapRef}
                style={styles.map}
                onPress={handleMapPress}
                showsUserLocation={true}
                showsMyLocationButton={true}
                onMapReady={() => onMapReady()}
                initialRegion={{
                    latitude: 16.477834158321627,
                    longitude: 107.60202748424075,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                {markers.map(marker => (
                    <Marker onPress={() => handleMarkerPress(marker)} key={marker.sttbanghi} image={{ uri: 'http://quang.bf.edu.vn/ImageUpload/TNGT/marker_accident_resize_edit_1.png' }} coordinate={{ latitude: Number(marker.vido), longitude: Number(marker.kinhdo) }}></Marker>
                ))}
            </MapView>
            }
            {selectedMarker && (
                <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: modalHeight }}>
                    <View style={{ flex: 1, backgroundColor: 'white', padding: 20 }}>
                        <Text numberOfLines={2} style={styles.text}>{selectedMarker.tenvutainan}</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('image_viewer', { urlImages: selectedMarker.sgtvt_luoihinhanhtngt })}>
                            {isLoading ? (
                                <ActivityIndicator size="small" color="red" />
                            ) : (
                                <FastImage
                                    resizeMode="cover"
                                    source={{
                                        uri:
                                            selectedMarker.sgtvt_luoihinhanhtngt.length === 0
                                                ? 'https://quang.bf.edu.vn/ImageUpload/No_Image.jpg'
                                                : selectedMarker.sgtvt_luoihinhanhtngt[0].anhdinhkem,
                                    }}
                                    style={{ width: '100%', height: 200, marginTop: 10 }}
                                    // onLoadStart={() => setIsLoading(false)}
                                    // onLoadEnd={() => setIsLoading(true)}
                                />
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDirecttionWithPlatform(selectedMarker.vido, selectedMarker.kinhdo, selectedMarker.tenvutainan)} style={{ position: 'absolute', top: 10, right: 20 }}>
                            <FontAwesome5 name="directions" size={32} color="blue" />
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View >
    )
}

export default MapWithMarker;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    map: {
        flex: 1,
    },
    button: {
        position: 'absolute',
        top: 30,
        left: 20,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 10,
        zIndex: 1,
    },
    marker: {
        width: 50, // Kích thước chiều rộng của marker
        height: 50, // Kích thước chiều cao của marker
    },
    plainView: {
        // width: '25%',
    },
    calloutContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        // padding: 2,
    },
    image: {
        width: 200,
        height: 80,
        marginBottom: 25,
    },
    text: {
        fontSize: 16,
        color: 'blue',
        width: '90%'
    },
    markerImage: {
        width: 30, // Định nghĩa kích thước mới cho hình ảnh marker
        height: 30,
    },
    bubble: {
        // flexDirection: 'rowco',
        alignSelf: 'flex-start',
        backgroundColor: '#fff',
        borderRadius: 6,
        borderColor: '#ccc',
        borderWidth: 0.5,
        padding: 10,
        width: '80%',
    }
});

