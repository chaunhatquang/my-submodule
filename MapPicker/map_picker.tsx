import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Button, Linking, PermissionsAndroid, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { IAddressComponents, IResAddInfo } from "../../../define";
import Toast from "react-native-root-toast";
import Geolocation, { GeoPosition } from 'react-native-geolocation-service';
import { useNavigation } from "@react-navigation/native";
import { IPosition } from "../Utils/MyPosition";
import { IResultAddComponent, getIDAddress } from "../Utils/GetIdAddress";
import { getAddress } from "../Services/api";
import { SafeAreaView } from "react-native-safe-area-context";

let config = require('../Config/config.json');
const MAP4D_URL = config.MAP4D_URL;
const KEY_MAP4D = config.KEY_MAP4D;

const MapPicker = ({ route }: { route: any }) => {
    const { userInfos } = route.params;
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
        const checkPermission = async () => {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.check(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                );
                if (!granted) {
                    const status = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                    );
                    if (status === 'denied') {
                        Toast.show("Ứng dụng không thể lấy vị trí hiện tại khi bạn không đồng ý");
                        return;
                    }
                }
            }
            Geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    setCurrentPosition({ latitude, longitude });
                    getNameAddress(latitude, longitude);
                },
                error => Toast.show(`Lỗi! ${error.message}`),
                { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
            );
        };
        checkPermission();
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

    const getNameAddress = async (latitude: number, longitude: number) => {
        let res: any = null;
        const params = {
            "key": KEY_MAP4D,
            "location": `${latitude},${longitude}`
        }
        if (!currentPosition) {
            res = await getAddress(MAP4D_URL, params);
            const { code, result, message } = res;
            if (code === 'ok') {
                const addTypeResult = getAddressType(result);
                let mapId = await getIDAddress(addTypeResult);
                setAddressInfos(mapId);
                setNameAddress(addTypeResult?.name);
            } else {
                Toast.show(message);
                return;
            }
        }
        return res;
    }

    if (!currentPosition) {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <ActivityIndicator size={'large'} color={'blue'} />
                <View style={{ width: '30%', alignSelf: 'center', marginVertical: 30 }}>
                    <Button title="Quay trở lại" onPress={() => navigation.goBack()}></Button>
                </View>
            </SafeAreaView>
        )
    }

    const moveCameraToPosition = () => {
        if (mapRef) {
            mapRef.current.animateCamera({
                center: {
                    latitude: coords?.myLaitude,
                    longitude: coords?.myLongitude
                },
                zoom: 14
            },
                { duration: 3000 }
            );
        }
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


    const onMapReady = () => {
        setIsMapReady(true);
    }

    const handleConfirmPositions = () => {
        if (userInfos === null) {
            Toast.show("Lỗi! Không thể kiểm tra được quyền");
        } else {
            navigation.navigate('new_accident', { addressInfos: addressInfos, userInfos: userInfos });
        }
    }

    const onRegionChange = (region: any) => {
        const lat = region?.latitude;
        const long = region?.longitude;
        setRegion(region);
        convertCoordsToAddress(lat, long);
    }

    const handleGetMyPosition = () => {
        Geolocation.getCurrentPosition((position: GeoPosition) => {
            let myPosition: IPosition = {};
            if (position && position.coords) {
                const laitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                myPosition = {
                    myLaitude: laitude,
                    myLongitude: longitude
                }
                setCoords(myPosition);
            }
        },
            error => {
                // See error code charts below.
                console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 1000 },
        );
        moveCameraToPosition();
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
                    latitude: currentPosition.latitude,
                    longitude: currentPosition.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
            </MapView>
            <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
            <View style={styles.mapMarkerContainer}>
                <FontAwesome name="map-marker" size={40} color={'#ad1f1f'} />
            </View>
            <View style={styles.overlay}>
                <InfoComponent address={nameAddress} loading={loading} handleGetMyPosition={() => handleGetMyPosition()} handleConfirmPositions={() => handleConfirmPositions()} />
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
            {props.loading ? <ActivityIndicator size={'large'} /> : <View style={{ flexDirection: 'row' }}>
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
    mapMarkerContainer: {
        left: '47%',
        position: 'absolute',
        top: '42%'
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
