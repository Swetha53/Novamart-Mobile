import {
  StyleSheet,
  Text,
  SafeAreaView,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import colors from "../config/colors";
import star from "../assets/star.png";
import filledStar from "../assets/fill_star.png";
import imagePlaceholder from "../assets/image.png";
import OrderTable from "../components/OrderTable";
import Ticker from "../components/Ticker";
import {
  fetchUserDetails,
  fetchUserReviews,
  fetchUserOrders,
} from "../config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const dimensions = Dimensions.get("screen");

const Profile = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [userData, setUserData] = useState({});
  const [userReviews, setUserReviews] = useState([]);
  const [orders, setOrders] = useState([]);
  const [userId, setUserId] = useState(null);
  const [showTicker, setShowTicker] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadUserId = async () => {
      const storedUserId = await AsyncStorage.getItem("userId");
      setUserId(storedUserId);
      loadUserData(storedUserId);
      loadUserReviews(storedUserId);
    };

    const loadUserData = async (storedId = "") => {
      const requestId = storedId ? storedId : userId;
      try {
        const tempUserDetails = await fetchUserDetails(requestId);
        setUserData(tempUserDetails.body[0]);
      } catch (err) {
        toggleTicker(true, err.message);
      } finally {
        // setLoading(false);
      }
    };

    const loadUserReviews = async (storedId = "") => {
      const requestId = storedId ? storedId : userId;
      try {
        const tempUserReviews = await fetchUserReviews(requestId);
        setUserReviews(tempUserReviews.body);
      } catch (err) {
        toggleTicker(true, err.message);
      } finally {
        // setLoading(false);
      }
    };

    loadUserId();
  }, []);

  const loadUserOrders = async () => {
    try {
      const tempUserOrders = await fetchUserOrders(userId);
      setOrders(tempUserOrders.body);
    } catch (err) {
      toggleTicker(true, err.message);
    } finally {
      // setLoading(false);
    }
  };

  const tabChange = (value) => {
    setActiveTab(value);
    if (value == 1) {
      loadUserOrders();
    }
  };
  const toggleTicker = (value, message) => {
    setShowTicker(value);
    setErrorMessage(message);
  };

  return (
    <SafeAreaView>
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
      {!userData && (
        <SafeAreaView style={styles.container__empty}>
          <Text style={styles.container__empty__header}>No Profile Found</Text>
          <Text style={styles.container__empty__text}>
            You might not be logged in. Please log in to see your profile!!
          </Text>
        </SafeAreaView>
      )}
      {userData && (
        <SafeAreaView style={styles.container}>
          <SafeAreaView style={styles.pageheader}>
            <Image
              source={{ uri: userData.avatar }}
              style={styles.avatar}
              borderRadius={10}
            />
            <Pressable
              onPress={() => {
                tabChange(0);
              }}
              style={[styles.tab, activeTab == 0 ? {} : styles.passiveTab]}
            >
              <Text>Profile</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                tabChange(1);
              }}
              style={[styles.tab, activeTab == 1 ? {} : styles.passiveTab]}
            >
              <Text>Order</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                tabChange(2);
              }}
              style={[
                styles.tab,
                activeTab == 2 ? {} : styles.passiveTab,
                styles.disabledTab,
              ]}
            >
              <Text>Wishlist</Text>
            </Pressable>
          </SafeAreaView>
          {activeTab == 0 && (
            <SafeAreaView style={styles.infocontainer}>
              <SafeAreaView style={styles.inforow}>
                <Text style={styles.infolabel}>First Name:</Text>
                <Text style={styles.infotext}>{userData.firstName}</Text>
              </SafeAreaView>
              <SafeAreaView style={styles.inforow}>
                <Text style={styles.infolabel}>Last Name:</Text>
                <Text style={styles.infotext}>{userData.lastName}</Text>
              </SafeAreaView>
              <SafeAreaView style={styles.inforow}>
                <Text style={styles.infolabel}>Age:</Text>
                <Text style={styles.infotext}>{userData.age}</Text>
              </SafeAreaView>
              <SafeAreaView style={styles.inforow}>
                <Text style={styles.infolabel}>Gender:</Text>
                <Text style={styles.infotext}>{userData.gender}</Text>
              </SafeAreaView>
              <SafeAreaView style={styles.inforow}>
                <Text style={styles.infolabel}>Email:</Text>
                <Text style={styles.infotext}>{userData.email}</Text>
              </SafeAreaView>
              <SafeAreaView style={styles.inforow}>
                <Text style={styles.infolabel}>Address:</Text>
                <Text style={styles.infotext}>{userData.address}</Text>
              </SafeAreaView>
              <SafeAreaView style={styles.reviewcontainer}>
                <ScrollView
                  contentContainerStyle={styles.reviewscrollcontainer}
                >
                  <Text style={styles.reviewheading}>Your Reviews:</Text>
                  {userReviews.map((userReview, idx) => (
                    <SafeAreaView key={idx} style={styles.reviewminicontainer}>
                      <SafeAreaView style={styles.ratingcontainer}>
                        {Array.from(
                          { length: userReview.rating },
                          (_, i) => i + 1
                        ).map((num) => (
                          <Image
                            source={filledStar}
                            key={"fill-" + num}
                            style={styles.rating}
                          />
                        ))}
                        {Array.from(
                          { length: 5 - userReview.rating },
                          (_, i) => i + 1
                        ).map((num) => (
                          <Image
                            source={star}
                            key={"unfilled-" + num}
                            style={styles.rating}
                          />
                        ))}
                      </SafeAreaView>
                      <Text style={styles.reviewtitle}>{userReview.title}</Text>
                      <Text style={styles.reviewcomment}>
                        {userReview.comment}
                      </Text>
                      <SafeAreaView style={styles.reviewfooter}>
                        {userReview.imageUrl &&
                        userReview.imageUrl.length > 0 ? (
                          <Image
                            source={{ uri: userReview.imageUrl[0] }}
                            style={styles.reviewimage}
                          />
                        ) : (
                          <Image
                            source={imagePlaceholder}
                            style={styles.reviewimage}
                          />
                        )}
                        <Pressable
                          onPress={() => {
                            navigation.navigate("Product", {
                              productId: userReview.productId,
                            });
                          }}
                        >
                          <Text style={styles.reviewlink}>See Product</Text>
                        </Pressable>
                      </SafeAreaView>
                    </SafeAreaView>
                  ))}
                </ScrollView>
              </SafeAreaView>
            </SafeAreaView>
          )}
          {activeTab == 1 && (
            <SafeAreaView style={styles.ordercontainer}>
              <ScrollView style={styles.orderscrollcontainer}>
                {orders.map((order, idx) => (
                  <OrderTable
                    order={order}
                    key={idx}
                    name={userData.firstName + " " + userData.lastName}
                  />
                ))}
              </ScrollView>
            </SafeAreaView>
          )}
        </SafeAreaView>
      )}
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    width: dimensions.width,
    height: dimensions.height,
    display: "flex",
    alignItems: "center",
  },
  container__empty: {
    backgroundColor: colors.normal,
    width: dimensions.width,
    height: dimensions.height,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  container__empty__header: {
    fontWeight: 600,
    fontSize: 24,
  },
  container__empty__text: {
    width: "60%",
    textAlign: "center",
  },
  pageheader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: "2%",
    marginBottom: "2%",
    width: "95%",
  },
  avatar: {
    backgroundColor: colors.secondary,
    width: "25%",
    aspectRatio: 1 / 1,
  },
  tab: {
    backgroundColor: colors.secondary,
    width: "20%",
    aspectRatio: 3 / 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "15%",
  },
  passiveTab: {
    backgroundColor: colors.primary,
    borderColor: colors.secondary,
    borderWidth: 1,
    borderStyle: "solid",
  },
  disabledTab: {
    pointerEvents: "none",
    opacity: 0.4,
  },
  infocontainer: {
    width: "90%",
  },
  inforow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: "1%",
    marginBottom: "1%",
  },
  infolabel: {
    fontSize: 18,
    fontWeight: 500,
    width: "30%",
  },
  infotext: {
    fontSize: 18,
    width: "70%",
  },
  reviewcontainer: {
    width: "100%",
    height: "50%",
    marginTop: "1%",
    backgroundColor: colors.secondary,
    borderRadius: "8%",
    display: "flex",
    alignItems: "center",
  },
  reviewscrollcontainer: {
    display: "flex",
    alignItems: "center",
  },
  reviewheading: {
    fontSize: 18,
    fontWeight: 600,
    textDecorationStyle: "solid",
    textDecorationLine: "underline",
  },
  reviewminicontainer: {
    width: "90%",
    aspectRatio: 2 / 1,
    backgroundColor: colors.primary,
    borderRadius: "8%",
    margin: "2%",
    display: "flex",
    alignItems: "center",
  },
  ratingcontainer: {
    height: "20%",
    width: "90%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  rating: {
    width: "7%",
    aspectRatio: 1 / 1,
  },
  reviewtitle: {
    width: "90%",
    fontSize: 16,
    fontWeight: 500,
    maxHeight: "10%",
  },
  reviewcomment: {
    width: "90%",
    height: "45%",
  },
  reviewfooter: {
    display: "flex",
    height: "20%",
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reviewimage: {
    width: "10%",
    aspectRatio: 1 / 1,
  },
  reviewlink: {
    color: colors.secondary,
    textDecorationStyle: "solid",
    textDecorationLine: "underline",
    fontSize: 16,
    fontWeight: 600,
  },
  ordercontainer: {
    height: "70%",
    width: "90%",
  },
  orderscrollcontainer: {
    flex: 1,
  },
});
