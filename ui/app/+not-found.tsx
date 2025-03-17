import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { styles } from "./not-found.styles";
import { Link } from "expo-router";

const NotFoundPage = () => {
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>This page doesn't exist</Text>
        <Text style={styles.message}>
          Oops! It seems you've wandered into uncharted territory.{"\n"}
          The page you're looking for doesn't exist.
        </Text>
        <Link href="/" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Return Home</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

export default NotFoundPage;
