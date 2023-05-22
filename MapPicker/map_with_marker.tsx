import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { fetchData } from "../../services/api";
import Toast from "react-native-root-toast";
import { IPlant } from "../ChuNhatXanh/LapKeHoachDanhSach";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FastImage from "react-native-fast-image";

let config = require("../../config/config.json");
const URL = config.BASE_URL;

const MapWithMarker = () => {
    const [isMapReady, setIsMapReady] = useState(false);
    const [markers, setMarkers] = useState<IPlant[]>([]);
    const mapRef = useRef(null);
    const navigation = useNavigation<any>();

    useEffect(() => {
        fetchAllMarkers();
    }, [])

    const fetchAllMarkers = async () => {
        const params = {
            "serviceid": "45svSoTwsIqweymbabYl2A==",
            "thamso": {
                "tukhoa": "",
                "donvi": "0",
                "maquanhuyen": "0",
                "maxaphuong": "0",
                "thonto": "0",
                "trangthaithuchien": "0"
            },
            "page": "1",
            "perpage": "500"
        }

        const res: any = await fetchData(URL, params);
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
            <FastImage source={{uri: 'https://quang.bf.edu.vn/ImageUpload/ChuNhatXanh/tree.png'}} style={{width: 30,height: 30}} resizeMode="cover" />
        </View>
    )

    return (
        <View style={styles.container}>
            <MapView
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
                    <Marker key={marker.sttbanghi} coordinate={{ latitude: Number(marker.vido), longitude: Number(marker.kinhdo) }} title={marker.kehoach} description={marker.noidung}>
                        <CustomMarker />
                    </Marker>
                ))}
            </MapView>
            <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
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
});

