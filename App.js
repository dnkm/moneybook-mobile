import React from 'react';
import { StyleSheet, Text, View, ScrollView, ImageBackground, Image, Dimensions } from 'react-native';
import { Container, Header, Title, Body, Footer, Content, FooterTab, Button, Icon, Spinner } from 'native-base';
import { Constants, Google } from 'expo';
import { box } from './utils/styles';
import { format, addMonths } from 'date-fns';
import Main from './containers/Main';
import { firebase } from './utils/firebase';

const provider = new firebase.auth.GoogleAuthProvider();
provider.providerId

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      today: new Date(),
      menu: 'home',
      user: undefined,
      accessToken: '',
      entered: false,
      isLoggingIn: false
    }

    this.googleLogin = this.googleLogin.bind(this);
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log("log in detected")
        this.setState({ user, isLoggingIn: false })
      } else {
        console.log("log out detected")
        this.setState({ user: undefined, entered: false })
      }
    });
  }
  async googleLogin() {
    this.setState({ isLoggingIn: true })
    try {
      const result = await Google.logInAsync({
        // androidClientId: YOUR_CLIENT_ID_HERE,
        iosClientId: '122077792070-s1ipe84g5gu368rnt8fl69jgqk0to63h.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
      });
      if (result.type === 'success') {
        let credential = firebase.auth.GoogleAuthProvider.credential(null, result.accessToken)
        firebase.auth().signInAndRetrieveDataWithCredential(credential)
      } else {
        // cancelled
        this.setState({ isLoggingIn: false });
      }
    } catch (e) {
      // error
      this.setState({ isLoggingIn: false });
    }
  }
  render() {
    if (this.state.entered) {
      return <Main user={this.state.user} />
    }

    const loginBtn = (
      <Button iconLeft primary onPress={this.googleLogin}>
        {
          this.state.isLoggingIn ?
            <React.Fragment>
              <Spinner />
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15, marginHorizontal: 10 }}>Processing login....</Text>
            </React.Fragment>
            :
            <React.Fragment>
              <Icon type="FontAwesome" name='google' />
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15, marginHorizontal: 10 }}>Login With Google  </Text>
            </React.Fragment>
        }
      </Button>
    )

    return (
      <Container>
        <Body style={styles.mainBody}>
          <ImageBackground
            source={require('./img/mainbg.jpg')}
            style={{
              width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center',
            }}
            opacity={0.5}>
            {/* <Icon name="bug" /> */}
            <Image source={{uri: 'https://i.imgur.com/oJ3VK4h.png'}} style={{width: 90, height: 66}} />
            <Text
              style={{
                fontSize: 20, color: 'black',
                textShadowColor: 'red',
                textShadowRadius: 2,
                textShadowOffset: {width: 2, height: 2}
              }}
            >MONEY BULL {this.state.accessToken}</Text>
            <View style={{ alignSelf: 'center', marginTop: 200 }} >
            {
              !this.state.user ? 
                loginBtn 
                : 
                <View style={{width: Dimensions.get('window').width/3, alignItems: 'center'}}>
                  <Image source={{url: this.state.user.photoURL}} style={{width: 80, height: 80, marginBottom: 5}} />
                  <Button block primary onPress={() => this.setState({entered: true})}>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15, marginHorizontal: 10 }} >Enter</Text>
                  </Button>
                </View>
            }
            </View>
  
          </ImageBackground>
        </Body>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  mainBody: {
    alignSelf: 'stretch',
    justifyContent: 'center',
  }
})