import React from 'react';
import { StyleSheet, Text, View, ScrollView, ImageBackground } from 'react-native';
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
        console.log(user);
        this.setState({ user })
      } else {
        this.setState({ user: undefined })
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
      this.setState({ isLoggingIn: false });

      if (result.type === 'success') {
        let credential = firebase.auth.GoogleAuthProvider.credential(null, result.accessToken)
        firebase.auth().signInAndRetrieveDataWithCredential(credential)
      } else {
        // cancelled
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

    return (
      <Container>
        <Body style={styles.mainBody}>
          <ImageBackground
            source={require('./img/mainbg.jpg')}
            style={{
              width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center',
            }}
            opacity={0.5}>
            <Icon name="bug" />
            <Text
              style={{
                fontSize: 20, color: 'black',
              }}
            >MONEY BUG {this.state.accessToken}</Text>
            <Button iconLeft primary style={{ alignSelf: 'center', marginTop: 200 }} onPress={this.googleLogin}>
              {
                this.state.isLoggingIn ?
                  <Spinner /> :
                  <React.Fragment>
                    <Icon type="FontAwesome" name='google' />
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15, marginHorizontal: 10 }}>Login With Google  </Text>
                  </React.Fragment>
              }
            </Button>
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