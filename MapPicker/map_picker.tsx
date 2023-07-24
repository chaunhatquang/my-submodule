import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Button, Linking, PermissionsAndroid, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { IAddressComponents, IResAddInfo } from "../../../define";
import Toast from "react-native-root-toast";
import { useNavigation } from "@react-navigation/native";
import Geolocation from "@react-native-community/geolocation";
import { IPosition } from "../Utils/MyPosition";
import { IResultAddComponent, getIDAddress } from "../Utils/GetIdAddress";
import { getAddress } from "../Services/api";

let config = require('../Config/config.json');
const MAP4D_URL = config.MAP4D_URL;
const KEY_MAP4D = config.KEY_MAP4D;

const MapPicker = () => {
    // const { userInfos } = route.params;
    const [isMapReady, setIsMapReady] = useState(false);
    const [region, setRegion] = useState({
        latitude: 16.477468605596638,
        longitude: 107.60290873379573,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001
    });
    const [nameAddress, setNameAddress] = useState("");
    const [loading, setLoading] = useState(false);
    const mapRef = useRef<any>(null);
    const [coords, setCoords] = useState<IPosition | null>(null);
    const [addressInfos, setAddressInfos] = useState<IResultAddComponent>();
    const navigation = useNavigation<any>();
    const [currentPosition, setCurrentPosition] = useState<any | null>(null);

    useEffect(() => {
        const requestLocationPermission = async () => {
            if (Platform.OS === 'android') {
                try {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                        {
                            title: 'Ứng dụng cần quyền truy cập vị trí',
                            message: 'Ứng dụng cần quyền truy cập vị trí để hoạt động chính xác.',
                            buttonNeutral: 'Hỏi sau',
                            buttonNegative: 'Hủy',
                            buttonPositive: 'Đồng ý',
                        },
                    );
                    // Xử lý quyền truy cập vị trí cho Android ở đây...
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        Geolocation.getCurrentPosition(
                            position => {
                                const { latitude, longitude } = position.coords;
                                console.log("position.coords", position.coords);
                                setCurrentPosition({ latitude, longitude });
                                if (mapRef.current) {
                                    mapRef.current.animateToRegion({
                                        latitude,
                                        longitude,
                                        latitudeDelta: 0.0922,
                                        longitudeDelta: 0.0421,
                                    });
                                    convertCoordsToAddress(latitude, longitude);
                                }
                            },
                            error => console.log(error),
                            { enableHighAccuracy: true, timeout: 20000 },
                        );

                        const watchId = Geolocation.watchPosition(
                            position => {
                                const { latitude, longitude } = position.coords;
                                setCurrentPosition({ latitude, longitude });
                            },
                            error => console.log(error),
                            { enableHighAccuracy: true, maximumAge: 1000, distanceFilter: 10 },
                        );

                        // Clear the watch position when the component unmounts
                        return () => Geolocation.clearWatch(watchId);
                    } else {
                        console.log('Ứng dụng không được cấp quyền truy cập vị trí.');
                    }
                } catch (err) {
                    console.warn(err);
                }
            } else {
                // Xử lý quyền truy cập vị trí cho iOS ở đây (nếu cần)
                Geolocation.getCurrentPosition(
                    position => {
                        const { latitude, longitude } = position.coords;
                        console.log("position.coords", position.coords);
                        setCurrentPosition({ latitude, longitude });
                        if (mapRef.current) {
                            mapRef.current.animateToRegion({
                                latitude,
                                longitude,
                                latitudeDelta: 0.0922,
                                longitudeDelta: 0.0421,
                            });
                            convertCoordsToAddress(latitude, longitude);
                        }
                    },
                    error => console.log(error),
                    { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
                );

                const watchId = Geolocation.watchPosition(
                    position => {
                        const { latitude, longitude } = position.coords;
                        setCurrentPosition({ latitude, longitude });
                    },
                    error => console.log(error),
                    { enableHighAccuracy: true, maximumAge: 1000, distanceFilter: 10 },
                );

                // Clear the watch position when the component unmounts
                return () => Geolocation.clearWatch(watchId);
            }
        };

        requestLocationPermission();
    }, [])

    const getAddressType = (result: any) => {
        let objAddComp: any = {};

        for (let i = 0; i < result.length; i++) {
            // const name = result[i].address;
            const addressComponent = result[i].addressComponents as IAddressComponents[];
            for (let ii = 0; ii < addressComponent.length; ii++) {
                if (addressComponent[ii].types[0] === "admin_level_3" && addressComponent[ii].types.length > 0) {
                    objAddComp.admin_level_3 = addressComponent[ii].name;
                }
                if (addressComponent[ii].types[0] === "admin_level_4" && addressComponent[ii].types.length > 0) {
                    objAddComp.admin_level_4 = addressComponent[ii].name;
                }
                if (addressComponent[ii].types[0] === "street" && addressComponent[ii].types.length > 0) {
                    objAddComp.street = addressComponent[ii].name;
                }
                if (addressComponent[ii].types[0] === "housenumber" && addressComponent[ii].types.length > 0) {
                    objAddComp.housenumber = addressComponent[ii].name;
                }
            }
            // addTemp = name;
            objAddComp.latitude = result[i].location.lat;
            objAddComp.longitude = result[i].location.lng;
            objAddComp.name = result[i].address;
        }
        return objAddComp;
    }

    const convertCoordsToAddress = async (latitude: number, longitude: number) => {
        const params = {
            "key": KEY_MAP4D,
            "location": `${latitude},${longitude}`
        }
        setLoading(true);
        const res = await getAddress(MAP4D_URL, params) as IResAddInfo;

        setLoading(false);
        const { code, result } = res;
        if (code === "ok") {
            const resultAddType = getAddressType(result);
            let mapId = await getIDAddress(resultAddType);
            setAddressInfos(mapId);
            setNameAddress(resultAddType.name);
        } else {
            Toast.show(`${code}`);
            return;
        }
    }

    const handleMyLocationPress = () => {
        if (currentPosition && mapRef.current) {
            mapRef.current?.animateToRegion({
                latitude: currentPosition.latitude,
                longitude: currentPosition.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });
        }
    };

    const onMapReady = () => {
        setIsMapReady(true);
    }

    const handleConfirmPositions = () => {
        navigation.navigate('new_accident', { addressInfos: addressInfos });
    }

    const onRegionChange = (region: any) => {
        const lat = region?.latitude;
        const long = region?.longitude;
        convertCoordsToAddress(lat, long);
        setRegion(region);
    }

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                showsUserLocation={true}
                showsMyLocationButton={true}
                onRegionChangeComplete={onRegionChange}
                initialRegion={{
                    latitude: currentPosition?.latitude || 0,
                    longitude: currentPosition?.longitude || 0,
                    latitudeDelta: 0.0925,
                    longitudeDelta: 0.0421,
                }}
            >
            </MapView>
            <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
            <View style={Platform.OS === 'android' ? styles.mapMarkerContainerAndroid : styles.mapMarkerContainerIos}>
                <FontAwesome name="map-marker" size={40} color={'#ad1f1f'} />
            </View>
            <View style={styles.overlay}>
                <InfoComponent address={nameAddress} loading={loading} handleGetMyPosition={() => handleMyLocationPress()} handleConfirmPositions={() => handleConfirmPositions()} />
            </View>
        </View>
    )
}

export default MapPicker;

const InfoComponent: React.FC<IAddInfoProps> = (props) => {

    return (
        <View style={{ backgroundColor: 'white', width: '100%', height: 150, position: 'absolute', bottom: 0, borderTopRightRadius: 8, borderTopLeftRadius: 8 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 15, marginVertical: 10 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'black' }}>Di chuyển bản đồ để chọn vị trí</Text>
                <Pressable onPress={() => props.handleGetMyPosition()}>
                    {Platform.OS === 'ios' ? <MaterialIcons name="my-location" size={23} color={'red'} /> : null}
                </Pressable>
            </View>
            {props.loading ? <ActivityIndicator color={'red'} size={'small'} /> : <View style={{ flexDirection: 'row' }}>
                <MaterialIcons name="location-pin" size={23} color={'blue'} />
                <Text style={{ color: 'black', fontSize: 14, marginHorizontal: 10, width: '90%' }}>{props.address}</Text>
            </View>}
            <View style={{ width: '50%', marginVertical: 10, alignSelf: 'center' }}>
                <Button color={'#007CC4'} onPress={() => props.handleConfirmPositions()} title="CHỌN VỊ TRÍ NÀY"></Button>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mapMarkerContainerAndroid: {
        left: '47%',
        position: 'absolute',
        top: '45%'
    },
    mapMarkerContainerIos: {
        left: '47%',
        position: 'absolute',
        top: '47%'
    },
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
    overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '20%',
        backgroundColor: '#fff',
        zIndex: 1,
    },
})

interface IAddInfoProps {
    address: string,
    loading: boolean,
    handleGetMyPosition: () => void,
    handleConfirmPositions: () => void
}
