import { StyleSheet, Text, SafeAreaView, Pressable } from "react-native";
import React from "react";
import colors from "../config/colors";

const Ticker = (props) => {
  const { type, message, closeTickerHandler } = props;
  return (
    <SafeAreaView
      style={[
        styles.container,
        type == "error" ? styles.errorContainer : styles.normalContainer,
      ]}
    >
      <Text
        style={[
          styles.text,
          type == "error" ? styles.errorText : styles.normalText,
        ]}
      >
        {message}
      </Text>
      <Pressable onPress={closeTickerHandler}>
        <Text
          style={[
            styles.text,
            type == "error" ? styles.errorText : styles.normalText,
          ]}
        >
          X
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default Ticker;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    margin: 30,
    width: "80%",
    borderRadius: 8,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderStyle: "solid",
    zIndex: 10,
  },
  errorContainer: {
    backgroundColor: colors.error,
    borderColor: colors.errorBorder,
  },
  normalContainer: {
    backgroundColor: colors.normal,
    borderColor: colors.normalBorder,
  },
  text: {
    margin: 10,
  },
  errorText: {
    color: colors.errorColor,
  },
  normalText: {
    color: colors.normalColor,
  },
});
