import { StyleSheet, TextInput, SafeAreaView } from "react-native";
import React from "react";
import colors from "../config/colors";

const Input = (props) => {
  const { reverse, inputType, inputMode, placeholder, onChangeHandler } = props;
  return (
    <SafeAreaView
      style={[styles.container, reverse ? styles.container_reverse : ""]}
    >
      <TextInput
        inputMode={inputMode}
        textContentType={inputType}
        placeholder={placeholder}
        onChangeText={onChangeHandler}
        style={styles.input}
        placeholderTextColor={colors.tertiary}
      />
    </SafeAreaView>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {
    height: 32,
    margin: 10,
    marginTop: 2,
    borderStyle: "solid",
    borderColor: colors.secondary,
    borderWidth: 1,
    borderRadius: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  container_reverse: {
    borderColor: colors.primary,
  },
  input: {
    width: "95%",
    height: "100%",
  },
});
