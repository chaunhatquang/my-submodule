import { PermissionsAndroid, Platform } from "react-native";
import Geolocation, { GeoPosition } from 'react-native-geolocation-service';

// Function to get permission for location
const requestLocationPermission = async () => {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: 'Yêu cầu quyền truy cập vị trí',
                message: 'Cho phép ứng dụng quyền truy cập vị trí trên thiết bị này?',
                buttonNeutral: 'Hỏi lại sau',
                buttonNegative: 'Hủy bỏ',
                buttonPositive: 'Cho phép',
            },
        );
        // console.log('granted', granted);
        if (granted === 'granted') {
            // console.log('You can use Geolocation');
            return true;
        } else {
            // console.log('You cannot use Geolocation');
            return false;
        }
    } catch (err) {
        return false;
    }
};

export interface IPosition {
    myLaitude?: number,
    myLongitude?: number
}