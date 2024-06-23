import { Text, View } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CardGame from './Card';
import FavouriteList from "./FavouriteList";
import TranslateScreen from "./TranslateScreen";
import Icon from 'react-native-vector-icons/FontAwesome'
import Icon2 from 'react-native-vector-icons/Fontisto'
import Icon3 from 'react-native-vector-icons/MaterialIcons'
import LogOut from "./LogOut";

const Tab = createBottomTabNavigator();
function HomeScreen(){
    return(
        <Tab.Navigator>
        <Tab.Screen options={{ tabBarIcon: ({ color }) => (
            <Icon name='gamepad' size={20}/>
          )}} name="cardgame" component={CardGame} />
          <Tab.Screen options={{ tabBarIcon: ({ color }) => (
            <Icon3 name='translate' size={20}/>
          )}} name="translate" component={TranslateScreen} />
        <Tab.Screen options={{ tabBarIcon: ({ color }) => (
            <Icon2 name='favorite' size={20}/>
          )}} name="favourite" component={FavouriteList} />
           <Tab.Screen options={{ tabBarIcon: ({ color }) => (
            <Icon3 name='logout' size={20}/>
          )}} name="logout" component={LogOut} />
        
      </Tab.Navigator>
    );
}
export default HomeScreen;