import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Dimensions, Image, Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Callout, Marker } from "react-native-maps";
import Toast from "react-native-root-toast";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import FastImage from "react-native-fast-image";
import { ITrafficAccident } from "../../../define";
import { fetchData } from "../Services/api";
import { renderLoadingIndicator } from "../Utils/LoadingIndicator";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { handleDirecttionWithPlatform } from "../Common/Direction";
import DynamicPicker from "../Common/MultiPicker";
import { paramsYear } from "../../screens/Params";
import Geolocation from 'react-native-geolocation-service';
import { Button } from "@rneui/base";

let config = require("../Config/config.json");
const URL = config.BASE_URL;

const MapWithMarker = () => {
    const [isMapReady, setIsMapReady] = useState(false);
    const [markers, setMarkers] = useState<ITrafficAccident[]>([]);
    const mapRef = useRef<MapView | null>(null);
    const navigation = useNavigation<any>();
    const [loading, setLoading] = useState(false);
    const [selectedMarker, setSelectedMarker] = useState<ITrafficAccident | null>();
    const [modalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedYear, setSelectedYear] = useState<string | null>("2");
    const [yearValue, setYearValue] = useState<string | null>("2023");
    const [currentLocation, setCurrentLocation] = useState<any>(null);
    const windowHeight = Dimensions.get('window').height;
    const modalHeight = windowHeight / 3;

    useEffect(() => {
        getCurrentLocation();
    }, []);

    useEffect(() => {
        fetchAllMarkersByYear(selectedYear!);
        setSelectedMarker(null);
        return () => {

        }
    }, [selectedYear])

    const getCurrentLocation = () => {
        Geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                setCurrentLocation({ latitude, longitude });
            },
            error => {
                console.log(error);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    };

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
                "nguyennhan": "0",
                "nam": "2"
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

    const fetchAllMarkersByYear = async (year: string) => {
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
                "nguyennhan": "0",
                "nam": year
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

    const handleMyLocationPress = () => {
        if (currentLocation && mapRef.current) {
            mapRef.current?.animateToRegion({
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });
        }
    };

    return (
        <View style={styles.container}>
            {loading && isMapReady ? renderLoadingIndicator() : <MapView
                ref={mapRef}
                style={styles.map}
                onPress={handleMapPress}
                showsUserLocation={true}
                showsMyLocationButton={Platform.OS === 'android'}
                onMapReady={() => onMapReady()}
                initialRegion={{
                    latitude: 16.477834158321627,
                    longitude: 107.60202748424075,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                {markers.map(marker => (
                    <Marker onPress={() => handleMarkerPress(marker)} key={marker.sttbanghi} image={{ uri: 'https://quang.bf.edu.vn/ImageUpload/TNGT/marker_accident_resize_edit_1.png' }} coordinate={{ latitude: Number(marker.vido), longitude: Number(marker.kinhdo) }}></Marker>
                ))}
            </MapView>
            }
            {!loading && <View style={styles.dynamicPickerContainer}>
                <DynamicPicker
                    placeholder={`${yearValue}`}
                    endpointsParams={paramsYear}
                    label={"nambc"}
                    value={"id"}
                    onChangeValue={(item) => {
                        const idYear = item?.id.toString();
                        const name = item?.nambc;
                        setYearValue(name);
                        setSelectedYear(idYear);
                    }}
                    edit={false}
                    labelButton={""}
                    handlePressButton={function (): void {
                        throw new Error("Function not implemented.");
                    }}
                    show={false}
                    addItemAllInPickerData={true}
                />
            </View>}
            {Platform.OS === 'ios' && !loading && <View style={styles.iconPickerContainer}>
                <View style={styles.circle}>
                    <FontAwesome5 onPress={handleMyLocationPress} name="location-arrow" size={20} color="white" />
                </View>
            </View>}
            {selectedMarker && (
                <View style={{ backgroundColor: 'white', position: 'absolute', bottom: 0, left: 0, right: 0, height: modalHeight }}>
                    <View style={{ flex: 1, backgroundColor: 'white', padding: 20 }}>
                        <Text numberOfLines={2} style={styles.text}>{selectedMarker.tenvutainan}</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('image_viewer', { urlImages: selectedMarker.sgtvt_luoihinhanhtngt })}>
                            <FastImage
                                resizeMode="cover"
                                source={{
                                    uri:
                                        selectedMarker.sgtvt_luoihinhanhtngt.length === 0
                                            ? 'https://quang.bf.edu.vn/ImageUpload/No_Image.jpg'
                                            : selectedMarker.sgtvt_luoihinhanhtngt[0].anhdinhkem,
                                }}
                                style={styles.image}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                        <TouchableOpacity style={styles.directionButton} onPress={() => handleDirecttionWithPlatform(selectedMarker.vido, selectedMarker.kinhdo, selectedMarker.tenvutainan)}>
                            <FontAwesome5 name="directions" size={20} color="white" style={styles.icon} />
                            <Text style={styles.textDirection}>Chỉ đường</Text>
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
    icon: {
        marginRight: 5,
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
        width: '100%',
        height: 200,
        marginTop: 10,
        borderRadius: 8,
    },
    text: {
        fontSize: 16,
        color: 'blue',
        width: '90%'
    },
    directionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 30,
        marginBottom: 8,
        backgroundColor: 'blue',
        borderRadius: 8,
        padding: 8,
    },
    textDirection: {
        color: 'white',
        fontSize: 16,
    },
    dynamicPickerContainer: {
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 1,
        width: '30%',
    },
    iconPickerContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
    },
    circle: {
        width: 35,
        height: 35,
        borderRadius: 35 / 2,
        backgroundColor: 'gray',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

