import { StatusBar } from "expo-status-bar";
import { useDeviceOrientation } from "@react-native-community/hooks";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Product from "./app/screens/Product";
import Profile from "./app/screens/Profile";
import AR from "./app/screens/AugmentedReality";
import Login from "./app/screens/Login";
import Register from "./app/screens/Register";

const Stack = createNativeStackNavigator();

export default function App() {
  const { landscape } = useDeviceOrientation();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AR">
        <Stack.Screen
          name="Product"
          component={Product}
          initialParams={{ productId: null }}
        />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="AR" component={AR} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
