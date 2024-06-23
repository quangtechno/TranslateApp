/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import TranslateSpeech from './TranslateSpeech';
import TranslateScreen from './TranslateScreen';
import FireStore from './FireStore';
import GoogleSignIn from './GoogleSign';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './HomeScreen';
const Stack = createStackNavigator();
function App(): React.JSX.Element {
  
    return (
    <View style={styles.BackGround}>
<NavigationContainer>
       <Stack.Navigator screenOptions={{ headerShown: false }}>
         <Stack.Screen name="login" component={LoginScreen} />
         <Stack.Screen name="home" component={HomeScreen} /> 
       </Stack.Navigator>
       </NavigationContainer>
     
   
    </View>
    );
  }

const styles = StyleSheet.create({
BackGround:{
  backgroundColor:'white',
  flex:1
},
});

export default App;
