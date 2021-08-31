/*Home Screen With buttons to navigate to diffrent options*/
import React from 'react';
import { View, Image, StatusBar, Alert, Linking, BackHandler } from 'react-native';
import DeviceInfo from 'react-native-device-info'
import Mybutton from './components/Mybutton';
import moment from 'moment'
import Toast from 'react-native-toast-message';
import ProgressDialog from '../utils/loader'
import {get} from '../utils/apiUtils'
import Orientation from 'react-native-orientation';
import { NavigationScreenProp } from 'react-navigation';
import {
  clearStaleLocalDb, 
  getCurrentLoggedInUserForToday, 
  planDataExistsForToday,
  setDeviceAndDefectMasterDataLocalDB
} from '../db/dbServices/__Home_LDB_Func'
import {syncBulkData} from '../db/dbServices/__LDB_Count_Services'
import { __MASTER_DATA_PATH } from '../utils/constKVP';

type Props = {
  navigation: NavigationScreenProp<any,any>
};

type State = {
  loading: boolean;
  today: string,
  okToGo: boolean,
  currentVersion: number
};

export default class HomeScreen extends React.Component<Props, State> {

    state: State = {
      loading: false,
      today: moment().format('YYYY-MM-DD'),
      okToGo: false,
      currentVersion: parseFloat(DeviceInfo.getVersion())
    }

  constructor(props: Props) {
    super(props);
    this.props.navigation.addListener(
      'didFocus',
      payload => {
        Orientation.lockToLandscapeLeft();
      });
  }

  componentDidMount(){
    Orientation.lockToLandscapeLeft();
    
    /***
     * //#region TODO:
     * 
     * # Parsist Login & Other data for today only (✔)
     * # Remove other data from any other day (✔)
     * # Day Close option for production and then sync immediately
     * # If there is already login data for today fetch those data, otherwsie logout (✔)
     * # Sync flag for current data if synced successfully...
     * 
     */


    //const deviceinfo = realm.objects(QmsSecurityProductionDeviceInfo.name);    
    //console.log(deviceinfo.length);
      //if(deviceinfo.length == 0){
        //this.clearLocalDb();
        this.setState({loading: true}, ()=> this.getInitialData());
          //this.getInitialData();
     // }
  }
//adb pull /data/data/com.rnrelmdbsync/files/QmsDb.realm QmsDb.realm


  checkLoggedInAndRouteToSetupData(): void{
    let loginData = getCurrentLoggedInUserForToday(this.state.today);
    let planDataExists = planDataExistsForToday(this.state.today);
    //allDeviceInfo = convertToArray(allDeviceInfo);

    if(loginData.length > 0 && planDataExists){
      console.log('already logged in')
      var reqObj = loginData[0];
      this.props.navigation.navigate('SetupData',{ userData:  reqObj });
      /**Route to Setup Data */
    }else{
      /**Route to Device Login */
      console.log('not logged in')
      if(this.state.okToGo){
          this.props.navigation.navigate('DeviceLogin')
      }else{
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Error!',
          text2: "Something wrong happend!, Exit the app and try again",
          visibilityTime: 1000,
          })
      }

    }
  }

  getInitialData = async () => {
    /**Sync Old data before data cleaning */
    let isSucceed = await syncBulkData();
    
    if(isSucceed){
      /**Clear Stale Local DB Data */  
        clearStaleLocalDb();
 
    //console.log('came here..')GetCompanyUnitLineData
    await get(__MASTER_DATA_PATH)
    .then((response: any) => {

        this.setState({loading: false, okToGo: true}, ()=>{
            var responseData = response.data;

        if(responseData){
          
          var deviceSecInfo = responseData.compUnitData;
          var defectRaw = responseData.defectRawData;
          var latestVersion = responseData.versionData;

          if(this.state.currentVersion < latestVersion.currentVersion){
              Alert.alert(
                "✨ New Update Available!",
                "Please, update the app to continue working.\nYou won't be able to use the app if the app isn't updated.",
                [
                  { text: "Update", onPress: () => {
                      Linking.openURL(latestVersion.appUrl ?? "https://www.google.com/").catch(err => console.error("Couldn't load page", err));
                    } 
                  },
                ],
                { cancelable: false }
              );
          }else{
            Toast.show({
              type: 'success',
              position: 'bottom',
              text1: 'Successed!',
              text2: 'It\'s ok! 👋',
              visibilityTime: 1000,
              })
            // try { Write Data if data dosen't exixts
            setDeviceAndDefectMasterDataLocalDB(deviceSecInfo, defectRaw);
          }
        }else{
            Toast.show({
                type: 'error',
                position: 'bottom',
                text1: 'Error!',
                text2: "Error with server response",
                visibilityTime: 1000,
                })
        }
        });

    })
    .catch(errorMessage => {   
        this.setState({loading: false, okToGo: false}, ()=>{
            Toast.show({
                type: 'error',
                text1: 'Error with internet connection!',
                text2: errorMessage
                })
        }); 
    });

  }else{
    this.setState({loading: false}, ()=> {
      Toast.show({
        type: 'error',
        text1: 'Sync Error!',
        text2: "Old Data sync failed..."
        })
      
    })
  }

}
  // https://docs.mongodb.com/realm-legacy/docs/javascript/latest/api/tutorial-query-language.html
  //adb root  adb pull /data/data/com.rnrelmdbsync/files/QmsDb.realm QmsDb.realm
  //adb pull /data/data/com.rnrelmdbsync/files/QmsDb.realm C:\Users\absjabed\Desktop\realmdb\QmsDb.realm
  //https://github.com/lawnstarter/react-native-picker-select
  //https://reactnative.dev/docs/typescript#adding-typescript-to-an-existing-project
  //https://docs.mongodb.com/realm/react-native/objects/
  //https://aboutreact.com/example-of-realm-database-in-react-native/
  //https://stackoverflow.com/questions/50937202/how-to-fast-insert-a-json-into-realm-database-for-a-react-native-app

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#151a30',
          flexDirection: 'column',
        }}>
        <StatusBar hidden />
        <ProgressDialog loading={this.state.loading} />
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
        <Image style={{ height: 150, width: 150}} source={require('../assets/images/scr_icon.png')}></Image>
        </View>
        <View style={{position:'absolute', bottom: '10%', width: '100%'}}>
          <Mybutton
            title="Start"
            //disabled = {!this.state.okToGo}
            customClick={() => this.checkLoggedInAndRouteToSetupData()}
            style={{
              backgroundColor: '#28a745',
              width: "50%",
              alignSelf: "center"
            }}
          />
        </View>
      </View>
    );
  }
}