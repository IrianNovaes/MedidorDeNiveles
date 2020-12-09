import React from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity,  ImageBackground } from "react-native";


import styles from "./styles";
import Level from "../../components/Level"

import bubbles from "../../assets/bubbles.gif";

export default function Login() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ImageBackground source={bubbles} style={styles.background}>

     <TouchableOpacity
        style={styles.logout}
        onPress={() => {
          navigation.navigate("Login", "Logout");
        }}
      >
        <Text style={styles.logoutText}>LogOut</Text>
      </TouchableOpacity>

      <Level/>
      
      </ImageBackground>
      
    </View>
  );
}
