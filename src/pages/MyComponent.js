import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { DataTable } from 'react-native-paper';
import { color } from 'react-native-reanimated';
import { getCurrentLoggedInUserForToday } from '../db/dbServices/__Home_LDB_Func';
import { handleAndroidBackButton } from '../utils/backHandler.config';


const fetchURL = 'http://eots.kdsgroup.net:81/qmsapi/ApiData/GetProductionSummery?date=';
// const getItems = () => fetch(fetchURL).then(res => res.json());

const MyComponent = ({ navigation }) => {

    const [dataList, setDataList] = useState([]);
    console.log("hour id", dataList.vHourId)
    const [date, setDate] = useState(moment().format('YYYY-MM-DD'))
    const [currentLogin, setCurrentLogin] = useState(getCurrentLoggedInUserForToday(date))
    console.log("CURRREN" + JSON.stringify(currentLogin))
    // current_login = getCurrentLoggedInUserForToday(moment().format('YYYY-MM-DD'));
    //console.log(users)
    // console.log(users.dDateOfProduction)

    var [sumDef, setSumDef] = useState();
    var [sumPro, setSumPro] = useState();
    var [sumDam, setSumDam] = useState()

    var [sumRew, setSumRew] = useState()

    navigation.addListener(
        'didFocus',
        payload => {

            handleAndroidBackButton(navigateBack);
        });

    const navigateBack = () => {
        navigation.goBack();
    }


    useEffect(() => {
        console.log('date', date);
        console.log("currentLogin.vUnitLineId", currentLogin[0].vUnitLineId);
        fetch(fetchURL + date + '&vUnitLineId=' + currentLogin[0].vUnitLineId)
            .then((response) => {

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                } else {
                    return response.json();
                }

            }
            )

            .then((json) => {
                setDataList(json.sort((a1, a2) => (Number(a2.vHourId.replace("H", "")) - Number(a1.vHourId.replace("H", "")))))
                var mappingDefect = json.map(s => s.iDefectCount)
                var sumDef = mappingDefect.reduce((pre, cur) => (pre + cur));


                var mappingProduction = json.map(s => s.iProductionCount)
                var sumPro = mappingProduction.reduce((pre, cur) => (pre + cur))


                var mappingDamage = json.map(s => s.iRejectCount)
                var sumDam = mappingDamage.reduce((pre, cur) => (pre + cur))

                var mappingRework = json.map(s => s.iReworkedCount)
                var sumRew = mappingRework.reduce((pre, cur) => (pre + cur))

                setSumDef(sumDef)
                setSumPro(sumPro)
                setSumDam(sumDam)
                setSumRew(sumRew)

            }
            )
            .catch((error) => console.error(error))
        // .finally(() => setLoading(false));

    }, []);

    const ListHeader = () => {
        //View to set in Header
        return (
            <View style={styles.headerFooterStyle}>
                <View style={styles.row}>
                    <Text style={styles.textStyle}>Hour</Text>
                    <Text style={styles.textStyle}>QC Pass</Text>
                    <Text style={styles.textStyle}>FTT</Text>
                    <Text style={styles.textStyle}>Defect</Text>
                    <Text style={styles.textStyle}>Damaged</Text>
                    <Text style={styles.textStyle}>Reworked</Text>
                    <Text style={styles.textStyle}>Inspected</Text>
                </View>
            </View>
        );
    };


    const ListFooter = () => {
        //View to set in Footer
        return (
            <View style={styles.headerFooter}>
                <View style={styles.row}>
                    <Text style={styles.textStyle}>Total</Text>
                    <Text style={styles.textStyle}>{sumPro + sumRew}</Text>
                    <Text style={styles.textStyle}>{sumPro}</Text>
                    <Text style={styles.textStyle}>{sumDef}</Text>
                    <Text style={styles.textStyle}>{sumDam}  </Text>
                    <Text style={styles.textStyle}>{sumRew}  </Text>
                    <Text style={styles.textStyle}>{sumPro + sumDef}  </Text>
                </View>
            </View>
        );
    };

    const getItem = (item) => {
        // Function for click on an item
        alert('hour : ' + item.vHourId + ' Title : ' + item.iProductionCount + " Defect :" + item.iDefectCount + " Damage :" + item.iRejectCount);
    };

    const ItemView = ({ item, index }) => {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: index % 2 == 0 ? '#ddebf7' : 'white'
                }}
            >
                <View style={styles.row}>
                    <Text style={styles.myStyle}> {item.vHourId}</Text>
                    <Text style={styles.myStyle}>{item.iProductionCount + item.iReworkedCount}</Text>
                    <Text style={styles.myStyle}>{item.iProductionCount}</Text>
                    <Text style={styles.myStyle}>{item.iDefectCount}</Text>
                    <Text style={styles.myStyle}>{item.iRejectCount}</Text>
                    <Text style={styles.myStyle}>{item.iReworkedCount}</Text>
                    <Text style={styles.myStyle}>{item.iProductionCount + item.iDefectCount}</Text>
                </View>
            </View>
        );
    };

    return (
        <>
            <SafeAreaView style={{ flex: 1 }}>
                <FlatList
                    data={dataList}
                    keyExtractor={(item, index) => index.toString()}
                    // ItemSeparatorComponent={ItemSeparatorView}
                    //Header to show above listview
                    ListHeaderComponent={ListHeader}
                    //Footer to show below listview
                    ListFooterComponent={ListFooter}
                    renderItem={ItemView}
                // ListEmptyComponent={EmptyListMessage}
                />
            </SafeAreaView>

        </>
    );
}

export default MyComponent;


const styles = StyleSheet.create({


    emptyListStyle: {
        padding: 10,
        fontSize: 18,
        textAlign: 'center',
    },
    itemStyle: {
        padding: 10,


    },
    headerFooterStyle: {
        width: '100%',
        height: 45,
        backgroundColor: '#305496',


    },
    headerFooter: {
        width: '100%',
        height: 45,
        backgroundColor: '#305496',
    },
    textStyle: {
        flex: 1,
        textAlign: 'center',
        color: '#fff',
        fontSize: 18,
        padding: 7,
        fontFamily: 'Roboto'

    },
    myStyle: {
        flex: 1,
        textAlign: 'center',
        color: 'black',
        fontSize: 14,
        padding: 5,
        fontWeight: 'bold'

    },
    row: {
        flexDirection: "row",
    },
    rows: {
        flexDirection: 'row',
        flex: 1
    },

})