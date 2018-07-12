import React, {Component} from "react";
import {View, Text} from "react-native";
import { List, ListItem } from "native-base";

export default class Dashboard extends Component {

    render() {
        const {logs} = this.props;
        let total = {
            income: 0,
            expense: 0
        }
        if (logs.length > 0) {
            total = logs.reduce((acc, cur) => {
                let log = cur.data();
                if (log.type === 'income') {
                    acc.income += log.amt
                } else {
                    acc.expense += log.amt
                }
                return acc;
            }, total);
        };

        return (
            <View>
                <View
                    style={{
                    borderColor: 'gold',
                    borderWidth: 5,
                    borderRadius: 5,
                    padding: 5
                }}>
                    <View
                        style={{
                        flexDirection: 'row',
                        padding: 10
                    }}>
                        <Text style={{
                            flex: 1,
                            fontSize: 15
                        }}>Total Earnings This Month</Text>
                        <Text
                            style={{
                            width: 100,
                            fontSize: 15,
                            fontWeight: 'bold',
                            color: 'lightseagreen'
                        }}>$ {total.income.toFixed(2)}</Text>
                    </View>
                    <View
                        style={{
                        flexDirection: 'row',
                        borderColor: 'gold',
                        borderTopWidth: 5,
                        padding: 10
                    }}>
                        <Text style={{
                            flex: 1,
                            fontSize: 15
                        }}>Total Spending This Month</Text>
                        <Text
                            style={{
                            width: 100,
                            fontSize: 15,
                            fontWeight: 'bold',
                            color: 'salmon'
                        }}>$ {total.expense.toFixed(2)}</Text>
                    </View>
                </View>

                <View style={{marginTop: 20}}>
                    <Text style={styles.h1}>Recent Transactions</Text>
                    <List 
                        dataArray={
                            logs
                                .sort((a,b) => b.data().createDate - a.data().createDate)
                                .slice(0, 5)
                        }
                        renderRow={item => 
                            <ListItem style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }}>
                                <Text style={{width:100}}>{item.data().logDate.substring(6)}</Text>
                                <Text style={{flex:1}}>
                                    {item.data().text}
                                </Text>
                                <Text style={{
                                    width:100,
                                    color: item.data().type === 'income' ? 'lightseagreen' : 'salmon'
                                }}>$ {item.data().amt}</Text>
                            </ListItem>
                        }
                    />
                </View>

                <View style={{marginTop: 20}}>
                    <Text style={styles.h1}>Top Expenses</Text>
                    <List 
                        dataArray={
                            logs
                                .filter(log => log.data().type === 'expenses')
                                .sort((a,b) => b.data().amt - a.data().amt)
                                .slice(0, 5)
                        }
                        renderRow={item => 
                            <ListItem style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }}>
                                <Text style={{width:100}}>{item.data().logDate.substring(6)}</Text>
                                <Text style={{flex:1}}>{item.data().text}</Text>
                                <Text style={{
                                    width:100,
                                    color: item.data().type === 'income' ? 'lightseagreen' : 'salmon'
                                }}>$ {item.data().amt}</Text>
                            </ListItem>
                        }
                    />
                </View>

            </View>
        )
    }
}

const styles = {
    h1: {
        fontSize: 17,
        fontWeight: 'bold'
    }
}