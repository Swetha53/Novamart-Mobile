import {
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  ScrollView,
  Button,
  Image,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import colors from "../config/colors";
import {
  fetchUserDetails,
  getCartDetails,
  fetchProductDetails,
  updateCart,
  removeItemFromCart,
  placeUserOrder,
} from "../config/api";
import Header from "../components/Header";
import Ticker from "../components/Ticker";
import Counter from "../components/Counter";
import DeleteIcon from "../assets/delete.png";

const dimensions = Dimensions.get("screen");

const Checkout = ({ navigation }) => {
  const [userId, setUserId] = useState(null);
  const [paymentDetails, setPayemntDetails] = useState({});
  const [userDetails, setUserDetails] = useState({});
  const [cart, setCart] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [subTotalAmount, setSubtotaAmount] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [showTicker, setShowTicker] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    console.log("in effect");
    const loadUserId = async () => {
      const storedUserId = await AsyncStorage.getItem("userId");
      setUserId(storedUserId);
      loadCartDetails(storedUserId);
      loadUserDetails(storedUserId);
    };
    const loadPaymentDetails = async () => {
      const storedPaymentDetails = await AsyncStorage.getItem("paymentDetails");
      setPayemntDetails(JSON.parse(storedPaymentDetails));
    };

    loadUserId();
    loadPaymentDetails();
  }, []);

  const loadUserDetails = async (storedUserId) => {
    try {
      const tempUserDetails = await fetchUserDetails(storedUserId);
      setUserDetails(tempUserDetails.body[0]);
    } catch (err) {
      toggleTicker(true, err.message);
    } finally {
      // setLoading(false);
    }
  };
  const loadCartDetails = async (storedUserId) => {
    try {
      const tempCart = await getCartDetails(storedUserId);
      let tempSubTotal = 0;
      let tempItemCount = 0;
      const tempCartItems = await Promise.all(
        tempCart.body[0].cartItemList.map(async (item) => {
          const tempPartialCartItem = await loadDetails(item.productId);
          tempSubTotal += item.totalPrice;
          tempItemCount += item.quantity;
          return { ...tempPartialCartItem, ...item };
        })
      );
      setCart(tempCart.body[0]);
      setCartItems(tempCartItems);
      setSubtotaAmount(tempSubTotal);
      setItemCount(tempItemCount);
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
  const placeOrder = async () => {
    let requestBody = {
      userId: userId,
      userEmail: userDetails.email,
      totalAmount: cart.totalAmount,
      currencyCode: cart.currencyCode,
      customerName: `${userDetails.firstName} ${userDetails.lastName}`,
      orderItemList: [],
    };
    cartItems.map((item) => {
      const itemRequest = {
        orderItemId: "",
        orderId: "",
        productId: item.productId,
        merchantId: item.merchantId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        createdAt: 0,
      };
      requestBody.orderItemList.push(itemRequest);
    });
    try {
      // TODO set cart quantity in session storage so that cart icon can display that
      await placeUserOrder(requestBody);
    } catch (err) {
      toggleTicker(true, err.message);
    } finally {
      // setLoading(false);
      navigation.navigate("Dashboard");
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
      console.log("in finally");
      // setLoading(false);
      setCartItems([]);
      loadCartDetails(userId);
    }
  };

  const toggleTicker = () => {
    setShowTicker(value);
    setErrorMessage(message);
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
    addToCart(request);
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
      <Header navigation={navigation} />
      <Text style={styles.heading}>Checkout</Text>
      <ScrollView
        contentContainerStyle={styles.container_scroll}
        stickyHeaderIndices={cartItems && cartItems.length > 0 ? [1] : []}
      >
        <SafeAreaView style={styles.header}>
          <SafeAreaView style={styles.header_row}>
            <SafeAreaView style={styles.header_container}>
              <SafeAreaView>
                <Text style={styles.header_heading}>Delivering to</Text>
                <Text style={styles.header_heading}>
                  {userDetails.firstName} {userDetails.lastName}
                </Text>
              </SafeAreaView>
              <Text>{userDetails.address}</Text>
            </SafeAreaView>
            <SafeAreaView style={styles.header_container}>
              {paymentDetails.paymentType == "Cash" ? (
                <Text style={styles.header_heading}>
                  Paying with Cash on Delivery
                </Text>
              ) : (
                <Text style={styles.header_heading}>
                  Paying with VISA{" "}
                  {paymentDetails &&
                    paymentDetails.visaNumber &&
                    paymentDetails.visaNumber.substring(
                      paymentDetails.visaNumber.length - 4
                    )}
                </Text>
              )}
            </SafeAreaView>
          </SafeAreaView>
          <SafeAreaView style={styles.header_amount}>
            <SafeAreaView style={styles.header_amount_row}>
              <Text>
                Sub-Total Amount ({itemCount} Item
                {itemCount == 1 ? "" : "s"}):
              </Text>
              <Text>
                {cart.currencyCode} {subTotalAmount}
              </Text>
            </SafeAreaView>
            <SafeAreaView style={styles.header_amount_row}>
              <Text>Estimated Tax:</Text>
              <Text>
                {cart.currencyCode}{" "}
                {(cart.totalAmount - subTotalAmount).toFixed(1)}
              </Text>
            </SafeAreaView>
            <SafeAreaView style={styles.header_amount_row}>
              <Text style={styles.header_heading}>Total Amount:</Text>
              <Text style={styles.header_heading}>
                {cart.currencyCode} {cart.totalAmount}
              </Text>
            </SafeAreaView>
          </SafeAreaView>
        </SafeAreaView>
        {cartItems && cartItems.length > 0 && (
          <SafeAreaView style={styles.sticky_header}>
            <Button
              onPress={placeOrder}
              title="Place Order"
              color={colors.primary}
              accessibilityLabel="Place Order"
            />
          </SafeAreaView>
        )}
        {cartItems && cartItems.length ? (
          <SafeAreaView>
            {cartItems.map((item, index) => (
              <SafeAreaView key={index} style={styles.container_row}>
                <Image
                  source={{ uri: item.images[0] }}
                  style={styles.container_row_image}
                />
                <SafeAreaView style={styles.container_row_info}>
                  <Text style={styles.container_row_header}>{item.name}</Text>
                  <Text>
                    {item.currencyCode} {item.totalPrice}
                  </Text>
                </SafeAreaView>
                <Counter
                  quantity={item.quantity}
                  maxQuantity={item.quantityAvailable}
                  onChangeEventHandler={(value) => {
                    onCounterChange(value, item.productId);
                  }}
                />
                <Pressable
                  style={styles.container_row_delete}
                  onPress={() => {
                    deleteItem(item.productId);
                  }}
                >
                  <Image
                    source={DeleteIcon}
                    style={styles.container_row_icon}
                  />
                </Pressable>
              </SafeAreaView>
            ))}
          </SafeAreaView>
        ) : (
          <SafeAreaView style={styles.container_empty}>
            <Text style={styles.container_empty_heading}>
              No Items Added to Cart
            </Text>
            <Text style={styles.container_empty_body}>
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default Checkout;

const styles = StyleSheet.create({
  container: {
    width: dimensions.width,
    height: dimensions.height,
    backgroundColor: colors.primary,
    display: "flex",
    alignItems: "center",
  },
  heading: {
    width: "95%",
    marginTop: 10,
    fontWeight: 600,
    fontSize: 24,
  },
  container_scroll: {
    height: dimensions.height,
    width: (19 * dimensions.width) / 20,
    marginTop: 5,
  },
  header: {
    width: "100%",
    height: "20%",
    backgroundColor: colors.secondary,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
  },
  header_row: {
    height: "50%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  header_container: {
    width: "48%",
    height: "95%",
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.primary,
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
  },
  header_heading: {
    fontWeight: 600,
    fontSize: 16,
  },
  header_amount: {
    width: "96%",
    display: "flex",
    alignItems: "center",
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.primary,
  },
  header_amount_row: {
    width: "100%",
    margin: 3,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sticky_header: {
    backgroundColor: colors.secondary,
    width: "100%",
    height: "5%",
    shadowColor: colors.tertiary,
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  container_empty: {
    height: dimensions.height / 2,
    backgroundColor: colors.normal,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  container_empty_heading: {
    fontWeight: 600,
    fontSize: 18,
  },
  container_empty_body: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    width: (3 * dimensions.width) / 4,
  },
  container_row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "1%",
  },
  container_row_image: {
    width: "20%",
    aspectRatio: 1 / 1,
  },
  container_row_info: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    width: "30%",
  },
  container_row_header: {
    fontWeight: 600,
    fontSize: 18,
  },
  container_row_delete: {
    width: "7%",
    aspectRatio: 1 / 1,
  },
  container_row_icon: {
    height: "100%",
    aspectRatio: 1 / 1,
  },
});
