import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import Loader from "@/components/Loader";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true, // Added to match NotificationBehavior interface
  }),
});

const Index = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  console.log("User data : ", user);

  // Ask permission when app loads
  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Permission for notifications not granted!");
      }
    };
    requestPermissions();
  }, []);

  // Auth navigation
  useEffect(() => {
    if (!loading) {
      if (user) router.replace("/home");
      else router.replace("/login");
    }
  }, [user, loading]);

  if (loading) {
    return <Loader visible={true} />;
  }

  return null;
};

export default Index;
