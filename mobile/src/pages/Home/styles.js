import {StyleSheet} from 'react-native';
import Constants from 'expo-constants';

export default StyleSheet.create ({
  
  container:{
    flex: 1,
    
    backgroundColor: "#558ca5",
    paddingTop: Constants.statusBarHeight
  },
  background:{
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
}, 

  logout:{
    position: "absolute", 
    top: 0, 
    right: 0, 
    margin: 30,  
    
  },
  logoutText:{
    fontSize: 15, 
    color: "#fff"
  }

});