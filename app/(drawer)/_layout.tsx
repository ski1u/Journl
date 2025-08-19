import "@/global.css"

import { Drawer } from "expo-router/drawer"

import { Home, Settings } from "lucide-react-native"

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        drawerContentStyle: {
          
        },
        headerShown: false,
        drawerActiveTintColor: "#58a76d",
        drawerLabelStyle: {
          fontFamily: "Inter_600SemiBold",
          fontSize: 14,
        },
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerLabel: "Home",
          title: "Home",
          drawerIcon: ({ color }) => <Home color={color} size={22} />,
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          drawerLabel: "Settings",
          title: "Settings",
          drawerIcon: ({ color }) => <Settings color={color} size={22} />,
        }}
      />
    </Drawer>
  )
}