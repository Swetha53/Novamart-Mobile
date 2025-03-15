import { Text, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import {
  ViroARScene,
  ViroText,
  ViroBox,
  Viro3DObject,
  ViroAmbientLight,
  ViroSpotLight,
  ViroQuad,
  ViroNode,
  ViroConstants,
} from "@reactvision/react-viro";
import { fetchProductModel } from "../config/api";
import Ticker from "../components/Ticker";

const AugmentedReality = () => {
  const route = useRoute();
  const { productId } = route.params;
  const [text, setText] = useState("Initializing AR...");
  const [hasARInitialized, setHasARInitialized] = useState(false);
  const [modelData, setModelData] = useState({});
  const [showTicker, setShowTicker] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadProductModel = async () => {
      try {
        const tempModelData = await fetchProductModel(productId);
        tempModelData[0].asset_url.replace(/(\.glb).*$/, ".glb");
        setModelData(tempModelData[0]);
      } catch (err) {
        toggleTicker(true, err.message);
      } finally {
        // setLoading(false);
      }
    };

    loadProductModel();
  }, []);

  const _onTrackingUpdated = (state, reason) => {
    if (
      !this.state.hasARInitialized &&
      state == ViroConstants.TRACKING_NORMAL
    ) {
      setHasARInitialized(true);
      setText("Hello World!!");
    }
  };
  const toggleTicker = (value, message) => {
    setShowTicker(value);
    setErrorMessage(message);
  };

  return (
    <ViroARScene onTrackingUpdated={_onTrackingUpdated}>
      {showTicker && (
        <Ticker
          type="error"
          message={errorMessage}
          closeTickerHandler={() => {
            toggleTicker(false, "");
          }}
        />
      )}
      <ViroText
        text={text}
        scale={[0.5, 0.5, 0.5]}
        position={[0, 0, -1]}
        style={styles.helloWorldTextStyle}
      />
      <ViroBox
        position={[0, -0.5, -1]}
        animation={{ name: "rotate", run: true, loop: true }}
        scale={[0.3, 0.3, 0.1]}
        materials={["grid"]}
      />
      <ViroAmbientLight color={"#aaaaaa"} influenceBitMask={1} />
      <ViroSpotLight
        innerAngle={5}
        outerAngle={90}
        direction={[0, -1, -0.2]}
        position={[0, 3, 1]}
        color="#aaaaaa"
        castsShadow={true}
      />
      <ViroNode
        position={[-0.5, -0.5, -0.5]}
        dragType="FixedToWorld"
        onDrag={() => {}}
      >
        <ViroSpotLight
          innerAngle={5}
          outerAngle={45}
          direction={[0, -1, -0.2]}
          position={[0, 3, 0]}
          color="#ffffff"
          castsShadow={true}
          influenceBitMask={2}
          shadowMapSize={2048}
          shadowNearZ={2}
          shadowFarZ={5}
          shadowOpacity={0.7}
        />
        {/* {modelData && modelData.asset_url && ( */}
        <Viro3DObject
          source={{
            uri: "https://reggvbnnkqmprlkojomx.supabase.co/storage/v1/object/public/Products/8989f64c-0ddc-4416-94f4-cd7cadc32131.glb",
          }}
          position={[0, 0.2, 0]}
          scale={[0.2, 0.2, 0.2]}
          type="GLB"
          lightReceivingBitMask={3}
          shadowCastingBitMask={2}
          transformBehaviors={["billboardY"]}
        />
        {/* )} */}
        <ViroQuad
          rotation={[-90, 0, 0]}
          width={0.5}
          height={0.5}
          arShadowReceiver={true}
          lightReceivingBitMask={2}
        />
      </ViroNode>
    </ViroARScene>
  );
};

export default AugmentedReality;

const styles = StyleSheet.create({
  helloWorldTextStyle: {
    fontFamily: "Arial",
    fontSize: 30,
    color: "#ffffff",
    textAlignVertical: "center",
    textAlign: "center",
  },
});
