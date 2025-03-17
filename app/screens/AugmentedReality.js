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
  ViroARSceneNavigator,
  ViroMaterials,
  ViroClickStateTypes,
  ViroARPlane,
} from "@reactvision/react-viro";
import { fetchProductModel } from "../config/api";
import Ticker from "../components/Ticker";

ViroMaterials.createMaterials({
  QuadMaterial: {
    lightingModel: "Constant",
    diffuseColor: "#888",
  },
});

const AugmentedReality = () => {
  const route = useRoute();
  const { productId } = route.params;
  const [text, setText] = useState("Initializing AR...");
  const [hasARInitialized, setHasARInitialized] = useState(false);
  const [modelData, setModelData] = useState({});
  const [showTicker, setShowTicker] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [position, setPosition] = useState(null);
  const [sceneKey, setSceneKey] = useState(0);
  const modelUrl =
    "https://reggvbnnkqmprlkojomx.supabase.co/storage/v1/object/public/Products/8989f64c-0ddc-4416-94f4-cd7cadc32131.glb";

  useEffect(() => {
    //   const loadProductModel = async () => {
    //     try {
    //       const tempModelData = await fetchProductModel(productId);
    //       tempModelData[0].asset_url.replace(/(\.glb).*$/, ".glb");
    //       setModelData(tempModelData[0]);
    //     } catch (err) {
    //       toggleTicker(true, err.message);
    //     } finally {
    //       // setLoading(false);
    //     }
    //   };
    //   loadProductModel();
    console.log("Position updated:", position);
    setSceneKey((prev) => prev + 1);
  }, [position]);
  const _onTrackingUpdated = (state, reason) => {
    console.log("AR Tracking State:", state, "Reason:", reason);
  };
  const _onLoadStart = () => {
    console.log("3d started loading");
  };
  const _onLoadEnd = () => {
    console.log("3d ended loading");
  };
  const _onError = () => {
    console.log("3d error loading");
  };
  const toggleTicker = (value, message) => {
    setShowTicker(value);
    setErrorMessage(message);
  };

  return (
    <ViroARSceneNavigator
      key={sceneKey}
      initialScene={{
        scene: () => (
          <ViroARScene
            onTrackingUpdated={(state, reason) => {
              _onTrackingUpdated(state, reason);
            }}
          >
            <ViroAmbientLight color="#ffffff" intensity={200} />
            <ViroARPlane
              dragType="FixedToWorld"
              onPlaneDetected={(plane) => console.log("Plane detected:", plane)}
            >
              <ViroText
                visible={position != null}
                text="Model should be here!"
              />
              <Viro3DObject
                visible={position != null}
                source={{ uri: modelUrl }}
                scale={[0.5, 0.5, 0.5]}
                type="GLB"
                dragType="FixedToWorld"
                onDrag={() => {}}
                onLoadStart={_onLoadStart}
                onLoadEnd={_onLoadEnd}
                onError={_onError}
              />
              <ViroQuad
                visible={position == null}
                width={1}
                height={1}
                rotation={[-90, 0, 0]}
                materials="QuadMaterial"
                onClickState={(state, position) => {
                  if (state === ViroClickStateTypes.CLICKED) {
                    console.log(position);
                    setPosition([...position]);
                  }
                }}
              />
            </ViroARPlane>
          </ViroARScene>
        ),
      }}
    />
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
