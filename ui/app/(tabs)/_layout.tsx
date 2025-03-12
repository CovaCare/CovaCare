import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="emergencyContacts"
      screenOptions={{
        tabBarActiveTintColor: "#4762e8",
        headerTitleStyle: {
          fontSize: 22,
          fontWeight: "bold",
        },
        headerStyle: {
          height: 115,
          backgroundColor: "#f8f9fa",
        },
        headerTitleAlign: "left",
        headerTitleContainerStyle: {
          justifyContent: "flex-end",
          paddingBottom: 10,
        },
      }}
    >
      <Tabs.Screen
        name="emergencyContacts"
        options={{
          title: "Emergency Contacts",
          tabBarIcon: ({ color }) => (
            <AntDesign name="contacts" color={color} size={24} />
          ),
        }}
      />
      {/* Disable Settings Tabs - Temporarily */}
      <Tabs.Screen
        name="cameras"
        options={{
          title: "Cameras",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="video-camera" color={color} size={24} />
          ),
        }}
      />
    </Tabs>
  );
}
