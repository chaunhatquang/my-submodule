import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import ViewFile from '../Common/view_file';
import Homepage from '../../screens/TrafficAccident/HomePage';
import { Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MapPicker from '../MapPicker/map_picker';
import AddNewAccident from '../../screens/TrafficAccident/AddNewAccident';
import DetailAccident from '../../screens/TrafficAccident/DetailAccident';
import { ImageScreen } from '../Common/ImageScreen';
import AddMultiImageAccident from '../../screens/TrafficAccident/AddMultiImage';
import MapWithMarker from '../MapPicker/map_with_marker';
import EditAccident from '../../screens/TrafficAccident/EditAccident';
import Report from '../../screens/TrafficAccident/Report';
import HeadersButton from '../../screens/TrafficAccident/HeadersButton';

const Stack = createStackNavigator();

function StackNavigator(token: any) {
    const navigation = useNavigation<any>();

    return (
        <Stack.Navigator initialRouteName='headers_button'>
            <Stack.Screen
                name="plant_list"
                component={Homepage}
                // options={{
                //     title: 'Giao thông', headerRight: () =>
                //         <TouchableOpacity onPress={() => navigation.navigate('map_with_marker')}>
                //             <View style={{ flexDirection: 'row' }}>
                //                 <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 }}>
                //                     <Ionicons style={{ marginRight: 5 }} name="warning-outline" size={23} color={'red'} />
                //                     <Text style={{ color: 'red' }}>Bản đồ TNGT</Text>
                //                 </View>
                //             </View>
                //         </TouchableOpacity>
                // }}
                initialParams={{ token: token }}
            />
            <Stack.Screen
                name="headers_button"
                component={HeadersButton}
                options={{ title: 'Tai nạn giao thông', headerShown: true }}
                initialParams={{ "token": token }}
            />
            <Stack.Screen
                name="view_file"
                component={ViewFile}
                options={{ title: 'Chi tiết file đính kèm' }}
            />
            <Stack.Screen
                name="map_picker"
                component={MapPicker}
                options={{ title: 'Giao thông', headerShown: false }}
            />
            <Stack.Screen
                name="new_accident"
                component={AddNewAccident}
                options={{ title: 'Giao thông' }}
            />
            <Stack.Screen
                name="detail_accident"
                component={DetailAccident}
                options={{ title: 'Chi tiết TNGT' }}
            />
            <Stack.Screen
                name="image_viewer"
                component={ImageScreen}
                options={{ title: 'Giao thông', headerShown: false }}
            />
            <Stack.Screen
                name="add_multi_image"
                component={AddMultiImageAccident}
                options={{ title: 'Thêm hình ảnh TNGT', headerShown: true }}
            />
            <Stack.Screen
                name="map_with_marker"
                component={MapWithMarker}
                options={{ title: 'Chủ nhật xanh', headerShown: false }}
            />
            <Stack.Screen
                name="edit_accident"
                component={EditAccident}
                options={{ title: 'Giao thông', headerShown: true }}
            />
            <Stack.Screen
                name="report"
                component={Report}
                options={{ title: 'Tai nạn giao thông', headerShown: true }}
            />
        </Stack.Navigator>
    );
}

export default StackNavigator;
