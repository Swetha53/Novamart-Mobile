import {
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Button,
  Modal,
  Image,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import colors from "../config/colors";
import {
  getCartDetails,
  fetchProductDetails,
  updateCart,
  removeItemFromCart,
} from "../config/api";
import { isEmpty, isInvalidPattern } from "../config/validations";
import Ticker from "../components/Ticker";
import Header from "../components/Header";
import Counter from "../components/Counter";
import Input from "../components/Input";
import DeleteIcon from "../assets/delete.png";

const dimensions = Dimensions.get("screen");

const Cart = ({ navigation }) => {
  const [userId, setUserId] = useState(null);
  const [cart, setCart] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [subTotalAmount, setSubtotaAmount] = useState(0);
  const [showTicker, setShowTicker] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalDetails, setModalDetails] = useState({});
  const [paymentType, setPayemntType] = useState("Cash");
  const [visaNumber, setVisaNumber] = useState("");
  const [visaValidation, setVisaValidation] = useState({
    isValid: true,
    errorMessage: "",
    validationFun: ["isEmpty", "isInvalidPattern"],
    pattern: "^4[0-9]{12}(?:[0-9]{3})?$",
  });
  const [forceUpdate, setForceUpdate] = useState(0);
  const validationFunList = {
    isEmpty,
    isInvalidPattern,
  };
  const errorMessageList = {
    isEmpty: "This is a mandetory field please fill this and try again!",
    isInvalidPattern: "Invalid Value!",
  };

  useEffect(() => {
    const loadUserId = async () => {
      const storedUserId = await AsyncStorage.getItem("userId");
      setUserId(storedUserId);
      loadCartDetails(storedUserId);
    };

    loadUserId();
  }, []);

  const loadCartDetails = async (storedUserId) => {
    try {
      const tempCart = await getCartDetails(storedUserId);
      let tempSubTotal = 0;
      const tempCartItems = await Promise.all(
        tempCart.body[0].cartItemList.map(async (item) => {
          const tempPartialCartItem = await loadDetails(item.productId);
          tempSubTotal += item.totalPrice;
          return { ...tempPartialCartItem, ...item };
        })
      );
      setCart(tempCart.body[0]);
      setCartItems(tempCartItems);
      setSubtotaAmount(tempSubTotal);
    } catch (err) {
      toggleTicker(true, err.message);
    } finally {
      // setLoading(false);
    }
  };
  const loadDetails = async (productId) => {
    try {
      const tempProductDetails = await fetchProductDetails(productId);
      return tempProductDetails.body[0];
    } catch (err) {
      toggleTicker(true, err.message);
      return {};
    } finally {
      // setLoading(false);
    }
  };
  const addToCart = async (request) => {
    const requestBody = {
      userId: userId,
      productId: request.productId,
      quantity: request.quantity,
      unitPrice: request.unitPrice,
      currencyCode: request.currencyCode,
    };
    try {
      // TODO set cart quantity in session storage so that cart icon can display that
      await updateCart(requestBody);
    } catch (err) {
      toggleTicker(true, err.message);
    } finally {
      // setLoading(false);
      loadCartDetails(userId);
    }
  };
  const deleteItem = async (productId) => {
    try {
      await removeItemFromCart(userId, productId);
    } catch (err) {
      toggleTicker(true, err.message);
      return {};
    } finally {
      // setLoading(false);
      loadCartDetails();
    }
  };

  const toggleTicker = () => {
    setShowTicker(value);
    setErrorMessage(message);
  };
  const openPaymentModal = () => {
    setShowModal(true);
    setModalDetails({
      heading: "Please select your Payment Method",
    });
  };
  const closePaymentModal = () => {
    setShowModal(false);
  };
  const validateVisaValue = (value) => {
    setVisaNumber(value);
    let invalid = false;
    let tempVisaValidations = visaValidation;
    for (const element of tempVisaValidations.validationFun) {
      invalid = validationFunList[element](value, tempVisaValidations.pattern);
      if (invalid) {
        tempVisaValidations.errorMessage = errorMessageList[element];
        break;
      }
    }
    tempVisaValidations.isValid = !invalid;
    setVisaValidation(tempVisaValidations);
    setForceUpdate(forceUpdate + 1);
  };
  const validateAndProceedToCheckout = async () => {
    let formValid = false;
    if (paymentType == "VISA") {
      validateVisaValue(visaNumber);
      formValid = visaValidation.isValid;
    } else {
      formValid = true;
    }
    if (formValid) {
      setShowModal(false);
      await AsyncStorage.setItem(
        "paymentDetails",
        JSON.stringify({
          paymentType,
          visaNumber,
        })
      );
      navigation.navigate("Checkout");
    }
  };
  const onCounterChange = (value, productId) => {
    setCartItems((prevCartItems) =>
      prevCartItems.map((item) =>
        item.productId === productId ? { ...item, quantity: value } : item
      )
    );
    const foundItem = cartItems.find((item) => item.productId === productId);
    const request = {
      productId: foundItem.productId,
      quantity: value,
      unitPrice: foundItem.unitPrice,
      currencyCode: foundItem.currencyCode,
    };
    console.log(request);
    addToCart(request);
  };

  return (
    <SafeAreaView style={styles.cart}>
      {showTicker && (
        <Ticker
          type="error"
          message={errorMessage}
          closeTickerHandler={() => {
            toggleTicker(false, "");
          }}
        />
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={closePaymentModal}
      >
        <SafeAreaView style={styles.modal__container}>
          <SafeAreaView style={styles.modal}>
            <Text style={styles.modal__header}>{modalDetails.heading}</Text>
            <SafeAreaView style={styles.modal__row}>
              <Text style={styles.modal__label}>Payment Type: </Text>
              <SafeAreaView style={styles.modal__input}>
                <Input
                  inputType="radio"
                  placeholder={["Cash", "VISA"]}
                  defaultValue={paymentType}
                  onChangeHandler={(value) => {
                    setPayemntType(value);
                  }}
                />
              </SafeAreaView>
            </SafeAreaView>
            {paymentType == "Cash" && (
              <SafeAreaView style={styles.model__minicontainer}>
                <Text style={styles.model__info}>
                  You have selected Cash on Delivery as method of Payment.
                  Please ensure you have the exact amount at the time of
                  delivery.
                </Text>
              </SafeAreaView>
            )}
            {paymentType == "VISA" && (
              <SafeAreaView>
                <Text>Please Enter your VISA card number</Text>
                <Input
                  inputMode="text"
                  inputType="text"
                  error={visaValidation}
                  placeholder="xxxx xxxx xxxx xxxx"
                  onChangeHandler={(value) => {
                    validateVisaValue(value);
                  }}
                />
              </SafeAreaView>
            )}
            <Button
              onPress={validateAndProceedToCheckout}
              title="Save Payment Method"
              color={colors.secondary}
              accessibilityLabel="Save Payment Method"
            />
          </SafeAreaView>
        </SafeAreaView>
      </Modal>
      <Header navigation={navigation} />
      <ScrollView
        contentContainerStyle={styles.cart__scroll}
        stickyHeaderIndices={cartItems && cartItems.length > 0 ? [1] : []}
      >
        <SafeAreaView style={styles.cart__total}>
          <SafeAreaView style={styles.cart__total__row}>
            <Text style={styles.sub__header}>
              Sub-Total Amount ({cartItems.length} Item
              {cartItems.length == 1 ? "" : "s"}):
            </Text>
            <Text style={styles.sub__header}>
              {cart.currencyCode} {subTotalAmount}
            </Text>
          </SafeAreaView>
          <SafeAreaView style={styles.cart__total__row}>
            <Text style={styles.sub__header}>Estimated Tax:</Text>
            <Text style={styles.sub__header}>
              {cart.currencyCode}{" "}
              {(cart.totalAmount - subTotalAmount).toFixed(1)}
            </Text>
          </SafeAreaView>
          <SafeAreaView style={styles.cart__total__row}>
            <Text style={styles.header}>Total Amount:</Text>
            <Text style={styles.header}>
              {cart.currencyCode} {cart.totalAmount}
            </Text>
          </SafeAreaView>
        </SafeAreaView>
        {cartItems && cartItems.length > 0 && (
          <SafeAreaView style={styles.cart__header}>
            <Button
              onPress={openPaymentModal}
              title="Proceed to Checkout"
              color={colors.primary}
              accessibilityLabel="Proceed to Checkout"
            />
          </SafeAreaView>
        )}
        {(!cartItems || cartItems.length == 0) && (
          <SafeAreaView style={styles.cart__empty}>
            <Text style={styles.header}>No Items Added to Cart</Text>
            <Text style={styles.cart__empty__container}>
              Please go to our
              <Button
                onPress={() => {
                  navigation.navigate("Dashboard");
                }}
                title="Dashboard"
                color={colors.secondary}
                accessibilityLabel="Dashboard"
              />
              and explore our wide range of products!!
            </Text>
          </SafeAreaView>
        )}
        {cartItems && cartItems.length > 0 && (
          <SafeAreaView style={styles.cart__items}>
            {cartItems.map((item, index) => (
              <SafeAreaView key={index} style={styles.cart__item}>
                <Image source={{ uri: item.images[0] }} style={styles.image} />
                <SafeAreaView style={styles.cart__item__details}>
                  <Text style={styles.cart__item__header}>{item.name}</Text>
                  <Text
                    style={[
                      styles.cart__item__label,
                      item.quantityAvailable == 0
                        ? styles.cart__item__label_grey
                        : item.quantityAvailable <= 10
                        ? styles.cart__item__label_red
                        : item.quantitySold + item.quantityReserved >=
                          item.quantityAvailable
                        ? styles.cart__item__label_orange
                        : {},
                    ]}
                  >
                    {item.quantityAvailable == 0
                      ? "Out of Stock"
                      : item.quantityAvailable <= 10
                      ? "Limited Quantity Available"
                      : item.quantitySold + item.quantityReserved >=
                        item.quantityAvailable
                      ? "Selling Fast"
                      : "In Stock"}
                  </Text>
                  <Text>
                    {item.currencyCode} {item.totalPrice}
                  </Text>
                </SafeAreaView>
                <Counter
                  maxQuantity={item.quantityAvailable}
                  onChangeEventHandler={(value) => {
                    onCounterChange(value, item.productId);
                  }}
                />
                <Pressable
                  style={styles.icon_button}
                  onPress={() => {
                    deleteItem(item.productId);
                  }}
                >
                  <Image source={DeleteIcon} style={styles.icon} />
                </Pressable>
              </SafeAreaView>
            ))}
          </SafeAreaView>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Cart;

const styles = StyleSheet.create({
  modal__container: {
    width: dimensions.width,
    height: dimensions.height,
    backgroundColor: "rgba(211, 214, 216, 0.9)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "100%",
    aspectRatio: 3 / 2,
    backgroundColor: colors.primary,
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
  },
  modal__header: {
    fontWeight: 600,
    fontSize: 18,
    textAlign: "center",
  },
  modal__row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "90%",
  },
  modal__label: {
    fontSize: 16,
  },
  modal__input: {
    width: "50%",
  },
  model__minicontainer: {
    width: "90%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  model__info: {
    fontWeight: 600,
  },
  sub__header: {
    fontSize: 14,
  },
  header: {
    fontWeight: 600,
    fontSize: 18,
  },
  cart: {
    width: dimensions.width,
    height: dimensions.height,
    backgroundColor: colors.primary,
    flex: 1,
  },
  cart__scroll: {
    height: dimensions.height,
    width: "100%",
    marginTop: 5,
  },
  cart__total: {
    backgroundColor: colors.secondary,
    width: "100%",
  },
  cart__total__row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    margin: "1.5%",
  },
  cart__header: {
    backgroundColor: colors.secondary,
    width: "100%",
    height: "5%",
    shadowColor: colors.tertiary,
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  cart__empty: {
    height: (3 * dimensions.height) / 4,
    backgroundColor: colors.normal,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  cart__empty__container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    width: (3 * dimensions.width) / 4,
  },
  cart__items: {},
  cart__item: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "1%",
  },
  image: {
    width: "20%",
    aspectRatio: 1 / 1,
  },
  cart__item__details: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    width: "30%",
  },
  cart__item__header: {
    fontWeight: 600,
    fontSize: 18,
  },
  cart__item__label: {
    color: colors.secondary,
    fontWeight: 500,
  },
  cart__item__label_grey: {
    color: colors.normalColor,
  },
  cart__item__label_orange: {
    color: colors.warningColor,
  },
  cart__item__label_red: {
    color: colors.errorColor,
  },
  icon_button: {
    width: "7%",
    aspectRatio: 1 / 1,
  },
  icon: {
    height: "100%",
    aspectRatio: 1 / 1,
  },
});
