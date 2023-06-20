import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

interface InputProps {
    placeholder: string;
    value: string,
    keyType?: any
    handleInputChange: (text: string) => void;
}

const InputCustom: React.FC<InputProps> = ({ placeholder, value, handleInputChange,keyType }) => {
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
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={handleInputChange}
                placeholder={placeholder}
                keyboardType={keyType}
                onFocus={handleTextInputFocus}
                placeholderTextColor='#999'
            />
            {isFocus && <Text style={styles.errorText}>Vui lòng nhập {placeholder}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        fontSize: 15
    },
    inputError: {
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        fontSize: 13,
    },

});


export default InputCustom;