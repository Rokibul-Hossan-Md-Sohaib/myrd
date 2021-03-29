/*Home Screen With buttons to navigate to diffrent options*/
import React from 'react';
import { View } from 'react-native';
import Mybutton from './components/Mybutton';
import Toast from 'react-native-toast-message';
import ProgressDialog from '../utils/loader'
import {get} from '../utils/apiUtils'
import {HourInfoSchema, DailyPlanSchema, DeviceWiseProductionSchema, DefectSchema, CurrentLoggedInUserSchema, QmsSecurityProductionDeviceInfo} from '../db/schemas/dbSchema'
import Realm from 'realm';
import Orientation from 'react-native-orientation';
let realm;

export default class HomeScreen extends React.Component {

    state = {
      loading: false,
    }

  constructor(props) {
    super(props);
    this.props.navigation.addListener(
      'didFocus',
      payload => {
        Orientation.lockToPortrait()
      });  
    realm = new Realm({
      path: 'QmsDb.realm',
      schema: [
        CurrentLoggedInUserSchema,
        HourInfoSchema,
        DailyPlanSchema,
        DeviceWiseProductionSchema,
        QmsSecurityProductionDeviceInfo,
        DefectSchema,
      ],
    });
  }

  componentDidMount(){
    Orientation.lockToPortrait()
    //const deviceinfo = realm.objects(QmsSecurityProductionDeviceInfo.name);    
    //console.log(deviceinfo.length);
      //if(deviceinfo.length == 0){
        //this.clearLocalDb();
        this.setState({loading: true}, ()=> this.getInitialData());
          //this.getInitialData();
     // }
  }
//adb pull /data/data/com.rnrelmdbsync/files/QmsDb.realm QmsDb.realm

clearLocalDb = () => {
  //todays date
  let dateObj = new Date();

   realm.write(() => {
  
    let allDeviceInfo = realm.objects(QmsSecurityProductionDeviceInfo.name);
    console.log('clear Device info', allDeviceInfo.length)
    realm.delete(allDeviceInfo);

    let existingData = realm.objects(DeviceWiseProductionSchema.name)
    .filtered('dDateOfProduction != $0', dateObj);
    console.log('clear Previous Prod Data', existingData.length)
    realm.delete(existingData);

    let loginData = realm.objects(CurrentLoggedInUserSchema.name)
    .filtered('dateTime != $0', dateObj);;
    console.log('clear Previous login data', loginData.length)
    realm.delete(loginData);

    let allDefects = realm.objects(DefectSchema.name);
    realm.delete(allDefects);
  //console.log('all device', allDeviceInfo.length) !=dateTime

  // let allHourInfo = realm.objects(HourInfoSchema.name);
  // realm.delete(allHourInfo);
  // Create a book object
  //let book = realm.create('Book', {id: 1, title: 'Recipes', price: 35});

  // Delete the book
  //realm.delete(book);

  // Delete multiple books by passing in a `Results`, `List`,
  // or JavaScript `Array`
});
 
}

  getInitialData(){
    this.clearLocalDb();
    //console.log('came here..')GetCompanyUnitLineData
    get('/GetCompanyUnitLineData')
    .then(response => {

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
                realm.write(() => {
                  deviceSecInfo.forEach(obj => {
                      realm.create(QmsSecurityProductionDeviceInfo.name, obj);
                  });

                  defectRaw.forEach(obj => {
                    realm.create(DefectSchema.name, obj);
                });
                  //realm.create('Car', {make: 'Honda', model: 'Accord', drive: 'awd'});
                });
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
            customClick={() => this.props.navigation.navigate('DeviceLogin')}
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