import React, { useEffect, useState } from 'react';
import { Animated, FlatList, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { useAnimatedValue } from 'react-native'; // Đảm bảo rằng bạn nhập đúng đường dẫn của hook tùy chỉnh
import firestore from '@react-native-firebase/firestore';

function CardGame() {
    let card1 = null;
    let card2 = null;
    const [checkArray, setCheckArray] = useState(null);
    async function getDataFromFireStore() {
        try {
            const docRef = await firestore().collection('translate').doc('favourite');

            const doc = await docRef.get();
            // console.log(doc);
            if (doc.exists) {
                //   Retrieve the value of the 'test123' field

                const value = await doc.data().Arr;

                const translationsArray = value.slice(0, 8).map(item => item.translation);
                const wordsArray = value.slice(0, 8).map(item => item.word);
                let mergeArray = translationsArray.concat(wordsArray);
                const shuffledArray = shuffleArray(mergeArray);
                setData(shuffledArray);
                console.log(data);
                const checkArray = value.slice(0, 8);
                // console.log(checkArray);
                setCheckArray(checkArray);
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.error("Error getting document:", error);
        }
    }
    const Card = ({ word }) => {
        const [flipped, setFlipped] = useState(false);

        // Sử dụng hook useAnimatedValue với một callback để xử lý giá trị khi thay đổi
        const animatedValue = useAnimatedValue(0, (value) => {
            console.log('Current animated value:', value);
        });

        const frontInterpolate = animatedValue.interpolate({
            inputRange: [0, 180],
            outputRange: ['0deg', '180deg'],
        });

        const backInterpolate = animatedValue.interpolate({
            inputRange: [0, 180],
            outputRange: ['180deg', '360deg'],
        });

        const frontCardStyle = {
            transform: [{ rotateY: frontInterpolate }],
        };

        const backCardStyle = {
            transform: [{ rotateY: backInterpolate }],
        };

        const flipCard = async () => {
            if (flipped) {
                Animated.spring(animatedValue, {
                    toValue: 0,
                    useNativeDriver: true,
                }).start();
                setFlipped(!flipped);
                console.log("flip 1");
                if (card1 == word) {
                    card1 = null;
                    console.log("set card 1 " + card1);
                }

            } else {
                Animated.spring(animatedValue, {
                    toValue: 180,
                    useNativeDriver: true,
                }).start();
                if (card1 == null) {
                    card1 = word
                } else {
                    card2 = word;
                    var bool = await CheckFavouriteList(card1, card2);
                    if (bool) {
                        console.log("remove the cards");
                        let temp = data.filter(item => item !== card1 && item !== card2);
                        //console.log(temp);
                        if (temp == null || temp.length === 0) {
                            getDataFromFireStore();
                        }else{
                        setData(temp);
                    }
                        card1 = null;
                        card2 = null;
                    } else {
                        console.log("set cards null");
                        card2 = null;
                        Animated.spring(animatedValue, {
                            toValue: 0,
                            useNativeDriver: true,
                        }).start();
                    }
                }
                console.log(card1 + " " + card2);
                setFlipped(!flipped);
            }

        };
        return (
            <TouchableWithoutFeedback onPress={flipCard}>
                <View style={styles.container}>
                    <Animated.View style={[styles.card, styles.front, frontCardStyle]}>
                        {/* <Text style={styles.text}>Mặt Trước</Text> */}
                    </Animated.View>
                    <Animated.View style={[styles.card, styles.back, backCardStyle]}>
                        <Text style={styles.text}>{word}</Text>
                    </Animated.View>
                </View>
            </TouchableWithoutFeedback>
        );
    };








    const [data, setData] = useState([])
    useEffect(() => {
        getDataFromFireStore();
    }, [])

    function shuffleArray(array) {
        let arr = [...array];
        for (let i = arr.length - 1; i > arr.length - 1; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            // Swap elements at i and j
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
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
    return (
        <View style={{ flex: 1, flexWrap: 'wrap', }}>

            {data.map((item, index) => (
                <Card key={index} word={item} />
            ))}
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        width: 100,
        height: 150,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10
    },
    card: {
        borderRadius: 20,
        width: 100,
        height: 150,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        backfaceVisibility: 'hidden',
    },
    front: {
        backgroundColor: 'skyblue',
    },
    back: {
        backgroundColor: 'skyblue',
        position: 'absolute',
        top: 0,
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
});

export default CardGame;
