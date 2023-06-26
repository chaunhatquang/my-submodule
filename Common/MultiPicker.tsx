import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { fetchData } from '../Services/api';

interface DynamicPickerProps {
    endpointsParams: any;
    label: string;
    value: string;
    placeholder: string;
    edit: boolean;
    labelButton: string;
    onChangeValue: (item: any) => void;
    handlePressButton: () => void;
    show: boolean;
    addItemAllInPickerData?: boolean,
}

const config = require('../Config/config.json');
const URL = config.BASE_URL;

const DynamicPicker: React.FC<DynamicPickerProps> = ({
    endpointsParams,
    label,
    value,
    placeholder,
    edit,
    labelButton,
    onChangeValue,
    handlePressButton,
    show,
    addItemAllInPickerData,
}) => {
    const [pickerData, setPickerData] = useState<any[]>([]);
    const [isFocus, setIsFocus] = useState(false);

    useEffect(() => {
        const fetchPickerApi = async () => {
            try {
                const res: any = await fetchData(URL, endpointsParams);
                if (res && res.data) {
                    const addNewItem0 = {
                        sttbanghi: "6",
                        "id": 0,
                        "nambc": "Tất cả",
                    }
                    const pickerDataWithItem0 = [addNewItem0, ...res.data];
                    const pickerData = res.data;
                    if (addItemAllInPickerData) {
                        setPickerData(pickerDataWithItem0);
                    } else {
                        setPickerData(pickerData);
                    }
                }
            } catch (error) {
                if (__DEV__) {
                    console.error('Error fetching picker data:', error);
                }
            }
        };

        fetchPickerApi();
    }, [endpointsParams]);

    const handleValueChange = (item: any) => {
        onChangeValue(item);
    };

    return (
        <View style={styles.container}>
            <Dropdown
                style={[styles.dropdown, isFocus && { borderColor: 'red' }]}
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
                placeholder={placeholder}
                searchPlaceholder="Tìm..."
                value={value}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={handleValueChange}
            />
            {show && (
                <TouchableOpacity onPress={() => handlePressButton()}>
                    <View style={styles.containerButton}>
                        <Text style={styles.reportText}>{labelButton}</Text>
                    </View>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    dropdown: {
        height: 40,
        borderWidth: 0.4,
        borderRadius: 5,
        paddingHorizontal: 8,
        flex: 1,
        backgroundColor: 'white'
    },
    placeholderStyle: {
        color: 'gray',
        fontSize: 15
    },
    selectedTextStyle: {
        color: 'black',
        fontSize: 15
    },
    inputSearchStyle: {
        color: 'black',
    },
    iconStyle: {
        tintColor: 'gray',
    },
    containerButton: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 8,
        marginLeft: 8
    },
    reportText: {
        color: 'white',
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
    },
});

export default DynamicPicker;
