import React, { useCallback, useRef, useState, useEffect } from "react"
import { View, StyleSheet, TouchableOpacity } from "react-native"
import { useUnistyles } from "react-native-unistyles"
import { Camera, useCameraDevice, useCameraPermission } from "react-native-vision-camera"
import { SafeAreaView } from "react-native-safe-area-context"

import { Button } from "@/components/Button"
import { Text } from "@/components/Text"
import { Screen } from "@/components/Screen"

export const ChallengeScreen = () => {
  const { theme } = useUnistyles()
  const { hasPermission, requestPermission } = useCameraPermission()
  const device = useCameraDevice("front")
  const camera = useRef<Camera>(null)
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    if (!hasPermission) {
      requestPermission()
    }
  }, [hasPermission])

  if (!hasPermission) {
    return (
      <Screen preset="scroll" contentContainerStyle={$container} safeAreaEdges={["top", "bottom"]}>
        <Text text="Camera permission is required to verify your exercise." weight="bold" size="lg" />
        <Button text="Grant Permission" onPress={requestPermission} />
      </Screen>
    )
  }

  if (device == null) {
    return (
      <Screen preset="scroll" contentContainerStyle={$container} safeAreaEdges={["top", "bottom"]}>
        <Text text="No camera device found." weight="bold" size="lg" />
      </Screen>
    )
  }

  return (
    <View style={$container}>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isActive}
        photo={true}
      />

      <SafeAreaView style={$overlay} edges={["top", "bottom"]}>
        <View style={$header}>
          <Text text="Burpee Challenge" style={{ color: "white" }} weight="bold" size="xl" />
          <Text text="Complete 5 burpees to unlock your app" style={{ color: "white" }} />
        </View>

        <View style={$footer}>
          <View style={$counterContainer}>
            <Text text="0 / 5" style={{ color: "white", fontSize: 48, fontWeight: "bold" }} />
          </View>
        </View>
      </SafeAreaView>
    </View>
  )
}

const $container: any = {
  flex: 1,
  backgroundColor: "black",
  justifyContent: "center",
  alignItems: "center",
}

const $overlay: any = {
  ...StyleSheet.absoluteFillObject,
  justifyContent: "space-between",
  padding: 24,
  zIndex: 10,
}

const $header: any = {
  alignItems: "center",
  marginTop: 40,
}

const $footer: any = {
  alignItems: "center",
  marginBottom: 40,
}

const $counterContainer: any = {
  backgroundColor: "rgba(0,0,0,0.5)",
  paddingHorizontal: 32,
  paddingVertical: 16,
  borderRadius: 24,
}
