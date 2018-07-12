import React from 'react';
import {View, Text} from 'react-native';
import {db,firebase, makeDoc} from '../utils/firebase';
import {getMonth, getYear, format, lastDayOfMonth, startOfDay} from 'date-fns'
import { Form, Item, Input, Label, Button, List, ListItem } from 'native-base';

const Expense = ({expense}) => (
    <View>
        <Text>expense!</Text>
    </View>
);

class ExpenseAddForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '', amt: ''
        }
    }
    render() {
        return (
            <View style={{
                borderColor: 'gold',
                borderWidth: 5,
                borderRadius: 5,
                padding: 5
            }}>
                <Form>
                    <Item stackedLabel>
                        <Label>Text</Label>
                        <Input onChangeText={text => this.setState({text})} value={this.state.text} />
                    </Item>
                    <Item stackedLabel>
                        <Label>Price</Label>
                        <Input keyboardType='decimal-pad' onChangeText={amt => this.setState({amt})} value={this.state.amt} />
                    </Item>
                </Form>
                <Button primary block style={{marginTop: 5}} onPress={() => {
                    let data = this.state;
                    this.setState({text:'', amt: ''})
                    this.props.onAdd({...this.state});
                }}>
                    <Text style={{color: 'white', marginHorizontal: 3}}>ADD</Text>
                </Button>
            </View>
        )
    }
}

export default class Logs extends React.Component {
    render() {
        let {logs, type, onAdd} = this.props;

        if (type) {
            logs = logs.filter(log => log.data().type === type);
        }

        return (
            <View>
                <ExpenseAddForm onAdd={onAdd} />
                {
                    // this.state.expenses.map(exp => <Expense key={exp.id} expense={exp} /> )
                }
                <View style={{marginTop: 30}}>
                    <Text style={{fontWeight: 'bold', fontSize: 17}}>{type}</Text>
                </View>
                <List 
                    dataArray={logs}
                    renderRow={item => 
                        <ListItem style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}>
                            <Text style={{width:100}}>{item.data().logDate.substring(6)}</Text>
                            <Text style={{flex:1}}>{item.data().text}</Text>
                            <Text style={{width:100}}>$ {item.data().amt}</Text>
                        </ListItem>
                    }
                />
            </View>
        )
    }
}