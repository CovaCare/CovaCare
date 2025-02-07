import React from "react";
import { View, Text } from "react-native";
import { styles } from "./not-found.styles";

const NotFoundPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>404 - Page Not Found</Text>
      <Text style={styles.message}>
        Oops! The page you're looking for doesn't exist.
      </Text>
    </View>
  );
};

export default NotFoundPage;
