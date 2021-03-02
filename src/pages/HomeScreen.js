/*Home Screen With buttons to navigate to diffrent options*/
import React from 'react';
import { View } from 'react-native';
import Mybutton from './components/Mybutton';
import Toast from 'react-native-toast-message';
import ProgressDialog from '../utils/loader'
import {get} from '../utils/apiUtils'
import {CompanyWiseUnitLineSchema, HourInfoSchema, DailyPlanSchema, DeviceWiseProductionSchema, DemoUserSchema, QmsSecurityProductionDeviceInfo} from '../db/schemas/dbSchema'
import Realm from 'realm';
let realm;

export default class HomeScreen extends React.Component {

    state = {
      loading: false,
    }

  constructor(props) {
    super(props);
    realm = new Realm({
      path: 'QmsDb.realm',
      schema: [
        DemoUserSchema,
        //CompanyWiseUnitLineSchema,
        HourInfoSchema,
        DailyPlanSchema,
        DeviceWiseProductionSchema,
        QmsSecurityProductionDeviceInfo
      ],
    });
  }

  componentDidMount(){
    const tasks = realm.objects(QmsSecurityProductionDeviceInfo.name);    
    console.log(tasks.length);
      if(tasks.length === 0){
        this.setState({loading: true}, ()=> this.getInitialData());
          //this.getInitialData();
      }
  }
//adb pull /data/data/com.rnrelmdbsync/files/QmsDb.realm QmsDb.realm

  getInitialData(){
    //console.log('came here..')
    get('/GetCompanyUnitLineData')
    .then(response => {

        this.setState({loading: false}, ()=>{
            var responseData = response.data;
          console.log(responseData.compUnitData.length);
          console.log(responseData.timeHourData.length);
        if(responseData){
            Toast.show({
                type: 'success',
                position: 'bottom',
                text1: 'Successed!',
                text2: 'It\'s ok! 👋',
                visibilityTime: 1000,
                })

              // try { Write Data if data dosen't exixts
                realm.write(() => {
                    responseData.compUnitData.forEach(obj => {
                      realm.create(QmsSecurityProductionDeviceInfo.name, obj);
                  });

                    responseData.timeHourData.forEach(obj => {
                    realm.create(HourInfoSchema.name, obj);
                  });
                  //realm.create('Car', {make: 'Honda', model: 'Accord', drive: 'awd'});
                });
              // } catch (e) {
              //   console.log("Error on creation");
              // }

            //console.log(responseData);
            //this.props.navigation.navigate('HomeScreen', responseData.userObj);
        }else{
            Toast.show({
                type: 'error',
                position: 'bottom',
                text1: 'Error!X',
                text2: responseData.vMessage,
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
  //adb root  adb pull /data/data/com.rnrelmdbsync/files/QmsDb.realm QmsDb.realm
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
        <Mybutton
          title="Login"
          customClick={() => this.props.navigation.navigate('Update')}
        />
        <Mybutton
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
        />
      </View>
    );
  }
}