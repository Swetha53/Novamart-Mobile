import {
  StyleSheet,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Text,
} from "react-native";
import React from "react";
import colors from "../config/colors";

const Input = (props) => {
  const {
    reverse,
    inputType,
    inputMode,
    placeholder,
    onChangeHandler,
    defaultValue,
    error,
  } = props;
  return (
    <>
      {inputType == "radio" ? (
        <SafeAreaView style={styles.radio__container}>
          {placeholder.map((value, index) => (
            <SafeAreaView key={index}>
              {value == defaultValue ? (
                <TouchableOpacity style={styles.radio}>
                  <SafeAreaView style={styles.radio__button}>
                    <SafeAreaView
                      style={styles.radio__button__selected}
                    ></SafeAreaView>
                  </SafeAreaView>
                  <Text>{value}</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.radio}
                  onPress={() => {
                    onChangeHandler(value);
                  }}
                >
                  <SafeAreaView style={styles.radio__button}></SafeAreaView>
                  <Text>{value}</Text>
                </TouchableOpacity>
              )}
            </SafeAreaView>
          ))}
        </SafeAreaView>
      ) : (
        <SafeAreaView style={styles.input_container}>
          <SafeAreaView
            style={[
              styles.container,
              reverse ? styles.container_reverse : "",
              error && !error.isValid ? styles.container_error : "",
            ]}
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
          {error && !error.isValid && (
            <Text style={styles.error_label}>{error.errorMessage}</Text>
          )}
        </SafeAreaView>
      )}
    </>
  );
};

export default Input;

const styles = StyleSheet.create({
  input_container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 62,
  },
  container: {
    height: 32,
    margin: 10,
    marginTop: 2,
    width: "100%",
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
  container_error: {
    borderColor: colors.errorBorder,
    backgroundColor: colors.error,
  },
  error_label: {
    color: colors.errorColor,
    fontWeight: 600,
  },
  input: {
    width: "95%",
    padding: 0,
  },
  radio__container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "90%",
  },
  radio: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  radio__button: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
    margin: 12,
  },
  radio__button__selected: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: colors.secondary,
  },
});
