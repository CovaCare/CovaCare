import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { styles } from "./not-found.styles";
import { Link } from "expo-router";

const NotFoundPage = () => {
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Connection Error</Text>
        <Text style={styles.message}>
          Oops! We're having trouble connecting to the CovaCare server.{"\n"}
          Please check your internet connection and try again.
        </Text>
        <Link href="/" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

export default NotFoundPage;
