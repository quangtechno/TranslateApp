import { Text, TouchableOpacity, View } from "react-native";
import firestore from '@react-native-firebase/firestore';
import { useCallback, useEffect, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/AntDesign"
import { useFocusEffect } from "@react-navigation/native";

function FavouriteList() {
    const [dataList, setDataList] = useState([]);
   
    useFocusEffect(
       useCallback(() => {
          // Add your focus listener logic here
          getDataFromFireStore();

          
          // Example: Fetch data or perform actions when screen is focused
    
          return () => {
            // Clean up any resources when the component is unmounted
            console.log('FavouriteList screen is unfocused');
          };
        }, [])
      );
    async function getDataFromFireStore() {
        try {
            const docRef = await firestore().collection('translate').doc('favourite');

            const doc = await docRef.get();
            // console.log(doc);
            if (doc.exists) {
                //   Retrieve the value of the 'test123' field

                const value = await doc.data().Arr;
                setDataList(value);
                //   console.log("Value of  field:",value);
                //   console.log("Value of result field:",result);
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.error("Error getting document:", error);
        }
    }
    


function RemoveFavourite(removeId) {
    const updateList = dataList.filter((item, index) => index != removeId);
    const docRef = firestore().collection('translate').doc('favourite');
    docRef.update({
        Arr: updateList,

    })
    setDataList(updateList);
}
//getDataFromFireStore();
//console.log(dataList);

function RenderData({ item, index }) {
    //console.log(item);
    return (
        <View style={{ flexDirection: "row", justifyContent: 'space-between', borderWidth: 1, alignItems: 'center', margin: 10, padding: 10, borderRadius: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{item.word}</Text>
            <Text style={{ fontSize: 20 }}> -------- </Text>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{item.translation}</Text>
            <TouchableOpacity style={{ fontSize: 20, fontWeight: 'bold' }} onPress={() => { RemoveFavourite(index) }}>
                <Text ><Icon name="star" size={30} color="#ebed82" /></Text>
            </TouchableOpacity>
        </View>
    )
}
return (
    <View>
        <FlatList data={(dataList)} renderItem={({ item, index }) => <RenderData item={item} index={index} />}
        />
    </View>
);
}
export default FavouriteList;