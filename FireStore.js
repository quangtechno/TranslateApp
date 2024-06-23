import { Text } from "react-native";
import firestore from '@react-native-firebase/firestore';

  function FireStore(){
    
    
async function getDataFromFireStore(){
    try {
        const docRef = await firestore().collection('translate').doc('favourite');
     
        const doc =await docRef.get();
        console.log(doc);
        if (doc.exists) {
        //   Retrieve the value of the 'test123' field
          const test123Value = doc.data();
          console.log("Value of 'test123' field:", test123Value);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error getting document:", error);
      }
}
 getDataFromFireStore();
return(
<Text>add Doc in FireStore</Text>
);
}
export default FireStore;