import axios from "axios";
import { router } from "expo-router";
import { Alert } from "react-native";

const API_BASE_URL = "http://localhost:5001";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response || error.code === "ECONNABORTED" || error.message.includes("Network Error")) {
      router.replace("/+not-found");
    } else if (error.response?.status === 404) {
      Alert.alert(
        "Item Not Found",
        "This item may have been deleted by another user. The page will refresh.",
        [
          {
            text: "OK",
            onPress: () => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace("/");
              }
            },
          },
        ]
      );
    }
    return Promise.reject(error);
  }
);