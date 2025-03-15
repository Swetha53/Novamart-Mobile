import {
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { fetchAllProducts } from "../config/api";
import Ticker from "../components/Ticker";
import Header from "../components/Header";
import Photo from "../components/Photo";
import colors from "../config/colors";

const dimensions = Dimensions.get("screen");

const Dashboard = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [showTicker, setShowTicker] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const tempProducts = await fetchAllProducts();
        setProducts(tempProducts.body);
      } catch (err) {
        toggleTicker(true, err.message);
      } finally {
        // setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const toggleTicker = (value, message) => {
    setShowTicker(value);
    setErrorMessage(message);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
      <SafeAreaView style={styles.carousel}>
        <Text style={styles.carousel_header}>No Promotions Ongoing!</Text>
      </SafeAreaView>
      <SafeAreaView style={styles.products_container}>
        {products.map((product, index) => (
          <Photo
            key={index}
            details={product}
            navigation={navigation}
            toggleTicker={toggleTicker}
          />
        ))}
      </SafeAreaView>
    </ScrollView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    height: dimensions.height,
    width: dimensions.width,
    backgroundColor: colors.primary,
  },
  carousel: {
    height: "20%",
    backgroundColor: colors.normal,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  carousel_header: {
    color: colors.normalColor,
    fontWeight: 600,
    fontSize: 28,
    opacity: 0.6,
  },
  products_container: {
    display: "flex",
    justifyContent: "space-around",
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
