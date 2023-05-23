import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import ViewFile from '../Common/view_file';
import Homepage from '../../screens/TrafficAccident/HomePage';

const Stack = createStackNavigator();

function StackNavigator(token: any) {
   
    return (
        <Stack.Navigator initialRouteName='homepage'>
            <Stack.Screen
                name="homepage"
                component={Homepage}
                options={{ title: 'Giao thông' }}
                initialParams={{ "token": token }}
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
