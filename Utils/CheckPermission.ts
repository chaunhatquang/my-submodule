import { PermissionsAndroid } from "react-native";

export const requestCameraPermission = async () => {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
                title: 'Yêu cầu quyền truy cập camera',
                message: 'Cho phép ứng dụng quyền truy cập camera trên thiết bị này?',
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