/*This is th Example of google Sign in*/
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from 'react-native-google-signin';

import axios from 'axios';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: null,
      gettingLoginStatus: true,
    };
  }

  componentDidMount() {
    //initial configuration
    GoogleSignin.configure({
      //It is mandatory to call this method before attempting to call signIn()
      scopes: [
        // 'https://www.googleapis.com/auth/drive.readonly',
        'https://www.googleapis.com/auth/youtube.readonly',
      ],
      // Repleace with your webClientId generated from Firebase console
      webClientId:
        '427264670490-u0akgnndor5tm3s26i4p8101jq30dopl.apps.googleusercontent.com',
    });
    //Check if user is already signed in
    this._isSignedIn();
  }

  _isSignedIn = async () => {
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (isSignedIn) {
      alert('User is already signed in');
      //Get the User details as user is already signed in
      this._getCurrentUserInfo();
    } else {
      //alert("Please Login");
      console.log('Please Login');
    }
    this.setState({gettingLoginStatus: false});
  };

  _getCurrentUserInfo = async () => {
    try {
      const userInfo = await GoogleSignin.signInSilently();
      console.log('User Info --> ', userInfo);
      this.setState({userInfo: userInfo});
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        alert('User has not signed in yet');
        console.log('User has not signed in yet');
      } else {
        alert("Something went wrong. Unable to get user's info");
        console.log("Something went wrong. Unable to get user's info");
      }
    }
  };

  _signIn = async () => {
    //Prompts a modal to let the user sign in into your application.
    try {
      await GoogleSignin.hasPlayServices({
        //Check if device has Google Play Services installed.
        //Always resolves to true on iOS.
        showPlayServicesUpdateDialog: true,
      });
      const userInfo = await GoogleSignin.signIn();
      console.log('User Info --> ', userInfo);
      this.setState({userInfo: userInfo});
      const currentUser = await GoogleSignin.getTokens().then((res) => {
        console.log(res.accessToken);
      });
      console.log('currentUser: ', currentUser);
    } catch (error) {
      console.log('Message', error.message);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User Cancelled the Login Flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Signing In');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play Services Not Available or Outdated');
      } else {
        console.log('Some Other Error Happened');
      }
    }
  };

  _signOut = async () => {
    //Remove user session from the device.
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      this.setState({userInfo: null}); // Remove the user from your app's state as well
    } catch (error) {
      console.error(error);
    }
  };

  getSubscriptions = async () => {
    // try {
    //   const res = await axios({
    //     method: "get",
    //     url: "https://www.googleapis.com/youtube/v3/subscriptions?part=id&maxResults=50&mine=true&key=[YOUR_API_KEY] HTTP/1.1"
    //   })
    // } catch (err) {
    // }
  };

  render() {
    //returning Loader until we check for the already signed in user
    if (this.state.gettingLoginStatus) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    } else {
      if (this.state.userInfo != null) {
        //Showing the User detail
        return (
          <View style={styles.container}>
            <Image
              source={{uri: this.state.userInfo.user.photo}}
              style={styles.imageStyle}
            />
            <Text style={styles.text}>
              Name: {this.state.userInfo.user.name}{' '}
            </Text>
            <Text style={styles.text}>
              Email: {this.state.userInfo.user.email}
            </Text>
            <TouchableOpacity style={styles.button} onPress={this._signOut}>
              <Text>Logout</Text>
            </TouchableOpacity>
          </View>
        );
      } else {
        //For login showing the Signin button
        return (
          <View style={styles.container}>
            <GoogleSigninButton
              style={{width: 312, height: 48}}
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Light}
              onPress={this._signIn}
            />
          </View>
        );
      }
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageStyle: {
    width: 200,
    height: 300,
    resizeMode: 'contain',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    width: 300,
    marginTop: 30,
  },
});
