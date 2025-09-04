import React from "react"
import "./../global.css"
import { Slot, Stack } from "expo-router"
import { AuthProvider } from "@/context/AuthContext"
import { LoaderProvider } from "@/context/LoaderContext"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const RootLayout = () => {
  return (
      <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right", "bottom"]}>
              <LoaderProvider>
                  <AuthProvider>
                      <Slot />
                  </AuthProvider>
              </LoaderProvider>
          </SafeAreaView>
      </SafeAreaProvider>

  )
}

export default RootLayout
