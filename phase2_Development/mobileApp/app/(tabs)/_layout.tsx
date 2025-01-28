import { Tabs } from 'expo-router';

import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';
import { SafeAreaView } from 'react-native';


export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4762e8',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Emergency Contacts',
          tabBarIcon: ({ color, focused }) => (
            <AntDesign name={focused ? 'contacts' : 'contacts'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'settings' : 'settings'} color={color} size={24}/>
          ),
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: 'Cameras',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome name={focused ? 'video-camera' : 'video-camera'} color={color} size={24}/>
          ),
        }}
      />
    </Tabs>
  );
}
