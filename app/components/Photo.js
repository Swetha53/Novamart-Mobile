import {
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Image,
  Pressable,
} from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateCart } from "../config/api";
import colors from "../config/colors";
import Cart from "../assets/cart.png";

const dimensions = Dimensions.get("screen");
const WIDTH = (45 * dimensions.width) / 100;
const HEIGHT = (5 * WIDTH) / 4;
const ICON_SIZE = 12;

const Photo = (props) => {
  const [userId, setUserId] = useState(null);
  const { details, navigation, toggleTicker } = props;

  useEffect(() => {
    const loadUserId = async () => {
      const storedUserId = await AsyncStorage.getItem("userId");
      setUserId(storedUserId);
    };

    loadUserId();
  }, []);

  const addToCart = async () => {
    const requestBody = {
      userId: userId,
      productId: details.productId,
      quantity: 1,
      unitPrice: details.price,
      currencyCode: details.currencyCode,
    };
    try {
      // TODO set cart quantity in session storage so that cart icon can display that
      await updateCart(requestBody);
    } catch (err) {
      toggleTicker(true, err.message);
    } finally {
      // setLoading(false);
    }
  };

  const navigateToProduct = () => {
    navigation.navigate("Product", { productId: details.productId });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Pressable style={styles.mini_container} onPress={navigateToProduct}>
        {details.images && details.images.length && (
          <Image source={{ uri: details.images[0] }} style={styles.image} />
        )}
        <Text style={styles.sub_header}>{details.name}</Text>
        <Text style={styles.header}>
          {details.currencyCode} {details.price}
        </Text>
      </Pressable>
      <SafeAreaView style={styles.footer}>
        <Pressable style={styles.footer_icon} onPress={addToCart}>
          <Image source={Cart} style={styles.cart} />
        </Pressable>
        <SafeAreaView style={styles.availability}>
          <SafeAreaView
            style={[
              styles.availability_icon,
              details.quantityAvailable == 0
                ? styles.availability_icon_grey
                : details.quantityAvailable <= 10
                ? styles.availability_icon_red
                : details.quantitySold + details.quantityReserved >=
                  details.quantityAvailable
                ? styles.availability_icon_orange
                : {},
            ]}
          />
          <Text>
            {details.quantityAvailable == 0
              ? "Out Of Stock"
              : details.quantityAvailable <= 10
              ? "Limited"
              : details.quantitySold + details.quantityReserved >=
                details.quantityAvailable
              ? "Selling Fast"
              : "In Stock"}
          </Text>
        </SafeAreaView>
        <SafeAreaView style={styles.reviews}>
          <Text>{details.reviews.length}</Text>
          <Text>Review{details.reviews.length == 1 ? "" : "s"}</Text>
        </SafeAreaView>
      </SafeAreaView>
    </SafeAreaView>
  );
};

export default Photo;

const styles = StyleSheet.create({
  container: {
    width: WIDTH,
    height: HEIGHT,
    borderWidth: 2,
    borderColor: colors.secondary,
    borderStyle: "dashed",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 10,
  },
  mini_container: {
    height: "80%",
    width: "100%",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
  },
  image: {
    width: "50%",
    aspectRatio: 1 / 1,
  },
  sub_header: {
    fontWeight: 600,
    fontSize: 16,
  },
  header: {
    fontWeight: 600,
    fontSize: 20,
  },
  footer: {
    height: "15%",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footer_icon: {
    width: "25%",
    aspectRatio: 1 / 1,
    backgroundColor: colors.secondary,
  },
  cart: {
    height: "100%",
    aspectRatio: 1 / 1,
  },
  availability: {
    height: "100%",
    width: "33%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  availability_icon: {
    height: ICON_SIZE,
    width: ICON_SIZE,
    borderRadius: ICON_SIZE,
    backgroundColor: colors.secondary,
  },
  availability_icon_grey: {
    backgroundColor: colors.normal,
  },
  availability_icon_red: {
    backgroundColor: colors.error,
  },
  availability_icon_orange: {
    backgroundColor: colors.warning,
  },
  reviews: {
    height: "100%",
    width: "30%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
