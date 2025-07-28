import Constants from 'expo-constants';
import { Bell } from 'lucide-react-native';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { AppIcon } from '../Icons';
const Top = Constants.statusBarHeight;

const HomeHeader = () => (
  <View
    className="px-5 pb-5 bg-white flex-row items-center justify-between"
    style={{
      paddingTop: Top + 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 8,
    }}
  >
    <View>
      <Text className="text-3xl font-geist-bold text-neutral-900 mb-1">
        Welcome Back!
      </Text>
      <Text className="text-base text-neutral-600 font-geist">
        Stay updated with the latest in AI & ML.
      </Text>
    </View>
    <Pressable
      onPress={() => console.log('Notifications pressed')}
      className="mx-3"
    >
      <AppIcon Icon={Bell} size={22} color="#333" fill="#000" />
    </Pressable>
  </View>
);

export default HomeHeader;
