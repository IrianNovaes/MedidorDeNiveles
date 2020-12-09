import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  Alert,
  ImageBackground,
} from "react-native";

import styles from "./styles";

import bubbles from "../../assets/bubbles.gif";

import api from "../../services/api";

export default function Register() {
  const navigation = useNavigation();

  const [moduleId, setModuleId] = useState("");
  const [name, setName] = useState("");
  const [maxDistance, setMaxDistance] = useState("");
  const [minDistance, setMinDistance] = useState("");

  const navigateBack = () => navigation.goBack();

  const handleRegister = async () => {
    try {
      //llamo la api y intento actualizar los demas datos
      const response = await api.put("/modules", {
        name: name,
        module_id: moduleId,
        max_distance: maxDistance,
        min_distance: minDistance,
      });

      console.log(response.data);
      response
        ? Alert.alert("Registered", `Your Auth Code: ${response.data[0].auth}`)
        : null;
      navigation.navigate("Login");
    } catch (e) {
      Alert.alert(
        "Invalid Module Id",
        "Please make sure that your module is connected to the server."
      );
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={bubbles} style={styles.background}>
        <BlurView intensity={100} style={styles.wrapper}>
          
          <TouchableOpacity style={styles.goBackButton} onPress={navigateBack}>
            <Feather name="arrow-left" size={30} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.title}> Update Module Details </Text>

          <TextInput
            style={styles.input}
            placeholder="Module Id"
            require={true}
            onChangeText={(text) => setModuleId(text)}
            value={moduleId}
          />

          <TextInput
            style={styles.input}
            placeholder="Name"
            require={true}
            onChangeText={(text) => setName(text)}
            value={name}
          />
        
            <TextInput
              style={styles.input}
              placeholder="Max Distance"
              require={true}
              onChangeText={(text) => setMaxDistance(text)}
              value={maxDistance}
            />
        

         
            <TextInput
              style={styles.input}
              placeholder="Min Distance"
              require={true}
              onChangeText={(text) => setMinDistance(text)}
              value={minDistance}
            />
        

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}> Register </Text>
          </TouchableOpacity>
        </BlurView>
      </ImageBackground>
    </View>
  );
}
