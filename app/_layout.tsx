import React from "react"
import "./../global.css"
import { Slot, Stack } from "expo-router"
import { AuthProvider } from "@/context/AuthContext"
import { LoaderProvider } from "@/context/LoaderContext"
import {SafeAreaProvider} from "react-native-safe-area-context";
import {SafeAreaView} from "react-native";

const RootLayout = () => {
  return (
      <SafeAreaProvider>
          <SafeAreaView style={{flex: 1}}>
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
