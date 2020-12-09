import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";

module.exports = {


  async getModule() {
    try {
      let module = await AsyncStorage.getItem("@module");
      module = JSON.parse(module);

      return module;

    } catch (e) {
      console.log(e);
    }
  },

  //Guardamos los datos enviados en el async Storage
  async  storeData(key, value) {
    try {
      const jsonData = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonData);
    } catch (e) {
      console.log(e);
    }
  },
  
  async getDistance(amount = 0, auth=""){
    if(!auth ){let a = getModule(); auth = a.auth}
     
     try { 
       const response = await api.get("/details",{
        headers: {
         authorizations: auth,
         amount: amount,
        },
      });

      return response.data;
    } catch(e) {
    console.log(e);
    }
   },

   async getAll(auth=""){
    if(!auth ){let a = getModule(); auth = a.auth}
     
     try { 
       const response = await api.get("/details",{
        headers: {
         authorizations: auth,
        },
      });
    
      return response.data;
    } catch(e) {
    console.log(e);
    }
   } 
}