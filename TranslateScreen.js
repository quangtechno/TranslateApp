import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import Sound from 'react-native-sound';
import RNFS from 'react-native-fs';
import Icon3 from 'react-native-vector-icons/Entypo'
    import firestore from '@react-native-firebase/firestore';
// import firebase from 'firebase/app';

function TranslateScreen() {

  //variable
  const [text, setText] = useState("");
  const [translated, setTranslated] = useState("");
  const [translatedLang, setTranslatedlange] = useState("Vietnamese");
  const [translatedValue, setTranslatedValue] = useState("vi")
  const [translatingLang, setTranslatingLang] = useState("English");
  const [translatingValue, setTranslatingValue] = useState("en");
  const [isFavourite, setFavourite] = useState(false);
  const translateData = [
    { label: 'Vietnamese', value: 'vi', voice: 'vi-VN-Neural2-A', langCode: 'vi-VN' },
    { label: 'English', value: 'en', voice: 'en-US-Wavenet-D', langCode: 'en-US' },
    { label: 'Japanese', value: 'ja', voice: 'ja-JP-Neural2-B', langCode: 'ja-JP' },
    { label: 'German', value: 'de', voice: 'de-DE-Polyglot-1', langCode: 'de-DE' },
  ];
  const [item1, setItem1] = useState(translateData[0]);
  const [item2, setItem2] = useState(translateData[1]);
  const apiKey = 'AIzaSyDgk5Kr0QEi07fUZ9ixvXyNFSILfvSrI7A';


  // translateText();
  async function handleTextToSpeech(speechText, voice, langCode) {
    console.log(speechText + " " + langCode + " " + voice);
    try {
      const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;',
        },
        body: JSON.stringify({
          input: {
            text: speechText
          },
          voice: {
            languageCode: langCode,
            name: voice,
          },
          audioConfig: {
            audioEncoding: 'MP3',
          },
        }),
      });

      const data = await response.json();
      //console.log(data);

      // console.log(data.audioContent);
      playAudio(data.audioContent);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const playAudio = async (base64Audio) => {
    const tempFilePath = RNFS.DocumentDirectoryPath + '/tempAudio.mp3';

    await RNFS.writeFile(tempFilePath, base64Audio, 'base64');
    const sound = new Sound(tempFilePath, '', (error) => {
      if (error) {
        console.error('Failed to load the sound', error);
        return;
      }
      sound.play((success) => {
        if (success) {
          console.log('Successfully finished playing');
        } else {
          console.error('Playback failed due to audio decoding errors');
        }
      });
    });
  };

  async function translateText() {
    // if 2 ngôn ngữ giống nhau thì không dịch
    if(translatingValue==translatedValue){
      return;
    }
    const apiKey = 'AIzaSyDgk5Kr0QEi07fUZ9ixvXyNFSILfvSrI7A';
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
    const data = {
      q: text,
      source: translatedValue,
      target: translatingValue,
      format: 'text'
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(data)
    }).then(response => {
      //console.log(response);
      return response.json();
    }).then(async data => {
      console.log(JSON.stringify(data));
      //console.log(data.data.translations[0].translatedText);
      var temp = data.data.translations[0].translatedText;
      setTranslated(data.data.translations[0].translatedText);
      let check = await CheckFavouriteList(temp, text);
      setFavourite(check);
      console.log(check);
    }).catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });

  }
  async function CheckFavouriteList(word1, word2) {
    try {
      const snapshot = await firestore().collection('translate')
        .where('Arr', 'array-contains-any', [
          { translation: word1, word: word2 },
          { translation: word2, word: word1 }
        ])
        .get();
      //  console.log("result of checking " + snapshot.empty +"if empty");
      var bool = snapshot.empty;
      return !bool;
      //console.log('Documents found:', snapshot.docs.length);

    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  }
  async function FavouriteHandle(word1, word2) {
    console.log(word1,word2);
    if(!isFavourite){
    try {
      const snapshot = await firestore().collection('translate').doc('favourite')
        // .update({
        //   Arr: arrayUnion({ translation: word1, word: word2 })
        // }, { merge: true })
        
       await snapshot.update({
        Arr: firestore.FieldValue.arrayUnion({ translation: word1, word: word2 })
      })
      setFavourite(true);
      console.log('Element added successfully');

    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  }else{
    try {
      const snapshot = await firestore().collection('translate').doc('favourite')
        // .update({
        //   Arr: arrayUnion({ translation: word1, word: word2 })
        // }, { merge: true })  
        
       await snapshot.update({
        Arr: firestore.FieldValue.arrayRemove({ translation: word1, word: word2 })
      })
      
      setFavourite(false);
      console.log('Element removed successfully');

    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  }
  }





  //ui
  return (
    <View>
      <View style={{ flexDirection: "row", backgroundColor: "#f7f2f9", borderRadius: 20 }}>
        <View style={{ backgroundColor: "#f7f2f9", flex: 1, }}>
          <Dropdown
            style={[styles.dropdown && { borderColor: 'blue' }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={translateData}
            maxHeight={300}
            value={translatedValue}
            labelField="label"
            valueField="value"
            placeholder={translatedLang}
            onChange={item => {
              setTranslatedValue(item.value);
              setTranslatedlange(item.label);
              setItem1(item);
            }}
          />
        </View>

        <View style={{ flex: 1, }}>
          <Dropdown
            style={[styles.dropdown && { borderColor: 'blue' }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={translateData}
            value={translatingValue}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={translatingLang}
            onChange={item => {
              setTranslatingValue(item.value);
              setTranslatingLang(item.label);
              setItem2(item);
            }}
          />
        </View>
      </View>
      <View>
        <Text style={{
          fontWeight: "bold"
          , position: "absolute"
          , zIndex: 1
          , top: 15,
          left: 20
        }}>{translatedLang}</Text>
        <TouchableOpacity style={{
          fontWeight: "bold"
          , position: "absolute"
          , zIndex: 1
          , top: 15,
          left: 100
        }} onPress={async () => {
          handleTextToSpeech(text, item1.voice, item1.langCode);
        }}>
          <Text ><Icon3 name="megaphone" size={20} /></Text>
        </TouchableOpacity>
        <TouchableOpacity style={{
          fontWeight: "bold"
          , position: "absolute"
          , zIndex: 1
          , top: 160,
          left: 250,
          width: 75,
          height: 30,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 30,
          backgroundColor: "#FF6600"
        }} onPress={() => { translateText() }}>
          <Text style={{ color: 'white', }} >Translate</Text>
        </TouchableOpacity>
        <TextInput
          style={{ backgroundColor: "#f7f2f9", margin: 10, borderRadius: 20, position: 'relative', }}
          onChangeText={temp => { setText(temp) }}
          placeholderTextColor="grey"
          multiline={true}
          numberOfLines={10}  // Adjust based on your needs
        />
      </View>
      <View>
        <Text style={{
          fontWeight: "bold"
          , position: "absolute"
          , zIndex: 1
          , top: 15,
          left: 20
        }}>{translatingLang}</Text>
        <TouchableOpacity style={{
          fontWeight: "bold"
          , position: "absolute"
          , zIndex: 1
          , top: 160,
          left: 250
        }}
          onPress={() => { FavouriteHandle(text, translated) }}
        ><Icon3 name="star" size={30} color={isFavourite ? "#ebed82" : "#000000"} // Change color based on state
          /></TouchableOpacity>
        <TouchableOpacity style={{
          fontWeight: "bold"
          , position: "absolute"
          , zIndex: 1
          , top: 15,
          left: 100
        }} onPress={async () => {
          // await setSpeechText(translated);
          // await setVoice(item2.voice);
          // await setLangCode(item2.langCode);
          handleTextToSpeech(translated, item2.voice, item2.langCode);
        }}>
          <Text ><Icon3 name="megaphone" size={20} /></Text>
        </TouchableOpacity>
        <TextInput
          style={{ backgroundColor: "#f7f2f9", margin: 10, borderRadius: 20, position: 'relative', }}
          value={translated}
          placeholder="Type something..."
          placeholderTextColor="grey"
          multiline={true}
          numberOfLines={10}  // Adjust based on your needs
        />
      </View>
    </View>

  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
export default TranslateScreen;