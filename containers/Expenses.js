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
            text: '', amt: 0
        }
    }
    render() {
        return (
            <React.Fragment>
                <Form>
                    <Item stackedLabel>
                        <Label>Text</Label>
                        <Input onChangeText={text => this.setState({text})} />
                    </Item>
                    <Item stackedLabel>
                        <Label>Price</Label>
                        <Input keyboardType='decimal-pad' onChangeText={amt => this.setState({amt})} />
                    </Item>
                </Form>
                <Button primary block style={{marginTop: 5}} onPress={() => {
                    this.props.onAdd({...this.state});
                }}>
                    <Text style={{color: 'white', marginHorizontal: 3}}>ADD</Text>
                </Button>
            </React.Fragment>
        )
    }
}

export default class Expenses extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expenses: []
        }
        this.onAdd = this.onAdd.bind(this);
    }
    async componentDidMount() {
        let {today} = this.props;
        let snapshot = await db.collection('expenses')
            .where('uid','==',firebase.auth().currentUser.uid)
            .where('logDate','>=',format(startOfDay(today), 'YYYY-MM-DD'))
            .where('logDate','<=',format(lastDayOfMonth(today), 'YYYY-MM-DD'))
            .get();
        this.setState({expenses: snapshot.docs});    
    }
    onAdd(data) {
        data.uid = firebase.auth().currentUser.uid;
        data.createDate = firebase.firestore.FieldValue.serverTimestamp();
        data.logDate = format(new Date(), 'YYYY-MM-DD');

        db.collection('expenses').add(data).then(docref => {
            this.setState(prev => {
                return {
                    expenses: prev.expenses.concat([ makeDoc(docref.id, data) ])
                }
            })
        });
    }
    render() {
        return (
            <View>
                <ExpenseAddForm onAdd={this.onAdd} />
                {
                    // this.state.expenses.map(exp => <Expense key={exp.id} expense={exp} /> )
                }
                <List 
                    dataArray={this.state.expenses}
                    renderRow={item => 
                        <ListItem>
                            <Text>{item.data().text}</Text>
                            <Text>{item.data().amt}</Text>
                        </ListItem>
                    }
                />
            </View>
        )
    }
}