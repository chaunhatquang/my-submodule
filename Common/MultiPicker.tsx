// MultiPicker.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import axios from 'axios';
import { Dropdown } from "react-native-element-dropdown";
import { fetchData } from '../Services/api';
import { Button } from '@rneui/themed';
import { TouchableOpacity } from 'react-native-gesture-handler';

const config = require('../Config/config.json');
const URL = config.BASE_URL;

const DynamicPicker = ({ endpointsParams, label, value, placeholder, edit,labelButton,onChangeValue,handlePressButton,show }: { endpointsParams: any, label: string, value: string, placeholder: string, edit: boolean,labelButton: string,onChangeValue: (item: any) => void, handlePressButton: () => void,show: boolean }) => {
    const [pickerData, setPickerData] = useState<any[]>([]);
    const [isFocus, setIsFocus] = useState(false);

    useEffect(() => {
        const fetchPickerApi = async () => {
            try {
                const res: any = await fetchData(URL, endpointsParams);
                if (res && res.data) {
                    setPickerData(res.data);
                }
            } catch (error) {
                if (__DEV__) {
                    console.error('Error fetching picker data:', error);
                }
            }
        };

        fetchPickerApi();
    }, [endpointsParams]);

    return (
        <View style={styles.container}>
            <Dropdown
                style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={pickerData}
                search
                maxHeight={300}
                disable={edit}
                labelField={label}
                valueField={value}
                placeholder={!isFocus ? placeholder : '...'}
                searchPlaceholder="Tìm..."
                value={value}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => onChangeValue(item)}
            />
            {show && <TouchableOpacity onPress={() => handlePressButton()}>
                <View style={styles.containerButton}>
                    <Text style={styles.reportText}>{labelButton}</Text>
                </View>
            </TouchableOpacity>}
        </View>
    )
}

export default DynamicPicker;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly'
        // padding: 8,
    },
    title: {
        fontSize: 15,
        color: 'black'
    },
    placeholderStyle: {
        fontSize: 16,
        paddingLeft: 10
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 15,
    },
    borderbg: {
        borderWidth: 0.3,
        borderRadius: 3,
        backgroundColor: '#f8f8f8',
        marginVertical: 20
    },
    dropdown: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 0.5,
        backgroundColor: '#EDEDED',
        borderRadius: 8,
        // marginHorizontal: 10,
        // marginVertical: 8,
        padding: 10,
        flex: 1
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    reportText: {
        fontSize: 15,
        color: 'white',
        // fontWeight: 'bold',
    },
    containerButton: {
        backgroundColor: '#4487D5',
        borderWidth: 1,
        borderColor: 'black',
        padding: 8,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10
    },
});
