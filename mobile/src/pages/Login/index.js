import React, { useState, useEffect } from "react";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  Alert,
  Switch,
  ImageBackground,
  Image,
} from "react-native";

import styles from "./styles";

import bubbles from "../../assets/bubbles.gif";

import * as task from "../../services/tasks";

import api from "../../services/api";

export default function Login() {
  const route = useRoute();
  const navigation = useNavigation();

  const [auth, setAuth] = useState("");
  const [remember, setRemember] = useState(false);

  //const navigateBack = () =>  navigation.goBack();

  useEffect(() => {
    const handleInit = async () => {
      //Chequeamos si es un logout y borramos el status de logged
      if (route.params === "Logout") {
        try {
          await AsyncStorage.removeItem("@module");
        } catch (e) {
          console.log(e);
        }
      } else {
        // si es un login checkeamos si tenemos un auth guardado por el remember
        await getRemember();
      }
    };

    handleInit();
  }, []);

  //chequeamos si guardamos los datos del module en el async Storage
  const getRemember = async () => {
    try {
      let module = await AsyncStorage.getItem("@remember");

      //si tenemos el module guardado
      if (module) {
        module = JSON.parse(module);
        //remember el ultimo estado del remember fue true

        setRemember(true);
        //mostramos el auth y intentamos hacer login
        setAuth(module.auth);
        handleLogin(module.auth);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleLogin = async (value = "") => {
    const authentication = auth || value;

    try {
      //llamo la api y intento iniciar session
      const response = await api.post("/sessions", { auth: authentication });

      if (response.data) {
        if (remember) {
          //si el remember es true guardamos los datos del modulo en el asyncStorage
          task.storeData("@remember", response.data);
        }
        //caso contrario lo guardamos solamente mientras estemos logueados
        task.storeData("@module", response.data);
        //direcionamos el usuario a la pagina inicial
        navigation.navigate("Home", response.data);
      }
    } catch (e) {
      Alert.alert(
        "Something went wrong",
        "Please make sure that you have registered and that your auth is correct"
      );
      console.log(e);
    }
  };

  //al apretar el switch
  const handleRemember = async () => {
    if (remember) {
      //si el remember era true, lo apagamos y borramos los datos del modulo
      setRemember(!remember);
      try {
        await AsyncStorage.removeItem("@remember");
        setAuth("");
      } catch (e) {
        console.log(e);
      }
    } else {
      //si el remember era false, lo cambiamos.
      setRemember(!remember);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={bubbles} style={styles.background}>
        <BlurView intensity={100} style={styles.wrapper}>
        <Feather style={styles.logo} name="umbrella" size={40} color="#fff" />
          

          <TextInput
            style={styles.input}
            placeholder="Authentication Code"
            require={true}
            onChangeText={(text) => setAuth(text)}
            value={auth}
          />
          <View style={styles.row}>
            <Switch
              style={styles.switch}
              trackColor={{ false: "#767577", true: "#BEC2C2" }}
              thumbColor={remember ? "#ffbd19" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={handleRemember}
              value={remember}
            />
            <Text style={styles.switchText}> Remember Me </Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}> Login </Text>
          </TouchableOpacity>
        </BlurView>

        <TouchableOpacity
          style={styles.register}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.registerText}>Update Module</Text>
        
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
}
