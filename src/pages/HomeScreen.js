/*Home Screen With buttons to navigate to diffrent options*/
import React from 'react';
import { View } from 'react-native';
import Mybutton from './components/Mybutton';
import Mytext from './components/Mytext';
import ProgressDialog from '../utils/loader'
import {CompanyWiseUnitLineSchema, HourInfoSchema, DailyPlanSchema, DeviceWiseProductionSchema, DemoUserSchema} from '../db/schemas/dbSchema'
import Realm from 'realm';
let realm;

export default class HomeScreen extends React.Component {

    state = {
      isloading: false,
    }

  constructor(props) {
    super(props);
    realm = new Realm({
      path: 'QmsDb.realm',
      schema: [
        DemoUserSchema,
        CompanyWiseUnitLineSchema,
        HourInfoSchema,
        DailyPlanSchema,
        DeviceWiseProductionSchema
      ],
    });
  }

  componentDidMount(){

  }
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
        <ProgressDialog loading={this.state.isloading} />
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