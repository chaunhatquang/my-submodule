import React, { useEffect, useRef, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Callout, Marker } from "react-native-maps";
import Toast from "react-native-root-toast";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import FastImage from "react-native-fast-image";
import { ITrafficAccident } from "../../../define";
import { fetchData } from "../Services/api";
import { renderLoadingIndicator } from "../Utils/LoadingIndicator";
import WebView from "react-native-webview";

let config = require("../Config/config.json");
const URL = config.BASE_URL;

const MapWithMarker = () => {
    const [isMapReady, setIsMapReady] = useState(false);
    const [markers, setMarkers] = useState<ITrafficAccident[]>([]);
    const mapRef = useRef(null);
    const navigation = useNavigation<any>();
    const [loading, setLoading] = useState(false);

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

    const CustomMarker = () => (
        <View>
            <FastImage source={{ uri: 'https://quang.bf.edu.vn/ImageUpload/TNGT/marker_accident.png' }} style={{ width: 25, height: 25 }} resizeMode="cover" />
        </View>
    )

    return (
        <View style={styles.container}>
            {loading && isMapReady ? renderLoadingIndicator() : <MapView
                ref={mapRef}
                style={styles.map}
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
                    <Marker key={marker.sttbanghi} image={{ uri: 'http://quang.bf.edu.vn/ImageUpload/TNGT/marker_accident_resize_edit_1.png' }} coordinate={{ latitude: Number(marker.vido), longitude: Number(marker.kinhdo) }}>
                        <Callout tooltip onPress={() => marker.sgtvt_luoihinhanhtngt.length === 0? null : navigation.navigate('image_viewer', { urlImages: marker.sgtvt_luoihinhanhtngt })}>
                            <View style={styles.bubble} >
                                <Text>
                                    <Image resizeMode="cover" source={{ uri: marker.sgtvt_luoihinhanhtngt.length === 0 ? 'https://quang.bf.edu.vn/ImageUpload/No_Image.jpg' : marker.sgtvt_luoihinhanhtngt[0].anhdinhkem }} style={[styles.image, { width: 180, height: 150 }]} />
                                </Text>
                                <Text style={styles.text}>{marker.tenvutainan}</Text>
                            </View>
                        </Callout>
                    </Marker>
                ))}
            </MapView>}
        </View>
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
        // width: '50%',
        padding: 10
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

