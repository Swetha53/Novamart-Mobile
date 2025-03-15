import {
  StyleSheet,
  Text,
  SafeAreaView,
  Dimensions,
  Image,
  ScrollView,
  Button,
} from "react-native";
import React, { useState } from "react";
import { useRoute } from "@react-navigation/native";
import colors from "../config/colors";
import { registerUser } from "../config/api";
import {
  isEmpty,
  isUnequal,
  isInvalidPattern,
  isNotGreaterThan,
} from "../config/validations";
import logo from "./../assets/reverse_logo.png";
import Input from "../components/Input";
import Ticker from "../components/Ticker";

const dimensions = Dimensions.get("screen");

const Register = ({ navigation }) => {
  const route = useRoute();
  const { accountType } = route.params;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState(0);
  const [gender, setGender] = useState("F");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState("");
  const [forceUpdate, setForceUpdate] = useState(0);
  const [showTicker, setShowTicker] = useState(false);
  const [tickerMessage, setTickerMessage] = useState("");
  const [formValidations, setFormValidations] = useState({
    email: {
      isValid: true,
      errorMessage: "",
      validationFun: ["isEmpty", "isInvalidPattern"],
      pattern: "^[a-zA-Z0-9]+@[a-zA-Z0-9.-]+.[a-zA-Z]$",
    },
    password: {
      isValid: true,
      errorMessage: "",
      validationFun: ["isEmpty", "isInvalidPattern"],
      pattern: "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$",
    },
    confirmPassword: {
      isValid: true,
      errorMessage: "",
      validationFun: ["isEmpty", "isUnequal"],
      value: "password",
    },
    firstName: {
      isValid: true,
      errorMessage: "",
      validationFun: ["isEmpty"],
    },
    lastName: {
      isValid: true,
      errorMessage: "",
      validationFun: ["isEmpty"],
    },
    age: {
      isValid: true,
      errorMessage: "",
      validationFun: ["isEmpty", "isNotGreaterThan"],
      pattern: 0,
    },
    phoneNumber: {
      isValid: true,
      errorMessage: "",
      validationFun: ["isEmpty", "isInvalidPattern"],
      pattern: "^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$",
    },
    address: {
      isValid: true,
      errorMessage: "",
      validationFun: ["isEmpty"],
    },
  });
  const validationFunList = {
    isEmpty,
    isUnequal,
    isInvalidPattern,
    isNotGreaterThan,
  };
  const formInputList = {
    email,
    password,
    confirmPassword,
    firstName,
    lastName,
    age,
    gender,
    phoneNumber,
    address,
    avatar,
  };
  const errorMessageList = {
    isEmpty: "This is a mandetory field please fill this and try again!",
    isInvalidPattern: "Invalid Value!",
    isNotGreaterThan: "Invalid Value!",
  };

  const toggleTicker = (value, message) => {
    setShowTicker(value);
    setTickerMessage(message);
  };
  const validateInput = (value, fieldName) => {
    let invalid = false;
    let tempFormValidations = formValidations;
    for (const element of tempFormValidations[fieldName].validationFun) {
      const value2 =
        element == "isUnequal"
          ? formInputList[tempFormValidations[fieldName].value]
          : tempFormValidations[fieldName].pattern;
      invalid = validationFunList[element](value, value2);
      if (invalid) {
        tempFormValidations[fieldName].errorMessage = errorMessageList[element];
        break;
      }
    }
    tempFormValidations[fieldName].isValid = !invalid;
    setFormValidations(tempFormValidations);
    setForceUpdate(forceUpdate + 1);
  };
  const validateFormAndSubmit = async () => {
    let isFormValid = true;
    Object.keys(formValidations).forEach((key) => {
      validateInput(formInputList[key], key);
      isFormValid = isFormValid && formValidations[key].isValid;
    });
    if (isFormValid) {
      try {
        const requestBody = {
          email: email,
          password: password,
          firstName: firstName,
          lastName: lastName,
          age: age,
          gender: gender,
          phone: phoneNumber,
          address: address,
          avatar: avatar,
          accountType: accountType == "merchant" ? "MERCHANT" : "CUSTOMER",
          preferences: [],
        };
        await registerUser(requestBody);
      } catch (err) {
        toggleTicker(true, err.message);
      } finally {
        // setLoading(false);
        navigation.navigate("Login");
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {showTicker && (
        <Ticker
          type="error"
          message={tickerMessage}
          closeTickerHandler={() => {
            toggleTicker(false, "");
          }}
        />
      )}
      <Image source={logo} style={styles.logo} />
      <SafeAreaView style={styles.mini_container}>
        <Text style={styles.header}>Register</Text>
        <Text style={styles.info}>
          Please fill all the fields having * as they are mandatory fields.
        </Text>
        <ScrollView contentContainerStyle={styles.form_container}>
          <Text>Email ID *</Text>
          <Input
            inputMode="email"
            inputType="emailAddress"
            error={formValidations["email"]}
            placeholder="Enter your Email ID"
            onChangeHandler={(value) => {
              setEmail(value);
              validateInput(value, "email");
            }}
          />
          <Text>Password *</Text>
          <Input
            inputMode="text"
            inputType="password"
            error={formValidations["password"]}
            placeholder="Enter your Password"
            onChangeHandler={(value) => {
              setPassword(value);
              validateInput(value, "password");
            }}
          />
          <Text>Confirm Password *</Text>
          <Input
            inputMode="text"
            inputType="password"
            error={formValidations["confirmPassword"]}
            placeholder="Re-enter your Password"
            onChangeHandler={(value) => {
              setConfirmPassword(value);
              validateInput(value, "confirmPassword");
            }}
          />
          <Text>First Name *</Text>
          <Input
            inputMode="text"
            inputType="text"
            error={formValidations["firstName"]}
            placeholder="Enter your First Name"
            onChangeHandler={(value) => {
              setFirstName(value);
              validateInput(value, "firstName");
            }}
          />
          <Text>Last Name *</Text>
          <Input
            inputMode="text"
            inputType="text"
            error={formValidations["lastName"]}
            placeholder="Enter your Last Name"
            onChangeHandler={(value) => {
              setLastName(value);
              validateInput(value, "lastName");
            }}
          />
          <Text>Age *</Text>
          <Input
            inputMode="numeric"
            inputType="none"
            error={formValidations["age"]}
            placeholder="Enter your Age"
            onChangeHandler={(value) => {
              setAge(value);
              validateInput(value, "age");
            }}
          />
          <Text>Gender: *</Text>
          <Input
            inputType="radio"
            placeholder={["F", "M", "Cannot Answer"]}
            defaultValue={gender}
            onChangeHandler={(value) => {
              setGender(value);
            }}
          />
          <Text>Phone Number *</Text>
          <Input
            inputMode="text"
            inputType="telephoneNumber"
            error={formValidations["phoneNumber"]}
            placeholder="Enter your Phone Number"
            onChangeHandler={(value) => {
              setPhoneNumber(value);
              validateInput(value, "phoneNumber");
            }}
          />
          <Text>Address *</Text>
          <Input
            inputMode="text"
            inputType="fullStreetAddress"
            error={formValidations["address"]}
            placeholder="Enter your Address"
            onChangeHandler={(value) => {
              setAddress(value);
              validateInput(value, "address");
            }}
          />
          <Text>Profile Picture</Text>
          <Input
            inputMode="text"
            inputType="none"
            placeholder="Enter your Profile Picture"
            onChangeHandler={(value) => {
              setAvatar(value);
            }}
          />
        </ScrollView>
        <Button
          onPress={validateFormAndSubmit}
          title="Sign Up!"
          color={colors.secondary}
          accessibilityLabel="Sign Up button"
        />
      </SafeAreaView>
    </SafeAreaView>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    width: dimensions.width,
    height: dimensions.height,
    backgroundColor: colors.primary,
    flex: 1,
  },
  logo: {
    height: "7%",
    aspectRatio: 1 / 1,
  },
  mini_container: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
  },
  header: {
    fontSize: 20,
    fontWeight: 600,
  },
  info: {
    width: "90%",
    margin: 12,
  },
  form_container: {
    width: "90%",
    margin: 10,
    height: dimensions.height,
  },
});
