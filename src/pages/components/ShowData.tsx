import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { queryRead, ReadFromRealm } from '../../db/dbServices/__LDB_Count_Services';
// import { NavigationScreenProp } from 'react-navigation';

// import { RootStackParamList } from '../RootStackPrams';
// import useNavigation from 'use-navigation';
// import { StackNavigationProp } from 'react-navigation-stack/lib/typescript/src/vendor/types';

// type MultipleSizeCount = StackNavigationProp<RootStackParamList, 'MultipleSizeCount'>;

interface IUser {
    name: string,
    // today: string,
    totalDayFttCount: number,
    // totalDayDefectCount: number,
    // totalDayRejectCount: number,
    // totalDayReworkedCount: number,

    // fttCount: number,
    // defectCount: number,
    // rejectCount: number,
    // reworkedCount: number,

    // incrementBy: number,
    // screenWidth: number,
    // screenHeight: number,
    // modalVisible: boolean,

    // shwoNextButton: boolean,
    // showStyleImage: boolean,
    // modeCode: number,
    // modeColor: string,

    // allDefects: any[],
    // defectCategories: any[],
    // filteredDefects: any[],
    // allSizes: any[],
    // selectedSizeId: any,
    // selectedDefectObj: any,
    // selectedDefectCategory: any,
    // selectedDefectHeadId: any,

    // currentProdObj: any,
    // current_login: any,
    // currentProdCountObj: any,

    // unitName: string,
    // lineName: string,

    // countLocked: boolean,
    // timeLeft: number,

    // currentHour: any,
    // isConnected: boolean | null,
    // isApiOK: boolean | null,
    // isSynced: boolean | null,

}
const ShowData: React.FC = () => {


    // const [user, setUser] = useState<any>([]);
    // //   const [date, setDate] = useState<IUser>({today: 'Jon'});
    // const [totalDayFttCount, setTotalDayFttCount] = useState<number>(0);


    // // const navigation = useNavigation<MultipleSizeCount>();
    // // const press =() =>{
    // //     navigation.navigate()
    // // }
    // const reloadData = () => {
    //     queryRead().then((item) => {
    //         setUser({ item })
    //     }).catch((error) => {
    //         console.log(error)
    //     })


    // }

    return (
        <View>
            <Text>Press</Text>
        </View>
        // <SafeAreaView >
        //     <FlatList
        //         data={user}

        //         keyExtractor={(item, index) => index.toString()}
        //         renderItem={({ item }) => (
        //             <View style={{ backgroundColor: 'white', padding: 20 }}>
        //                 <Text>Id: {item.iAutoId}</Text>
        //                 <Text>Name: {item.vUnitName}</Text>
        //                 {/* <Text>Contact: {item.contact}</Text>
        //         <Text>Address: {item.address}</Text> */}
        //             </View>
        //         )}
        //     />
        // </SafeAreaView>
    )
}

export default ShowData

const styles = StyleSheet.create({})