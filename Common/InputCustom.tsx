import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

interface InputProps {
    placeholder?: string;
    value: string,
    keyType?: any
    handleInputChange: (text: string) => void | null;
    editable?: boolean;
    label?: string | null
    multiline?: boolean;
}

const InputCustom: React.FC<InputProps> = ({ placeholder, value, handleInputChange, keyType, editable, label, multiline, ...rest }) => {
    const [isFocus, setIsFocus] = useState(false);
    const [isChecking, setIsChecking] = useState(false);

    const inputRef = useRef<any>(null);

    useEffect(() => {
        if (isChecking) {
            setIsFocus(value === '');
        }
    }, [isChecking, value]);

    // Hàm xử lý khi người dùng nhấn vào biểu tượng X để xoá giá trị
    const handleClearValue = () => {
        handleInputChange('');

        if (inputRef.current) {
            inputRef.current.focus();
        }
    }

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={handleInputChange}
                ref={inputRef}
                placeholder={placeholder}
                keyboardType={keyType}
                placeholderTextColor="#999"
                editable={editable}
                multiline={multiline}
                {...rest}
            />
            {value.length > 0 && (
                <TouchableOpacity style={styles.clearIcon} onPress={handleClearValue}>
                    <Ionicons style={{ padding: 5 }} name="close-circle" color={'gray'} size={22} />
                </TouchableOpacity>
            )}
        </View>
    )
}

export default InputCustom;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
        marginBottom: 20,
    },
    input: {
        flex: 1,
        height: 40,
        paddingHorizontal: 8
    },
    clearIcon: {
        padding: 3,
    },
    clearText: {
        color: 'red',
        fontSize: 18,
    },
});
