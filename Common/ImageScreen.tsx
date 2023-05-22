/* eslint-disable prettier/prettier */
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Dimensions, Platform, Pressable, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/AntDesign';
import ImageViewer from 'react-native-image-zoom-viewer';
import { theme } from '../utils/theme';

export const ImageScreen = ({route}:{route: any}) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  return (
    <>
      <View
        style={{
          flex: 1,
          backgroundColor: theme.textGray100,
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
          style={{width: Dimensions.get('screen').width, height: 240}}
          imageUrls={[{url: route.params.urlImage}]}
          enableSwipeDown={true}
          onSwipeDown={() => {
            navigation.goBack();
          }}
        />
      </View>
    </>
  );
};
