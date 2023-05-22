import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MapPicker from '../screens/maps/map_picker';
import PlantNew from '../screens/ChuNhatXanh/LapKeHoach';
import { ImageScreen } from '../components/ImageScreen';
import PlantList from '../screens/ChuNhatXanh/LapKeHoachDanhSach';
import LapBaoCao from '../screens/ChuNhatXanh/LapBaoCao';
import DetailReport from '../screens/ChuNhatXanh/ChiTietBaoCao';
import SuaBaoCao from '../screens/ChuNhatXanh/SuaBaoCao';
import { DefaultTheme, useNavigation } from '@react-navigation/native';
import { Text, View } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MapWithMarker from '../screens/maps/map_with_marker';
import PlanDetail from '../screens/ChuNhatXanh/ChiTietKeHoach';
import ViewFile from '../common/view_file';
import PlanEdit from '../screens/ChuNhatXanh/SuaKeHoach';
import PlantOrder from '../screens/ChuNhatXanh/Xep_Hang';
import Share from 'react-native-share';

const Stack = createStackNavigator();

function StackNavigator(token: any) {
    const navigation = useNavigation<any>();

    const handleShare = async () => {
        try {
          const shareOptions = {
            title: 'Chia sẻ ứng dụng',
            message: 'Chi tiết kết quả báo cáo chủ nhật xanh',
            url: 'https://ioc.thuathienhue.gov.vn',
          };
    
          await Share.open(shareOptions);
        } catch (error) {
          console.log('Lỗi khi chia sẻ:', error);
        }
      };

    return (
        <Stack.Navigator initialRouteName='plant_list'>
            <Stack.Screen
                name="plant_list"
                component={PlantList}
                options={{
                    title: 'Danh sách kế hoạch', headerRight: () =>
                        <TouchableOpacity onPress={() => navigation.navigate('map_with_marker')}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 }}>
                                    <Entypo style={{ marginRight: 5 }} name="map" size={23} color={'green'} />
                                    <Text style={{ color: 'green' }}>Bản đồ CNX</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                }}
                initialParams={{ "token": token }}
            />
            <Stack.Screen
                name="map_picker"
                component={MapPicker}
                options={{ title: 'Chủ nhật xanh', headerShown: false }}
            />
            <Stack.Screen
                name="plant_new"
                component={PlantNew}
                options={{ title: 'Lập kế hoạch' }}
            />
            <Stack.Screen
                name="report_new"
                component={LapBaoCao}
                options={{ title: 'Lập báo cáo' }}
            />
            <Stack.Screen
                name="report_edit"
                component={SuaBaoCao}
                options={{ title: 'Sửa báo cáo' }}
            />
            <Stack.Screen
                name="plan_edit"
                component={PlanEdit}
                options={{ title: 'Sửa kế hoạch' }}
            />
            <Stack.Screen
                name="detail_report"
                component={DetailReport}
                options={{ title: 'Chi tiết báo cáo',headerRight: () => <Ionicons onPress={handleShare} style={{marginRight: 10}} name="md-share-outline" size={25} />}}
            />
            <Stack.Screen
                name="detail_plant"
                component={PlanDetail}
                options={{ title: 'Chi tiết kế hoạch' }}
            />
            <Stack.Screen
                name="plant_order"
                component={PlantOrder}
                options={{ title: 'Xếp hạng' }}
            />
            <Stack.Screen
                name="image_viewer"
                component={ImageScreen}
                options={{ title: 'Lập kế hoạch', headerShown: false }}
            />
            <Stack.Screen
                name="map_with_marker"
                component={MapWithMarker}
                options={{ title: 'Chủ nhật xanh', headerShown: false }}
            />
            <Stack.Screen
                name="view_file"
                component={ViewFile}
                options={{ title: 'Chi tiết file đính kèm' }}
            />
        </Stack.Navigator>
    );
}

export default StackNavigator;
