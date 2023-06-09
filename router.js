import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import RegistrationScreen from "./Screens/authScreen/RegistrationScreen";
import LoginScreen from "./Screens/authScreen/LoginScreen";
import Home from "./Screens/screensMain/Home";

const AuthStack = createStackNavigator();
const MainStack = createStackNavigator();

export const useRoute = (isAuth) => {
  if (!isAuth) {
    return (
      <AuthStack.Navigator>
        <AuthStack.Screen
          name="Registration"
          component={RegistrationScreen}
          options={{ headerShown: false, title: "Реєстрація" }}
        />
        <AuthStack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false, title: "Увійти" }}
        />
        <AuthStack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false, title: "Публикації" }}
        />
      </AuthStack.Navigator>
    );
  }
  return (
    <MainStack.Navigator>
      <MainStack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false, title: "Публикації" }}
      />
    </MainStack.Navigator>
  );
};
