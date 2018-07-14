import React from 'react';
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { getDaysInMonth, getDay, startOfMonth } from 'date-fns';

export default class LogCalendar extends React.Component {
    render() {
        const {logs, today} = this.props;

        let numDays = getDaysInMonth(today);
        let firstDay = getDay(startOfMonth(today));
        let totalCells = Math.ceil((numDays + firstDay) / 7) * 7;
        const days = new Array( totalCells ).fill(0).map((_, i) => {
            let num = i + 1 - firstDay;

            return {
                date: (num < 1 || num > numDays) ? '' : num,
                income: 0,
                expenses: 0
            }
        });

        console.log('totalcells', totalCells);

        logs.forEach(log => {
            let date = log.data().logDate.split()[2];
            console.log(date);
            // if (log.data().type === 'income')
            //     days[date+firstDay].income += log.data().amt;
            // else
            //     days[date+firstDay].expenses += log.data().amt;
        })

        return (
            <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                marginVertical: 20,
                borderRadius: 2,
                borderTopWidth: 1,
                borderLeftWidth: 1,
                borderColor: 10
            }}>
                {
                    days.map((d,i) => 
                        <View key={i} style={{
                            width: (Dimensions.get('window').width - 30) / 7,
                            borderRightWidth: 1,
                            borderBottomWidth: 1,
                            borderColor: 10,
                            flexGrow: 1,
                            flexShrink: 0,
                            padding: 10
                        }}>
                            <Text style={{color: 'gray'}}>{d.date}</Text>
                            <Text style={{color: 'lightseagreen'}}>{d.income}</Text>
                            <Text style={{color: 'salmon'}}>{d.expenses}</Text>
                        </View>
                    )
                }
            </View>
        )
    }
}

