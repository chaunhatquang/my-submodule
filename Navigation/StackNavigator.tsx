import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import ViewFile from '../Common/view_file';

const Stack = createStackNavigator();

function StackNavigator(token: any) {
    const navigation = useNavigation<any>();

    return (
        <Stack.Navigator initialRouteName='view_file'>
            <Stack.Screen
                name="view_file"
                component={ViewFile}
                options={{ title: 'Chi tiết file đính kèm' }}
            />
        </Stack.Navigator>
    );
}

export default StackNavigator;
