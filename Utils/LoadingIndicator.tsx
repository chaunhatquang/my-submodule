import React from "react";
import { ActivityIndicator, View } from "react-native";

export const renderLoadingIndicator = () => {
    return (
        <View style={{ paddingVertical: 20 }}>
            <ActivityIndicator size="small" color="red" />
        </View>
    )
}
