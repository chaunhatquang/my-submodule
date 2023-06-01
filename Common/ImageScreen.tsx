/* eslint-disable prettier/prettier */
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Dimensions, Platform, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/AntDesign';
import ImageViewer from 'react-native-image-zoom-viewer';

export const ImageScreen = ({ route }: { route: any }) => {
  const { urlImages } = route.params as any;
  const images = urlImages.map((m: any) => {
    return { url: m.uri || m.anhdinhkem }
  });
  
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  return (
    <>
      <View
        style={{
          flex: 1,
          backgroundColor: "#262626",
          justifyContent: 'center',
          alignContent: 'center',
          alignSelf: 'center',
        }}>
        <Pressable
          style={{
            marginTop: Platform.OS == 'ios' ? insets.top : 12,
            zIndex: 1,
            left: 8,
            top: insets.top,
            padding: 12,
            backgroundColor: 'rgba(0,0,0, 0.4)',
            position: 'absolute',
            borderRadius: 100,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            navigation.goBack();
          }}>
          <Icon name="close" size={26} color={'white'} />
        </Pressable>
        <ImageViewer
          index={0}
          style={{ width: Dimensions.get('screen').width, height: 240 }}
          imageUrls={images}
          enableSwipeDown={true}
          onSwipeDown={() => {
            navigation.goBack();
          }}
        />
      </View>
    </>
  );
};
