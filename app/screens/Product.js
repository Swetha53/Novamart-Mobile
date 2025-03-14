import {
  StyleSheet,
  Text,
  SafeAreaView,
  Dimensions,
  View,
  Button,
} from "react-native";
import React, { useState, useEffect } from "react";
import colors from "../config/colors";
import Header from "../components/Header";
import Counter from "../components/Counter";
import Carousal from "../components/Carousal";
import { fetchProductDetails, updateCart } from "../config/api";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const dimensions = Dimensions.get("screen");

const Product = ({ navigation }) => {
  const route = useRoute();
  const { productId } = route.params;
  const [productData, setProductData] = useState([]);
  const [attributes, setAttributes] = useState({});
  const [quantity, setQuanity] = useState(0);
  const [userId, setUserId] = useState(null);

  const onCounterChange = (value) => {
    setQuanity(value);
  };

  const redirectToAR = () => {
    navigation.navigate("AR", { productId: productId });
  };

  const addToCart = async () => {
    const requestBody = {
      userId: userId,
      productId: productData.productId,
      quantity: quantity,
      unitPrice: productData.price,
      currencyCode: productData.currencyCode,
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

  useEffect(() => {
    const loadDetails = async () => {
      try {
        const tempProductDetails = await fetchProductDetails(productId);
        setProductData(tempProductDetails.body[0]);
        setAttributes(tempProductDetails.body[0].attributes);
      } catch (err) {
        // setError(err.message);
      } finally {
        // setLoading(false);
      }
    };
    const loadUserId = async () => {
      const storedUserId = await AsyncStorage.getItem("userId");
      setUserId(storedUserId);
    };

    loadUserId();
    loadDetails();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header navigation={navigation} />
      <View style={styles.minicontainer}>
        {productData && productData.images && (
          <Carousal images={productData.images} />
        )}
        <Button
          onPress={redirectToAR}
          title="View in your Room"
          color={colors.secondary}
          accessibilityLabel="View the product in your home"
        />
        <View style={styles.info}>
          <Text style={styles.title}>{productData.name}</Text>
          <Text style={styles.subtitle}>
            {productData.currencyCode} {productData.price}
          </Text>
          <View style={styles.attributes}>
            <Text>Quantity:</Text>
            <Counter
              maxQuantity={productData.quantityAvailable}
              onChangeEventHandler={onCounterChange}
            />
          </View>
          {Object.entries(attributes).map(([key, value], index) => (
            <View style={styles.attributes} key={index}>
              <Text style={styles.uppercase}>{key}:</Text>
              <Text style={styles.uppercase}>{value}</Text>
            </View>
          ))}
          <View style={styles.description}>
            <Text>Description:</Text>
            <Text>{productData.description}</Text>
          </View>
          <Button
            onPress={addToCart}
            title="Add to Cart"
            color={colors.secondary}
            accessibilityLabel="Add the product to cart"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Product;

const styles = StyleSheet.create({
  container: {
    width: dimensions.width,
    height: dimensions.height,
    backgroundColor: colors.primary,
  },
  minicontainer: {
    height: "100%",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  info: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    width: "100%",
    height: "50%",
  },
  title: {
    fontSize: 24,
    fontWeight: 800,
    marginBottom: "2%",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: "2%",
  },
  attributes: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    marginBottom: "1%",
  },
  uppercase: {
    textTransform: "capitalize",
  },
  description: {
    width: "90%",
    marginBottom: "1%",
  },
});
