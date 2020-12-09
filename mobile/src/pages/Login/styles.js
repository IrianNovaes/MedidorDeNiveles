import {StyleSheet} from 'react-native';
import Constants from 'expo-constants';

export default StyleSheet.create ({
  
  container:{
    flex: 1,
    backgroundColor: "#558ca5"
  },
  background:{
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center"
  }, 
  wrapper: {
    
    width: "100%",
  //height:"100%",
    justifyContent: "center",
    backgroundColor: "rgba(66,110,131,0.3)",
    paddingVertical: 10,
    paddingHorizontal: 10,
    
  }, 
  logo:{
    alignSelf: "center"
  },
  title:{
    color: "#ffffff",
    fontSize: 50,
    alignSelf: "center"
  },

  input:{
    borderBottomWidth:1,
    borderBottomColor:"#ffffff",
    marginVertical: 10,
    color: "#fff",
    paddingHorizontal: 20,
  },
  row:{
    flexDirection: "row",
    alignSelf: "flex-end",
    alignItems: "center",
    marginVertical: 10,
  },
  switchText:{
    color: "#fff"
  },
  button:{
    borderWidth:1,
    borderColor: "#ffffff",
    borderRadius: 10,
    marginVertical: 10,
    alignSelf: "center",
    width: "90%",
    height: 40,

    justifyContent: "center",
    alignContent:"center"

  },
  buttonText:{
    color: "#fff",
    fontSize: 20,
    textAlign:"center"
  },
  register:{
    alignSelf: 'flex-end', 
    margin: 10, 
  },

  registerText: {
    color: "#fff", 
    fontSize: 15,
  }




});