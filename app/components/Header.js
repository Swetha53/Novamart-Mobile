import {
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Dimensions,
  Pressable,
} from "react-native";
import React, { useState, useEffect } from "react";
import logo from "./../assets/logo.png";
import profile from "./../assets/profile.png";
import cart from "./../assets/cart.png";
import colors from "../config/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

const dimensions = Dimensions.get("screen");

const Header = (props) => {
  const { navigation } = props;
  const [userName, setUserName] = useState(null);
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      const storedUserName = await AsyncStorage.getItem("userName");
      const storedAvatar = await AsyncStorage.getItem("avatar");
      setUserName(storedUserName);
      setAvatar(storedAvatar);
    };
    loadUserData();
  }, []);
  return (
    // TODO Dashboard and Search
    <SafeAreaView style={styles.container}>
      <Image source={logo} style={styles.image} />
      <Text style={styles.search}>Search</Text>
      <Image
        source={avatar ? { uri: avatar } : profile}
        style={styles.profile}
        borderRadius={12}
      />
      <Pressable
        onPress={() => {
          userName ? {} : navigation.navigate("Login");
        }}
      >
        {userName ? <Text> Hi, {userName}</Text> : <Text>Log In</Text>}
      </Pressable>
      <Pressable
        onPress={() => {
          navigation.navigate("Cart");
        }}
        style={styles.cart_image_container}
      >
        <Image source={cart} style={styles.cart_image} />
      </Pressable>
    </SafeAreaView>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.secondary,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  search: {
    width: "50%",
  },
  image: {
    width: "10%",
    aspectRatio: 1 / 1,
  },
  profile: {
    width: "8%",
    aspectRatio: 1 / 1,
  },
  cart_image_container: {
    width: "10%",
    aspectRatio: 1 / 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  cart_image: {
    height: "80%",
    aspectRatio: 1 / 1,
  },
});
