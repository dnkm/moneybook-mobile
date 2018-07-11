import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Container, Header, Title, Body, Footer, Content, FooterTab, Button, Icon } from 'native-base';
import { Constants } from 'expo';
import { box } from '../utils/styles';
import { format, addMonths } from 'date-fns';

const TitleCenter = ({today, changeMonthBy}) => {
  return (
    <View style={{flexDirection:'row', alignItems:'center'}}>
      <Icon type="FontAwesome" name="angle-left" onPress={() => changeMonthBy(-1)}
        style={{paddingLeft: 20, paddingRight: 20}}
      />
      <Text style={{marginLeft: 20, marginRight: 20, fontWeight: 'bold', fontSize: 15}}>
        {format(today, 'YYYY - MM')}
      </Text>
      <Icon type="FontAwesome" name="angle-right" onPress={() => changeMonthBy(1)} 
        style={{paddingLeft: 20, paddingRight: 20}}
      />
    </View>
  )
}

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      today: new Date(),
      menu: 'home'
    }
    this.changeMonthBy = this.changeMonthBy.bind(this);
  }
  changeMonthBy(offset) {
    this.setState(prev=>({
      today: addMonths(prev.today, offset)
    }));
  }
  render() {
    return (
      <Container>
        <Header>
          <Body>
              <TitleCenter today={this.state.today} changeMonthBy={this.changeMonthBy} />
          </Body>
        </Header>
        <Content>
          <Text>&nbsp;&nbsp;hm..</Text>
        </Content>
        <Footer>
          <FooterTab>
            <Button vertical active={this.state.menu==='home'}>
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
            <Button vertical>
              <Icon name="settings" />
              <Text>Settings</Text>
            </Button>
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
