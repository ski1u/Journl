import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Drawer = createDrawerNavigator();
const Tabs = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="timeline" component={() => <></>} />
            <Stack.Screen name="entry-detail" component={() => <></>} />
            <Stack.Screen name="edit-entry" component={() => <></>} />
        </Stack.Navigator>
    )
}; function NewEntryStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="new-entry" component={() => <></>} />
            <Stack.Screen name="preview" component={() => <></>} />
        </Stack.Navigator>
    )
}; function TabsNavigator() {
    return (
        <Tabs.Navigator>
            <Tabs.Screen name="home" component={HomeStack} />
            <Tabs.Screen name="new" component={NewEntryStack} />
            <Tabs.Screen name="profile" component={() => <></>} />
        </Tabs.Navigator>
    )
}

export default function AppNavigator() {
    return (
        <Drawer.Navigator>
            <Drawer.Screen name="main" component={TabsNavigator}
                options={{ headerShown: false }}
            />
            <Drawer.Screen name="settings" component={() => <></>} />
        </Drawer.Navigator>
    )
}