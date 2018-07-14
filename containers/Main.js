import React from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native';
import { Container, Header, Title, Body, Footer, Content, FooterTab, Button, Icon } from 'native-base';
import { Constants } from 'expo';
import { box } from '../utils/styles';
import Settings from './Settings';
import Logs from "./Logs";
import Dashboard from  './Dashboard';
import {db,firebase, makeDoc} from '../utils/firebase';
import {addMonths, format, lastDayOfMonth, startOfMonth} from 'date-fns'

const TitleCenter = ({ today, changeMonthBy }) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Icon type="FontAwesome" name="angle-left" onPress={() => changeMonthBy(-1)}
        style={{ paddingLeft: 20, paddingRight: 20 }}
      />
      <Text style={{ marginLeft: 20, marginRight: 20, fontWeight: 'bold', fontSize: 15 }}>
        {format(today, 'YYYY - MM')}
      </Text>
      <Icon type="FontAwesome" name="angle-right" onPress={() => changeMonthBy(1)}
        style={{ paddingLeft: 20, paddingRight: 20 }}
      />
    </View>
  )
}

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      today: new Date(),
      menu: 'home',
      logs: []
    }
    this.changeMonthBy = this.changeMonthBy.bind(this);
    this.onAdd = this.onAdd.bind(this);
  }
  componentDidMount() {
    this.loadLogs();
  }
  async loadLogs() {
    let {today} = this.state;
    let query = db.collection('logs')
        .where('uid','==',firebase.auth().currentUser.uid)
        .where('logDate','>=',format(startOfMonth(today), 'YYYY-MM-DD'))
        .where('logDate','<=',format(lastDayOfMonth(today), 'YYYY-MM-DD'))
    let snapshot = await query.get();
    this.setState({logs: snapshot.docs}); 
  }
  changeMonthBy(offset) {
    this.setState(prev => ({
      today: addMonths(prev.today, offset)
    }), () => {
      this.loadLogs();
    });
    
  }
  onAdd(data) {
    data.amt = parseFloat(data.amt);
    data.uid = firebase.auth().currentUser.uid;
    data.createDate = firebase.firestore.FieldValue.serverTimestamp();
    data.logDate = format(new Date(), 'YYYY-MM-DD');
    data.type = this.state.menu

    db.collection('logs').add(data).then(docref => {
        this.setState(prev => {
            return {
                logs: prev.logs.concat([ makeDoc(docref.id, data) ])
            }
        })
    });
}
  render() {
    return (
      <Container>
        <Header>
          <Body>
            <TitleCenter today={this.state.today} changeMonthBy={this.changeMonthBy} />
          </Body>
        </Header>
        <Content style={{width: Dimensions.get('window').width * 9.5 / 10, alignSelf: 'center', marginVertical: 20}}>
          {
            this.state.menu === "home" && <Dashboard logs={this.state.logs} today={this.state.today} />
          }
          {
            this.state.menu === "settings" && <Settings />
          }
          {
            (this.state.menu === "expenses" || this.state.menu === "income") && 
                <Logs mode='expenses' logs={this.state.logs} type={this.state.menu} onAdd={this.onAdd} />
          }

        </Content>
        <Footer>
          <FooterTab>
            {
              [
                { menu: 'home', icon: 'home', text: 'Home', color: 'salmon' },
                { menu: 'expenses', icon: 'card', text: 'Expenses', color: 'lightseagreen' },
                { menu: 'income', icon: 'cash', text: 'Income', color: 'dodgerblue' },
                { menu: 'settings', icon: 'settings', text: 'Settings', color: 'gold' },
              ].map(v => {
                let isActive = this.state.menu === v.menu;
                return (
                  <Button
                    key={v.menu}
                    vertical
                    active={isActive}
                    onPress={() => this.setState({ menu: v.menu })}>
                    <Icon name={v.icon} />
                    <Text style={{color: isActive ? v.color : 'darkgray'}}>{v.text}</Text>
                  </Button>
                )
              })
            }
            {/* <Button vertical active={this.state.menu === 'home'}>
              <Icon name="home" />
              <Text>Home</Text>
            </Button>
            <Button vertical>
              <Icon name="card" />
              <Text>Expense</Text>
            </Button>
            <Button vertical>
              <Icon name="cash" />
              <Text>Income</Text>
            </Button>
            <Button vertical onPress={() => this.setState({ menu: 'settings' })}>
              <Icon name="settings" />
              <Text>Settings</Text>
            </Button> */}
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {

  },
  title: {
    alignItems: 'center',
    backgroundColor: 'orange'
  }
});
