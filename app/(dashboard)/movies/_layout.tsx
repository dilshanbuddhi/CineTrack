import { View, Text } from "react-native"
import React from "react"
import { Stack } from "expo-router"

const TaskLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[id]" options={{ title: "Movie Form" }} />
    </Stack>
  )
}

export default TaskLayout
