/*Home Screen With buttons to navigate to diffrent options*/
import React from 'react';
import { View } from 'react-native';
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

type Props = {
  navigation: NavigationScreenProp<any,any>
};

type State = {
  loading: boolean;
  today: string
};

export default class HomeScreen extends React.Component<Props, State> {

    state: State = {
      loading: false,
      today: moment().format('YYYY-MM-DD'),
    }

  constructor(props: Props) {
    super(props);
    this.props.navigation.addListener(
      'didFocus',
      payload => {
        Orientation.lockToPortrait();
      });
  }

  componentDidMount(){
    Orientation.lockToPortrait()
    
    /***
     * //#region TODO:
     * 
     * # Parsist Login & Other data for today only (✔)
     * # Remove other data from any other day (✔)
     * # Day Close option for production and then sync immediately
     * # If there is already login data for today fetch those data, otherwsie logout (✔)
     * # Data summery minimal json for sync,
     * # Sync flag for current data if synced successfully...
     * 
     * 
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
      this.props.navigation.navigate('DeviceLogin')
    }
  }

  getInitialData(): void{
    /**Clear Stale Local DB Data */  
    clearStaleLocalDb();
    //console.log('came here..')GetCompanyUnitLineData
    get('/GetCompanyUnitLineData')
    .then((response: any) => {

        this.setState({loading: false}, ()=>{
            var responseData = response.data;

        if(responseData){
          
          var deviceSecInfo = responseData.compUnitData;
          var defectRaw = responseData.defectRawData;
            Toast.show({
                type: 'success',
                position: 'bottom',
                text1: 'Successed!',
                text2: 'It\'s ok! 👋',
                visibilityTime: 1000,
                })
              // try { Write Data if data dosen't exixts
              setDeviceAndDefectMasterDataLocalDB(deviceSecInfo, defectRaw);
        }else{
            Toast.show({
                type: 'error',
                position: 'bottom',
                text1: 'Error!X',
                text2: "Something wrong happend!",
                visibilityTime: 1000,
                })
        }
        });

    })
    .catch(errorMessage => {   
        this.setState({loading: false}, ()=>{
            Toast.show({
                type: 'error',
                text1: 'catch Error!',
                text2: errorMessage
                })
        }); 
    });
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
          backgroundColor: 'white',
          flexDirection: 'column',
        }}>
        <ProgressDialog loading={this.state.loading} />
        {/* <Mytext text="RealM Example" /> */}
        <View></View>
        <View style={{position:'absolute', bottom: '10%', width: '100%'}}>
          <Mybutton
            title="Start"
            customClick={() => this.checkLoggedInAndRouteToSetupData()}
          />
        </View>
        {/* <Mybutton
          title="Register"
          customClick={() => this.props.navigation.navigate('Register')}
        />
        <Mybutton
          title="Update"
          customClick={() => this.props.navigation.navigate('Update')}
        />
        <Mybutton
          title="View"
          customClick={() => this.props.navigation.navigate('View')}
        />
        <Mybutton
          title="View All"
          customClick={() => this.props.navigation.navigate('ViewAll')}
        />
        <Mybutton
          title="Delete"
          customClick={() => this.props.navigation.navigate('Delete')}
        /> */}
      </View>
    );
  }
}