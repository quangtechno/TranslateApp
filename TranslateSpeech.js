import React, { useState } from 'react';
import { View, Button, Text, TextInput, StyleSheet, Alert } from 'react-native';
import Sound from 'react-native-sound';
import RNFS from 'react-native-fs';

function TranslateSpeech () {
  const [text, setText] = useState('');
  const [audioContent, setAudioContent] = useState(null);

  const apiKey = 'AIzaSyDgk5Kr0QEi07fUZ9ixvXyNFSILfvSrI7A';

  const handleTextToSpeech = async () => {
    try {
      const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: { text },
          voice: {
            languageCode: 'en-US',
            name: 'en-US-Wavenet-D',
          },
          audioConfig: {
            audioEncoding: 'MP3',
          },
        }),
      });

      const data = await response.json();
    //   console.log(data.audioContent);
      setAudioContent(data.audioContent);
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Google Text-to-Speech</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter text"
        value={text}
        onChangeText={setText}
      />
      <Button title="Convert to Speech" onPress={handleTextToSpeech} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});

export default TranslateSpeech;
