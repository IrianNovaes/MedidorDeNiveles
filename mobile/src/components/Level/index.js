import React,{ useEffect, useState } from "react";
import { useNavigation, useRoute  } from "@react-navigation/native";
import { View, Text, TouchableOpacity } from "react-native";

import styles from "./styles";

import * as task from "../../services/tasks"

export default function Login() {
  const navigation = useNavigation();
  const route = useRoute();

  const [indicator , setIndicator] = useState("");  

  const [moduleName , setModuleName] = useState(route.params.name || "");
  const [auth , setAuth] = useState(route.params.auth);
  const [details, setDetails] = useState(false);
  
  const [distance , setDistance] = useState(0);  
  const [maxDistance , setMaxDistance] = useState(0);
  const [maxLimit , setMaxLimit] = useState(0);
  const [minDistance , setMinDistance] = useState(0);
  const [minLimit , setMinLimit] = useState(0);

  useEffect( () => {
    iniConfig(); // llamamos al init config para setear las variables en base a la totalidad de los valores enviados hasta el momento.
    }, [])

  const iniConfig = async () =>{
    let max = 0;
    let min = 99999;
    try{
      const distances = await task.getAll(auth);
      
      distances.forEach(element => {
        if (element.distance < min){
          min = element.distance;
        }
        if(element.distance > max){
          max = element.distance;
        }
      
      });
        setMinLimit((max - min)/4 + min);
        setMaxLimit(((max - min)/4)*3 + min);
        setMinDistance(min);
        setMaxDistance(max);
    }catch(e){
      console.log(e);
    }          
    
  }

  const handleDistance = (value) => {
    if (value){     
        if(value < minDistance){ //seteamos MIN distancia (MAX volume de agua)
              setMinDistance(value); 
              setMinLimit((maxDistance - value)/4 + value); // Minlimit = 1/4 de la profundidad + el valor min 
              setMaxLimit(((maxDistance - value)/4) * 3 + minDistance);  // Maxlimit = 1/4 de la profundidad - el valor max   
            } 
        if (value > maxDistance){// seteamos MAX distancia (MIN volume de agua)
          console.log(value, maxDistance);
              setMaxDistance(value);          
              setMaxLimit(((value - minDistance)/4) * 3 + minDistance);  // Maxlimit = 1/4 de la profundidad - el valor max   
              setMinLimit((value - minDistance)/4 + value); // Minlimit = 1/4 de la profundidad + el valor min 
        }
    }
  }

  const updateComponent = (value) => {
    //cuan mayor la distancia menor nivel
    if (value >= maxLimit){
      setIndicator("Low");
    }else if (value <= minLimit){
      setIndicator("High");
    }else{
      setIndicator("Normal")
    }
  } 

  useEffect(() => {
    //Retorna la distancia a cada 10sec
    const interval = setInterval(async () => {
        const data = await task.getDistance(1, auth);
        if(data[0].distance != distance && data[0].distance != 0){
          setDistance(data[0].distance);
          maxDistance != 0 ? handleDistance(data[0].distance) : null;
          updateComponent(data[0].distance);
        }   
    }, 10000);    
   return () => clearInterval(interval);
  }, [])

  return (
    <View >
      <TouchableOpacity
        style={styles.item}
        onPress={() => {setDetails(!details)}}
      >
        <Text style={indicator == "High" ? styles.highText :indicator == "Low"? styles.lowText : styles.mainText}>{indicator}</Text>
      </TouchableOpacity>
      { details ? <View style={styles.details}>
      <Text style={styles.text}>distance : {distance}</Text>
        <Text style={styles.text}>max: {maxDistance}</Text>
        <Text style={styles.text}>min: {minDistance}</Text>
        <Text style={styles.text}>maxL: {maxLimit}</Text>
        <Text style={styles.text}>minL: {minLimit}</Text>
      </View> : null}

    </View>
  );
}
