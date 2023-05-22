import React from "react";
import { ActivityIndicator, Platform, SafeAreaView } from "react-native";
import WebView from "react-native-webview";

const ViewFile = ({ route }: { route: any }) => {
    const title = "Chi tiết file đính kèm";
    const { url } = route.params;
    console.log("url", url);
    const urlSubString = url.substring(url.length - 4);
    if (urlSubString.includes('pdf') || urlSubString.includes('docx') || urlSubString.includes('xlsx') || urlSubString.includes('doc') || urlSubString.includes('xls') || urlSubString.includes('ppt') || urlSubString.includes('pptx') || urlSubString.includes('txt')) {
        const urlViewerFileOnAndroid = `https://docs.google.com/gview?embedded=true&url=${url}`;
        const urlViewerFileOnIOs = url;

        if (Platform.OS === 'android') {
            return (
                <SafeAreaView style={{ flex: 1 }}>
                    <WebView
                        originWhitelist={['*']}
                        startInLoadingState={true}
                        source={{ uri: urlViewerFileOnAndroid }}
                        renderLoading={() => {
                            return <ActivityIndicator color={'blue'} size={'large'} />
                        }}
                    />
                </SafeAreaView>
            )
        } else {
            ///show on IOS
            return (
                <SafeAreaView style={{ flex: 1 }}>
                    <WebView
                        originWhitelist={['*']}
                        startInLoadingState={true}
                        source={{ uri: urlViewerFileOnIOs }}
                        renderLoading={() => {
                            return <ActivityIndicator color={'blue'} size={'large'} />
                        }}
                    />
                </SafeAreaView>
            )
        }
    } else {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <WebView
                    originWhitelist={['*']}
                    startInLoadingState={true}
                    source={{ uri: url }}
                    renderLoading={() => {
                        return <ActivityIndicator color={'blue'} size={'large'} />
                    }}
                />
            </SafeAreaView>
        )
    }
}

export default ViewFile;