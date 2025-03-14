import {
  StyleSheet,
  Text,
  SafeAreaView,
  Image,
  Dimensions,
  Pressable,
  Button,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import logo from "./../assets/reverse_logo.png";
import colors from "../config/colors";
import Input from "../components/Input";
import Ticker from "../components/Ticker";
import { checkLoginCredentials } from "../config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const dimensions = Dimensions.get("screen");
const HEIGHT = 1.2 * dimensions.height;

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showTicker, setShowTicker] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const toggleTicker = (value, message) => {
    setShowTicker(value);
    setErrorMessage(message);
  };
  const checkCredentials = async () => {
    let userData;
    try {
      userData = await checkLoginCredentials(email, password);
    } catch (err) {
      toggleTicker(true, err.message);
    } finally {
      // setLoading(false);
      await AsyncStorage.setItem("userId", userData.body[0].userId);
      await AsyncStorage.setItem("userName", userData.body[0].firstName);
      await AsyncStorage.setItem("avatar", userData.body[0].avatar);
      navigation.navigate("Profile");
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      {showTicker && (
        <Ticker
          type="error"
          message={errorMessage}
          closeTickerHandler={() => {
            toggleTicker(false, "");
          }}
        />
      )}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image source={logo} style={styles.logo} />
        <SafeAreaView style={styles.userlogin}>
          <Text style={styles.header}>Sign In or Create New Account</Text>
          <SafeAreaView style={styles.miniContainer}>
            <Text style={styles.label}>Email</Text>
            <Input
              inputMode="email"
              inputType="emailAddress"
              placeholder="Enter your Email ID"
              onChangeHandler={(value) => {
                setEmail(value);
              }}
            />
            <Text style={styles.label}>Password</Text>
            <Input
              inputMode="text"
              inputType="password"
              placeholder="Enter your Password"
              onChangeHandler={(value) => {
                setPassword(value);
              }}
            />
            <Pressable style={styles.link}>
              <Text style={styles.linkText}>Forgot Password?</Text>
            </Pressable>
            <Button
              onPress={checkCredentials}
              title="Log In"
              color={colors.secondary}
              accessibilityLabel="Log In Button"
            />
            <SafeAreaView style={styles.alternative}>
              <SafeAreaView style={styles.horizontalLine} />
              <Text>OR</Text>
              <SafeAreaView style={styles.horizontalLine} />
            </SafeAreaView>
            <SafeAreaView style={styles.footer}>
              <Text>New Here? </Text>
              <Pressable
                onPress={() => {
                  navigation.navigate("Register");
                }}
              >
                <Text style={styles.footer_link}>Sign Up!</Text>
              </Pressable>
            </SafeAreaView>
          </SafeAreaView>
        </SafeAreaView>
        <SafeAreaView style={styles.merchantlogin}>
          <Text style={styles.header}>Our Partner? </Text>
          <Text style={styles.subHeader}>Sign In Here</Text>
          <SafeAreaView
            style={[styles.miniContainer, styles.miniContainer_reverse]}
          >
            <Text style={styles.label}>Email ID</Text>
            <Input
              reverse={true}
              inputMode="email"
              inputType="emailAddress"
              placeholder="Enter your Email ID"
              onChangeHandler={(value) => {
                setEmail(value);
              }}
            />
            <Text style={styles.label}>Password</Text>
            <Input
              reverse={true}
              inputMode="text"
              inputType="password"
              placeholder="Enter your Password"
              onChangeHandler={(value) => {
                setPassword(value);
              }}
            />
            <Pressable style={styles.link}>
              <Text style={styles.linkText}>Forgot Password?</Text>
            </Pressable>
            <Button
              onPress={checkCredentials}
              title="Log In"
              color={colors.primary}
              accessibilityLabel="Log In Button"
            />
            <SafeAreaView style={styles.alternative}>
              <SafeAreaView style={styles.horizontalLine} />
              <Text>OR</Text>
              <SafeAreaView style={styles.horizontalLine} />
            </SafeAreaView>
            <SafeAreaView style={styles.footer}>
              <Text>New Here? </Text>
              <Pressable
                onPress={() => {
                  navigation.navigate("Register");
                }}
              >
                <Text style={styles.footer_link}>Sign Up!</Text>
              </Pressable>
            </SafeAreaView>
          </SafeAreaView>
        </SafeAreaView>
        <SafeAreaView style={styles.extraFooter} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    width: dimensions.width,
    height: HEIGHT,
    backgroundColor: colors.primary,
    flex: 1,
  },
  scrollContainer: {
    height: HEIGHT,
    width: "100%",
  },
  logo: {
    height: "7%",
    aspectRatio: 1 / 1,
  },
  userlogin: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "40%",
    width: "100%",
  },
  header: {
    fontSize: 20,
    fontWeight: 600,
    paddingBottom: "2%",
  },
  subHeader: {
    fontSize: 16,
    fontWeight: 600,
    paddingBottom: "2%",
  },
  miniContainer: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: colors.tertiary,
    width: "90%",
    height: "80%",
    borderRadius: 8,
  },
  miniContainer_reverse: {
    borderColor: colors.primary,
  },
  label: {
    width: "90%",
    margin: 10,
    marginBottom: 2,
    fontSize: 16,
  },
  link: {
    width: "90%",
    margin: 10,
    marginTop: 2,
  },
  linkText: {
    textDecorationColor: colors.tertiary,
    textDecorationStyle: "solid",
    textDecorationLine: "underline",
    fontWeight: 600,
    fontSize: 12,
  },
  alternative: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "90%",
    margin: "5%",
  },
  horizontalLine: {
    width: "40%",
    borderBottomColor: colors.tertiary,
    borderBottomWidth: 1,
  },
  footer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  footer_link: {
    textDecorationColor: colors.tertiary,
    textDecorationLine: "underline",
    textDecorationStyle: "solid",
    fontWeight: 600,
  },
  merchantlogin: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "40%",
    width: "100%",
    backgroundColor: colors.secondary,
  },
  extraFooter: {
    height: "13%",
    width: "100%",
    backgroundColor: colors.secondary,
  },
});
