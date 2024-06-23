import { GoogleSignin, GoogleSigninButton, isErrorWithCode, statusCodes } from "@react-native-google-signin/google-signin";
import { useState } from "react";
import { Text, View } from "react-native";
import auth from '@react-native-firebase/auth';

GoogleSignin.configure({
    webClientId: '518665510461-jmh9bok8sl20ip8b6p057u7v8pisp65a.apps.googleusercontent.com',
});
function GoogleSignIn() {
    const [_user, set_User] = useState(null);

    async function googleSignOut() {
        try {
            await GoogleSignin.signOut();
            setState({ user: null }); // Remember to remove the user from your app's state as well
        } catch (error) {
            console.error(error);
        }
    }
    function afterLogin() {
        console.log("after login");
    }
    async function OnGoogleButtonPress() {
        try {
            // Check if your device supports Google Play
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            // Get the users ID token
            const { idToken } = await GoogleSignin.signIn();

            // Create a Google credential with the token
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);

            // Sign-in the user with the credential
            const firebaseUserCredential =  await auth().signInWithCredential(googleCredential);
            //setUser(); // Update the user state with signed-in user
            set_User(firebaseUserCredential.user);
            console.log(_user);
            //afterLogin(); // Replace with your function name

         //  console.log('User signed in:',firebaseUserCredential.user);
        } catch (error) {
            console.log("have error")
            if (isErrorWithCode(error)) {
             //   console.log(error);
                                switch (error.code) {
                    case statusCodes.SIGN_IN_CANCELLED:
                        // user cancelled the login flow
                        console.log(statusCodes.SIGN_IN_CANCELLED)
                        break;
                    case statusCodes.IN_PROGRESS:
                        // operation (eg. sign in) already in progress
                        console.log(statusCodes.IN_PROGRESS)
                        break;
                    case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                        // play services not available or outdated
                        console.log(statusCodes.PLAY_SERVICES_NOT_AVAILABLE)
                        break;
                    case statusCodes.DEVELOPER_ERROR:
                        // play services not available or outdated
                        console.error('Developer Error:', error.message);
                        break;
                    default:
                    // some other error happened
                }
            } else {
                // an error that's not related to google sign in occurred
                console.log(error.message);
            }
            throw error;
        }
    }

    return (
        <View>
            <GoogleSigninButton
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={() => {
                    OnGoogleButtonPress();
                }}
            />
            {/* <Text>{_user}</Text> */}
        </View>
    );
}
export default GoogleSignIn;