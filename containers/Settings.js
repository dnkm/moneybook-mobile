import React from 'react';
import {View, Text} from 'react-native';
import {firebase  } from "../utils/firebase";
import { Button } from 'native-base';


export default class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.signout = this.signout.bind(this);
    }
    signout() {
        firebase.auth().signOut();
    }
    render() {
        return (
            <View>
                <Button block light dark onPress={this.signout}>
                    <Text style={{color: 'white'}}>Logout</Text>
                </Button>
            </View>
        )
    }
}