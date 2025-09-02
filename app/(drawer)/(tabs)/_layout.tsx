import "@/global.css"

import { Tabs } from "expo-router"

import { Home, Plus, User, PenBox } from "lucide-react-native"

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#1C1C1E",
          borderTopWidth: 0,
          height: 80, paddingTop: 8, paddingBottom: 8
        },
        headerShown: false,
        tabBarActiveTintColor: "#58a76d",
        tabBarShowLabel: false, tabBarLabelStyle: { marginTop: 3, fontSize: 9 }
      }}
    >
      <Tabs.Screen name="index" options={{
        title: "Home",
        tabBarIcon: ({ color, focused }) => <Home color={focused ? color : "#666"} size={28} />
      }} />
      <Tabs.Screen name="journals" options={{
        title: "Journals",
        tabBarIcon: ({ color, focused }) => <PenBox color={focused ? color : "#666"} size={28} />
      }} />
      <Tabs.Screen name="profile" options={{
        title: "Profile",
        tabBarIcon: ({ color, focused }) => <User color={focused ? color : "#666"} size={28} />
      }} />
    </Tabs>
  )
}