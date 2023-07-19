import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

interface InputProps {
    placeholder?: string;
    value: string,
    keyType?: any
    handleInputChange: (text: string) => void | null;
    editable?: boolean;
    label?: string | null
    multiline?: boolean;
    // rest: any
}

const InputCustom: React.FC<InputProps> = ({ placeholder, value, handleInputChange, keyType, editable, label,multiline,...rest}) => {
    const [isFocus, setIsFocus] = useState(false);
    const [isChecking, setIsChecking] = useState(false);

    useEffect(() => {
        if (isChecking) {
            setIsFocus(value === '');
        }
    }, [isChecking, value]);

    const handleTextInputFocus = () => {
        setIsChecking(true);
    };

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={handleInputChange}
                placeholder={placeholder}
                keyboardType={keyType}
                onFocus={handleTextInputFocus}
                placeholderTextColor='#999'
                editable={editable}
                multiline={multiline}
                {...rest}
            />
            {isFocus && <Text style={styles.errorText}>Vui lòng nhập {placeholder}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        fontSize: 15,
        color: 'black'
    },
    inputError: {
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        fontSize: 13,
    },
    label: {
        fontSize: 15,
        marginBottom: 5,
    },
});


export default InputCustom;