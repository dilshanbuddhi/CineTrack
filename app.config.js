export default {
  name: "cine_track",
  slug: "cine_track",
  android: {
    package: "com.dilshan.cinetrack"
  },
  plugins: [
    "expo-router"
  ],
  extra: {
    mockApi: process.env.EXPO_BASE_API_URL,
    eas: {
      projectId: "742b7ba9-e14c-45cb-9d9b-517883657404"
    }
  }
};
