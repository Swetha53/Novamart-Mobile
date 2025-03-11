import { Text, StyleSheet, View } from "react-native";
import React, { Component, useState } from "react";
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

const AugmentedReality = () => {
  const [text, setText] = useState("Initializing AR...");
  function _onTrackingUpdated(state, reason) {
    // if the state changes to "TRACKING_NORMAL" for the first time, then
    // that means the AR session has initialized!
    if (
      !this.state.hasARInitialized &&
      state == ViroConstants.TRACKING_NORMAL
    ) {
      this.setState({
        hasARInitialized: true,
      });
      setText("Hello World!!");
    }
    return (
      <ViroARScene onTrackingUpdated={_onTrackingUpdated}>
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
          <Viro3DObject
            source={
              "https://reggvbnnkqmprlkojomx.supabase.co/storage/v1/object/public/Products//object2.glb"
            }
            position={[0, 0.2, 0]}
            scale={[0.2, 0.2, 0.2]}
            type="GLB"
            lightReceivingBitMask={3}
            shadowCastingBitMask={2}
            transformBehaviors={["billboardY"]}
          />
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
  }
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
