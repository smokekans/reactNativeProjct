import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import PostsScreen from "./PostsScreen";
import CreatePostsScreen from "./CreatePostsScreen";
import ProfileScreen from "./ProfileScreen";
import { Feather } from "@expo/vector-icons";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { styles } from "./Screens.styles";

const MainTab = createBottomTabNavigator();

const Home = ({ navigation }) => {
  const [isFocused, setIsFocuced] = useState(true);
  return (
    <MainTab.Navigator
      screenOptions={() => ({
        tabBarShowLabel: false,
        tabBarStyle: { height: 83 },

        tabBarInactiveTintColor: "rgba(33, 33, 33, 0.8)",
        tabBarActiveTintColor: "#FFFFFF",
      })}
    >
      <MainTab.Screen
        name="Posts"
        component={PostsScreen}
        options={({ route }) => ({
          headerShown: false,
          tabBarStyle: ((route) => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? "";
            if (routeName === "Comments" || routeName === "Map") {
              return { display: "none" };
            }
            return;
          })(route),
          tabBarIcon: ({ focused, size, color }) => (
            <TouchableOpacity
              onPress={() => {
                setIsFocuced(true);
                navigation.navigate("Posts");
              }}
            >
              <View style={styles.iconNav}>
                <Feather name="grid" size={24} color="rgba(33, 33, 33, 0.8)" />
              </View>
            </TouchableOpacity>
          ),
        })}
      />
      <MainTab.Screen
        name="Create"
        component={CreatePostsScreen}
        options={({ route }) => ({
          tabBarStyle: { display: "none" },
          tabBarIcon: ({ focused, size, color }) => (
            <View
              style={
                isFocused
                  ? { ...styles.iconNav, backgroundColor: "#FF6C00" }
                  : styles.iconNav
              }
            >
              <Feather
                name="plus"
                size={24}
                color={isFocused ? "#ffffff" : color}
              />
            </View>
          ),
          headerTitle: "Створити публікацію",
          headerTitleAlign: "center",
          headerStyle: {
            height: 88,
            backgroundColor: "#FFFFFF",
            shadowColor: "rgba(0, 0, 0, 0.3)",
            shadowOffset: { width: 0, height: 0.5 },
            shadowRadius: 1.35914,
          },
          headerTitleStyle: {
            fontFamily: "Roboto-Medium",
            fontStyle: "normal",
            fontSize: 17,
            lineHeight: 22,
            letterSpacing: -0.408,
          },
          headerTintColor: "#212121",
          headerLeft: (focused, size, color) => (
            <TouchableOpacity
              style={{ marginLeft: 16, width: 20, height: 20 }}
              onPress={() => {
                navigation.navigate("Posts"), setIsFocuced(true);
              }}
            >
              <Feather
                name="arrow-left"
                size={24}
                color="rgba(33, 33, 33, 0.8)"
              />
            </TouchableOpacity>
          ),
        })}
      />
      <MainTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, size, color }) => (
            <TouchableOpacity
              style={
                !isFocused
                  ? { ...styles.iconNav, backgroundColor: "#FF6C00" }
                  : styles.iconNav
              }
              onPress={() => {
                setIsFocuced(false);
                navigation.navigate("Profile");
              }}
            >
              <View>
                <Feather
                  name="user"
                  size={24}
                  color={!isFocused ? "#ffffff" : color}
                />
              </View>
            </TouchableOpacity>
          ),
        })}
      />
    </MainTab.Navigator>
  );
};

export default Home;
