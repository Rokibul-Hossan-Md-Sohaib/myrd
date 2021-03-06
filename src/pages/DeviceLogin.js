/*Screen to register the user*/
import React from 'react';
import { View, ScrollView, KeyboardAvoidingView, Alert, StyleSheet, Text } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import Mytextinput from './components/Mytextinput';
import moment from 'moment'
import Toast from 'react-native-toast-message';
import Mybutton from './components/Mybutton';
import {post} from '../utils/apiUtils'
import ProgressDialog from '../utils/loader'
import {QmsSecurityProductionDeviceInfo} from '../db/schemas/dbSchema'
import Realm from 'realm';
let realm;

export default class RegisterUser extends React.Component {

    state = {
        loading: false,
        vDeviceId: '',
        vCompanyId: '',
        vCompanyName: '',
        vShortCode: '',
        vUnitId: '',
        vUnitName: '',
        vLineId: '',
        vUnitLineId: '',
        loginDisabled: true,
        vShiftId: '',
        Password: '12345',
        AllDeviceInfo: [],
        filteredDeviceInfo:[],
        shiftAvailavle: false,
        comNames: [],
        unitNames: [],
        lineNames:[],
        shifts: [],
        selectedCompany: undefined,
        selectedUnit: undefined,
        selectedLine: undefined,
        selectedShift: undefined,
        deviceId: undefined,
    };

    constructor(props) {
    super(props);    
    realm = new Realm({ path: 'QmsDb.realm' });

    // this.inputRefs = {
    //     favSport1: null,
    //   };
  }

    componentDidMount(){
      const comInfo = realm.objects(QmsSecurityProductionDeviceInfo.name);
      this.setState({AllDeviceInfo: comInfo}, ()=>{
        const comNames = this.setupPickerData(this.state.AllDeviceInfo, 'vCompanyName', 'vCompanyId');
        this.setState({
          comNames,
         // loading: false
        },()=> console.log('inDeviceLogin', this.state.comNames.length))
      })   
      
    }

    setUnitData(comid){
      const unitNames = this.setupPickerData(this.state.filteredDeviceInfo, 'vUnitName', 'vUnitId', comid, 'vCompanyId');
      this.setState({unitNames}, ()=> console.log('units nos', unitNames.length));
      // if(!comid) comid = 'nothing'
      // const nfo = realm.objects(QmsSecurityProductionDeviceInfo.name)
      // .filtered(`vCompanyId="${comid}" && TRUEPREDICATE DISTINCT(vUnitId)`)
      // .map(item => {
      //   return { value: item["vUnitId"], label: item["vUnitName"] }}); 
    }

    setLineData(unitId){
      const lineNames = this.setupPickerData(this.state.filteredDeviceInfo, 'vLineId', 'vUnitLineId', unitId, 'vUnitId');
        this.setState({lineNames}, ()=> console.log('lineName nos', lineNames.length));
    }

    setShiftData(){
      const shifts = this.setupPickerData(this.state.filteredDeviceInfo, 'vShiftId', 'vShiftId');
        this.setState({shifts}, ()=> console.log('shifts nos', shifts.length));
    }

  setupPickerData(dataArr, labelName, valueName, filterTxt, filterColumn){

    var depid = [];

    if(filterTxt && filterColumn){
      depid = dataArr.filter(x => x[filterColumn] === filterTxt).map((obj,idx) => ({[valueName]: obj[valueName], [labelName]: obj[labelName]}));
      console.log(depid);
    }else{
      depid = dataArr.map((obj,idx) => ({[valueName]: obj[valueName], [labelName]: obj[labelName]}));
    }
      //Filter Company string then map for Unit -> Line etc
    var DepResult = [], mapx = new Map();
        for (const item of depid) {
            if(!mapx.has(item[valueName])){
                mapx.set(item[valueName], true);    // set any value to Map mapx.has(depid[0]['vCompanyId']);
                DepResult.push({
                    value : item[valueName],
                    label : item[labelName]
                });
            }
        }
    return DepResult;
  }
  getDeviceId(){
    var finalObj = [];

    if(this.state.shiftAvailavle && this.state.vShiftId){
        finalObj = this.state.filteredDeviceInfo.filter(x => x.vCompanyId === this.state.vCompanyId && x.vUnitId === this.state.vUnitId && x.vUnitLineId === this.state.vUnitLineId && x.vShiftId === this.state.vShiftId)[0];
    }else{
        finalObj = this.state.filteredDeviceInfo.filter(x => x.vCompanyId === this.state.vCompanyId && x.vUnitId === this.state.vUnitId && x.vUnitLineId === this.state.vUnitLineId)[0];
    }
   // console.log('DeviceId', finalObj);
    if(finalObj != undefined){
      var vDeviceId = finalObj.vDeviceId;
      this.setState({vDeviceId,  deviceId: vDeviceId,}, ()=> console.log('DeviceID',this.state.vDeviceId))
    }
  }

  userLoginAndGetData(){
    var {vCompanyId, vUnitId, vUnitLineId, vShiftId, vDeviceId, Password } = this.state;
    var reqObj = {
      "deviceId": vDeviceId,
      "devicePwd": vDeviceId,//Password,
      "companyId": vCompanyId,
      "unitId": vUnitId,
      "unitLineId": vUnitLineId,
      "shiftId": vShiftId,
      "dateTime": "2020-11-04"//moment().format('YYYY-MM-DD')
  }

  this.setState({loading: true}, ()=>{
    post('/GetProductionPlanUnitLineData', reqObj)
    .then(response => {
        this.setState({loading: false}, ()=>{
            var responseData = response.data;
            console.log(responseData);
        if(responseData.auth){

          var toastFlavour = responseData.dailyProdPlanData.length > 0 ? "success" : "info";
          var toastTitleTxt = responseData.dailyProdPlanData.length > 0 ? "Successed!" : "Info!";
          
            Toast.show({
                type: toastFlavour,
                position: 'top',
                text1: toastTitleTxt,
                text2: responseData.msg+' 👋 length: '+responseData.dailyProdPlanData.length,
                visibilityTime: 1500,
                })
            //this.props.navigation.navigate('HomeScreen', responseData.userObj);
        }else{
            Toast.show({
                type: 'error',
                position: 'top',
                text1: 'Error!',
                text2: responseData.msg,
                visibilityTime: 1500,
                })
        }
        });

    })
    .catch(errorMessage => {   
        this.setState({loading: false}, ()=>{
            Toast.show({
                type: 'error',
                position: 'top',
                text1: 'Error!',
                text2: errorMessage
                })
        }); 
    });
  })

    /**
     * 
     * {
        "deviceId": "C6I1L1",
        "devicePwd": "C6I1L1",
        "unitId": "U24",
        "unitLineId": "UL208",
        "shiftId": "SH1",
        "dateTime": "2020-11-04"
      }
     * 
     */
    this.writeToLocalDb();
    console.log(reqObj);
  }


  
  writeToLocalDb = () =>{
    console.log('write to DB')
    //Clear any existing data in local db
    this.clearLocalDb();
      //write plan data to local db
      /***
       * realm.write(() => {
                    responseData.compUnitData.forEach(obj => {
                      realm.create(QmsSecurityProductionDeviceInfo.name, obj);
                  });

                    responseData.timeHourData.forEach(obj => {
                    realm.create(HourInfoSchema.name, obj);
                  });
                  //realm.create('Car', {make: 'Honda', model: 'Accord', drive: 'awd'});
                });
       * 
       * 
       */
  }

  clearLocalDb = () => {
    console.log('clear DB')
    /***
     * 
     * realm.write(() => {
  // Create a book object
  let book = realm.create('Book', {id: 1, title: 'Recipes', price: 35});

  // Delete the book
  realm.delete(book);

  // Delete multiple books by passing in a `Results`, `List`,
  // or JavaScript `Array`
  let allBooks = realm.objects('Book');
  realm.delete(allBooks); // Deletes all books
});
     * 
     * 
     */
  }


//   register_user = () => {
//     var that = this;
//     const { user_name } = this.state;
//     const { user_contact } = this.state;
//     const { user_address } = this.state;
//     if (user_name) {
//       if (user_contact) {
//         if (user_address) {
//           realm.write(() => {
//             var ID =
//               realm.objects('user_details').sorted('user_id', true).length > 0
//                 ? realm.objects('user_details').sorted('user_id', true)[0]
//                     .user_id + 1
//                 : 1;
//             realm.create('user_details', {
//               user_id: ID,
//               user_name: that.state.user_name,
//               user_contact: that.state.user_contact,
//               user_address: that.state.user_address,
//             });
//             Alert.alert(
//               'Success',
//               'You are registered successfully',
//               [
//                 {
//                   text: 'Ok',
//                   onPress: () => that.props.navigation.navigate('HomeScreen'),
//                 },
//               ],
//               { cancelable: false }
//             );
//           });
//         } else {
//           alert('Please fill Address');
//         }
//       } else {
//         alert('Please fill Contact Number');
//       }
//     } else {
//       alert('Please fill Name');
//     }
//   };

  render() {
    const placeholder = {
        label: 'Select an option...',
        value: null,
        color: '#007FFF',
      };
    return (
      <View style={{ backgroundColor: 'white', flex: 1 }}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <KeyboardAvoidingView
            behavior="padding"
            style={{ flex: 1, justifyContent: 'space-between' }}>
            <ProgressDialog loading={this.state.loading} />
            <View paddingVertical={5} />

            <Text style={{paddingLeft: 25, fontWeight: '700'}}>Company</Text>
            <View paddingVertical={2} />
            <RNPickerSelect
            placeholder={placeholder}
            items={this.state.comNames}
            onValueChange={value => {
              //console.log('pickerValue: ',value)
              var filteredComData = this.state.AllDeviceInfo.filter(x => x.vCompanyId === value); 
              //console.log('170', filteredComData);
              var shiftAvailavle =  filteredComData.length == 0 ? false : filteredComData[0].vShiftId != null; 
              //vShiftId
                this.setState({
                  selectedCompany: value,
                  vCompanyId: value,
                  filteredDeviceInfo: filteredComData,
                  shiftAvailavle,
                  vDeviceId: '',
                  vShiftId: '',
                  vUnitId: '',
                  vUnitLineId: '',
                  selectedUnit: undefined,
                  selectedLine: undefined,
                  selectedShift: undefined,
                  deviceId: undefined,
                }, ()=>{
                  this.setUnitData(value);
                  this.state.shiftAvailavle  ? this.setShiftData() : console.log('no shift available!');
              });
            }}
            style={pickerSelectStyles}
            value={this.state.selectedCompany}
            useNativeAndroidPickerStyle={false}
            // ref={el => {
            //     this.inputRefs.favSport1 = el;
            // }}
            />

            <View paddingVertical={5} />
            
            { this.state.selectedCompany ?
              <View>
              <Text style={{paddingLeft: 25, fontWeight: '700'}}>Unit</Text>
              <View paddingVertical={2} />
              <RNPickerSelect
              placeholder={placeholder}
              items={this.state.unitNames}
              onValueChange={value => {
                  this.setState({
                  selectedUnit: value,
                  vUnitId: value,
                  vUnitLineId: '',
                  vShiftId: '',
                  vDeviceId: '',
                  selectedLine: undefined,
                  selectedShift: undefined,
                  deviceId: undefined,
                }, ()=>{
                  this.setLineData(value);
              });
              }}
              style={pickerSelectStyles}
              value={this.state.selectedUnit}
              useNativeAndroidPickerStyle={false}
              // ref={el => {
              //     this.inputRefs.favSport1 = el;
              // }}
              />

              <View paddingVertical={5} />              
            </View> : <></>}

            { this.state.selectedUnit ?
              <View>
              <Text style={{paddingLeft: 25, fontWeight: '700'}}>Line</Text>
              <View paddingVertical={2} />
              <RNPickerSelect
              placeholder={placeholder}
              items={this.state.lineNames}
              onValueChange={value => {
                  this.setState({
                  selectedLine: value,
                  vUnitLineId: value,
                  vShiftId: '',
                  vDeviceId: '',
                  selectedShift: '',
                  deviceId: undefined,
                }, ()=>{
                  this.state.shiftAvailavle ? console.log('Shift available, Select Line to get Device ID') : this.getDeviceId();
                  console.log('line', value);
              });
              }}
              style={pickerSelectStyles}
              value={this.state.selectedLine}
              useNativeAndroidPickerStyle={false}
              // ref={el => {
              //     this.inputRefs.favSport1 = el;
              // }}
              />

              <View paddingVertical={5} />              
            </View> : <></>}

            { (this.state.shiftAvailavle && this.state.selectedLine) ?
              <View>
              <Text style={{paddingLeft: 25, fontWeight: '700'}}>Shift</Text>
              <View paddingVertical={2} />
              <RNPickerSelect
              placeholder={placeholder}
              items={this.state.shifts}
              onValueChange={value => {
                  this.setState({
                  selectedShift: value,
                  vShiftId: value,
                  vDeviceId: '',
                  deviceId: undefined,
                }, ()=>{
                  //this.setLineData(value);
                  this.getDeviceId();
                  //console.log('shift', value);
              });
              }}
              style={pickerSelectStyles}
              value={this.state.selectedShift}
              useNativeAndroidPickerStyle={false}
              // ref={el => {
              //     this.inputRefs.favSport1 = el;
              // }}
              />

              <View paddingVertical={5} />              
            </View> : <></>}

            <Text style={{paddingLeft: 25, fontWeight: '700'}}>DeviceID</Text>
            <Mytextinput
              placeholder="Device ID"
              editable={false}
              value={this.state.vDeviceId}
              //onChangeText={user_name => this.setState({ user_name })}
            />
            <View paddingVertical={5} />
            <Text style={{paddingLeft: 25, fontWeight: '700'}}>Password</Text>
            <Mytextinput
              secureTextEntry
              placeholder="Password"
              value={this.state.Password}
              onChangeText={Password => this.setState({ Password })}
            />
            <Mybutton
              title="Submit"
              customClick={()=> this.userLoginAndGetData()}
            />
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    );
  }
}

const style = StyleSheet.create({
    pickerStyle:{
        borderColor: 'red',
        borderWidth: 5,
        paddingLeft: 70
    }
})


const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 4,
      color: 'black',
      paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
      fontSize: 16,
      marginLeft: 20,
      marginRight: 20,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 0.5,
      borderColor: '#000',
      borderRadius: 8,
      color: 'black',
      paddingRight: 30, // to ensure the text is never behind the icon
    },
  });