import {StyleSheet} from 'react-native';
import Constants from 'expo-constants';

export default StyleSheet.create ({
  
  container:{
    flex: 1,
    backgroundColor: "#558ca5",
    paddingTop: Constants.statusBarHeight,
  },
  background:{
    flex: 1,
    resizeMode: "cover",
}, 
  wrapper: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(66,110,131,0.3)",
    paddingHorizontal: 10,
    flexDirection: "column",
    
  }, 
  goBackButton:{
    position: "absolute", 
    top: 0,
    left: 0,
    margin: 10,
  }, 
  title:{
    color: "#ffffff",
    fontSize: 30,
    width: "80%",
    textAlign: "center",
    alignSelf: "center", 
    marginVertical: 50,
  },

  input:{
    borderBottomWidth:1,
    borderBottomColor:"#ffffff",
    marginVertical: 10,
    color: "#fff",
    paddingHorizontal: 20,
  },
  
  button:{
    borderWidth:1,
    borderColor: "#ffffff",
    borderRadius: 10,
    marginVertical: 10,
    width: "100%",
    height: 40,

    justifyContent: "center",
    alignContent:"center",
    
    marginTop: 50,

  },
  buttonText:{
    color: "#fff",
    fontSize: 20,
    textAlign:"center"
  }




});