import {
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Dimensions,
  Pressable,
} from "react-native";
import React from "react";
import logo from "./../assets/logo.png";
import profile from "./../assets/profile.png";
import cart from "./../assets/cart.png";
import colors from "../config/colors";

const dimensions = Dimensions.get("screen");

const Header = (props) => {
  const { navigation } = props;
  return (
    // TODO add actions
    <SafeAreaView style={styles.container}>
      <Image source={logo} style={styles.image} />
      <Text style={styles.search}>Search</Text>
      <Image source={profile} style={styles.profile} />
      <Pressable
        onPress={() => {
          navigation.navigate("Login");
        }}
      >
        <Text>Log In</Text>
      </Pressable>
      <Image source={cart} style={styles.image} />
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
});
