import { Linking, Platform } from "react-native";

export const handleDirecttionWithPlatform = (latitude: string, longitude: string, name: string) => {
    const scheme = Platform.select({
        ios: 'maps:0,0?q=',
        android: 'geo:0,0?q=',
    });
    const latLng = `${parseFloat(latitude)},${parseFloat(longitude)}`;
    const label = `${name}`;
    const url = Platform.select({
        ios: `${scheme}${label}@${latLng}`,
        android: `${scheme}${latLng}(${label})`,
    });
    Linking.openURL(url!);
}