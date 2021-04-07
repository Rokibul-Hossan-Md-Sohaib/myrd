/*Screen to register the user*/
import React from 'react';
import { View, ScrollView, KeyboardAvoidingView, Alert, StyleSheet, Text, Pressable } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Mytextinput from './components/Mytextinput';
import moment from 'moment'
import Toast from 'react-native-toast-message';
import Mybutton from './components/Mybutton';
import {post} from '../utils/apiUtils'
import ProgressDialog from '../utils/loader'
import Orientation from 'react-native-orientation';
import {QmsSecurityProductionDeviceInfo, DailyPlanSchema, CurrentLoggedInUserSchema, HourInfoSchema} from '../db/schemas/dbSchema'
import Realm from 'realm';
import { NavigationScreenProp } from 'react-navigation';
let realm: Realm;

interface Props {
  navigation: NavigationScreenProp<any,any>
};

interface State {
  loading: boolean,
  displayProductionDateSelection: boolean,
  vDeviceId: string,
  vCompanyId: string,
  vCompanyName: string,
  vShortCode: string,
  vUnitId: string,
  vUnitName: string,
  vLineId: string,
  vUnitLineId: string,
  loginDisabled: true,
  vShiftId: string,
  Password: string,
  AllDeviceInfo: any,
  filteredDeviceInfo: any[],
  shiftAvailavle: boolean,
  comNames: any[],
  unitNames: any[],
  lineNames:any[],
  shifts: any[],
  reqObj: any[],
  today: string,
  isDatePickerVisible: boolean,
  selectedCompany: any,
  selectedUnit: any,
  selectedLine: any,
  selectedShift: any,
  deviceId: any
}

export default class DeviceLogin extends React.Component<Props, State> {

    state: State = {
        loading: false,
        displayProductionDateSelection: false,
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
        reqObj: [],
        today: moment().format('YYYY-MM-DD'),
        isDatePickerVisible: false,
        selectedCompany: undefined,
        selectedUnit: undefined,
        selectedLine: undefined,
        selectedShift: undefined,
        deviceId: undefined
    };
    passRef: React.RefObject<any>;
    secondTextInputRef: any;

    constructor(props: Props) {
    super(props);
    this.passRef = React.createRef();
    this.props.navigation.addListener(
      'didFocus',
      payload => {
        Orientation.lockToPortrait()
      });      
    realm = new Realm({ path: 'QmsDb.realm' });

    // this.inputRefs = {
    //     favSport1: null,
    //   };
  }

    componentDidMount(){
      Orientation.lockToPortrait()
      let comInfo:any = realm.objects(QmsSecurityProductionDeviceInfo.name);

      this.setState({AllDeviceInfo: comInfo}, ()=>{
        const comNames = this.setupPickerData(this.state.AllDeviceInfo, 'vCompanyName', 'vCompanyId', '', '');

        this.setState({
          comNames,
         // loading: false
        })
      })   
      
    }

    setUnitData(comid: string){
      const unitNames = this.setupPickerData(this.state.filteredDeviceInfo, 'vUnitName', 'vUnitId', comid, 'vCompanyId');
      this.setState({unitNames}, 
        // ()=> console.log('units nos', unitNames.length)
        );
      // if(!comid) comid = 'nothing'
      // const nfo = realm.objects(QmsSecurityProductionDeviceInfo.name)
      // .filtered(`vCompanyId="${comid}" && TRUEPREDICATE DISTINCT(vUnitId)`)
      // .map(item => {
      //   return { value: item["vUnitId"], label: item["vUnitName"] }}); 
    }

    setLineData(unitId: string): void{
      const lineNames = this.setupPickerData(this.state.filteredDeviceInfo, 'vLineId', 'vUnitLineId', unitId, 'vUnitId');
        this.setState({lineNames}, 
          // ()=> console.log('lineName nos', lineNames.length)
          );
    }

    setShiftData(): void{
      const shifts = this.setupPickerData(this.state.filteredDeviceInfo, 'vShiftId', 'vShiftId', '', '');
        this.setState({shifts}, 
          //()=> console.log('shifts nos', shifts.length)
          );
    }

  setupPickerData(dataArr: any, labelName: string, valueName: string, filterTxt: string, filterColumn: string){

    var depid = [];

    if(filterTxt && filterColumn){
      depid = dataArr.filter((x: any) => x[filterColumn] === filterTxt).map((obj: any) => ({[valueName]: obj[valueName], [labelName]: obj[labelName]}));
      //console.log(depid);
    }else{
      depid = dataArr.map((obj: any) => ({[valueName]: obj[valueName], [labelName]: obj[labelName]}));
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
      this.setState({vDeviceId,  deviceId: vDeviceId, Password: vDeviceId}, 
//        ()=> console.log('DeviceID',this.state.vDeviceId)
        )
    }
  }
  showDateSelector(){
    this.setState({
      displayProductionDateSelection:  !this.state.displayProductionDateSelection
    })
  }

  userLoginAndGetData(){
    var {vCompanyId, vUnitId, vUnitLineId, Password, vShiftId, vDeviceId} = this.state;
    var reqObj: any = {
      "deviceId": vDeviceId,
      "devicePwd": Password,
      "companyId": vCompanyId,
      "unitId": vUnitId,
      "unitLineId": vUnitLineId,
      "shiftId": vShiftId,
      "dateTime": this.state.today//moment().format('YYYY-MM-DD') //"2020-11-04"//moment().format('YYYY-MM-DD')
  }

  this.setState({loading: true, reqObj}, ()=>{
    post('/GetProductionPlanUnitLineData', reqObj)
    .then(response => {
        this.setState({loading: false}, ()=>{
            var responseData = response.data.compUnitPlanData;
            //console.log(responseData); timeHourData
            //.compUnitPlanData.msg
        if(responseData.auth){

          var timeHour = response.data.timeHourData
          
          var toastFlavour = responseData.dailyProdPlanData.length > 0 ? "success" : "info";
          var toastTitleTxt = responseData.dailyProdPlanData.length > 0 ? "Successed!" : "Info!";

          this.writeToLocalDb(responseData.dailyProdPlanData, timeHour, reqObj);
          
          Toast.show({
            type: toastFlavour,
            position: 'bottom',
            text1: toastTitleTxt,
            text2: responseData.msg+' 👋 length: '+responseData.dailyProdPlanData.length,
            visibilityTime: 1500,
            })

          if(responseData.dailyProdPlanData.length > 0){
            // this.props.navigation.navigate('SetupData')}
              this.props.navigation.navigate('SetupData',{ userData:  this.state.reqObj });
          }
          
        }else{
            Toast.show({
                type: 'error',
                position: 'bottom',
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
                position: 'bottom',
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
    //console.log(reqObj);
  }


  
  writeToLocalDb = (dataToWrite: any[], timeHour: any[], current_login: any) =>{
    console.log('write to DB')
    //Clear any existing data in local db
    this.clearLocalDb();
      //write plan data to local db
      //DailyPlanSchema.name
        realm.write(() => {
            dataToWrite.forEach(obj => {
              realm.create(DailyPlanSchema.name, obj);
          });

         timeHour.forEach(obj => {
              realm.create(HourInfoSchema.name, obj);
          });

          realm.create(CurrentLoggedInUserSchema.name, current_login)

        });
  }

  clearLocalDb = () => {
    console.log('clear DB')
     realm.write(() => {
    // Delete multiple books by passing in a `Results`, `List`,
    // or JavaScript `Array`

    let allcCurrentLoginData = realm.objects(CurrentLoggedInUserSchema.name);
     realm.delete(allcCurrentLoginData);

    let allTimeData = realm.objects(HourInfoSchema.name);
     realm.delete(allTimeData);

     let allPlanData = realm.objects(DailyPlanSchema.name);
     realm.delete(allPlanData); // Deletes all plans
  });
   
}


showDatePicker = () => {
  this.setState({isDatePickerVisible: true});
};

 hideDatePicker = () => {
  this.setState({isDatePickerVisible: false});
};

 handleConfirm(date: Date) {
  console.log("A date has been picked: ", moment(date).format('YYYY-MM-DD'));
  this.setState({today: moment(date).format('YYYY-MM-DD')})
  this.hideDatePicker();
  this.passRef.current.focus();
};

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

            <View style={{paddingVertical: 5}} />

            <Text style={{paddingLeft: 25, fontWeight: '700'}}>Company</Text>

            <View style={{paddingVertical: 2}} />
            
            <RNPickerSelect
            placeholder={placeholder}
            items={this.state.comNames}
            onValueChange={value => {
              //console.log('pickerValue: ',value)
              var filteredComData = this.state.AllDeviceInfo.filter((x: any) => x.vCompanyId === value); 
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
                  selectedUnit: "",
                  selectedLine: "",
                  selectedShift: "",
                  deviceId: "",
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

            <View style={{paddingVertical: 5}} />
            
            { this.state.selectedCompany ?
              <View>
              <Text style={{paddingLeft: 25, fontWeight: '700'}}>Unit</Text>
              <View style={{paddingVertical: 2}} />
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
                  selectedLine: "",
                  selectedShift: "",
                  deviceId: "",
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
              
            <View style={{paddingVertical: 5}} />              
            </View> : <></>}

            { this.state.selectedUnit ?
              <View>
              <Text style={{paddingLeft: 25, fontWeight: '700'}}>Line</Text>
              <View style={{paddingVertical: 2}} />
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
                  deviceId: "",
                }, ()=>{
                  this.state.shiftAvailavle ? console.log('Shift available, Select Line to get Device ID') : this.getDeviceId();
                  //console.log('line', value);
              });
              }}
              style={pickerSelectStyles}
              value={this.state.selectedLine}
              useNativeAndroidPickerStyle={false}
              // ref={el => {
              //     this.inputRefs.favSport1 = el;
              // }}
              />            
              <View style={{paddingVertical: 5}} />
            </View> : <></>}
  

            { (this.state.shiftAvailavle && this.state.selectedLine) ?
              <View>
              <Text style={{paddingLeft: 25, fontWeight: '700'}}>Shift</Text>
              <View style={{paddingVertical: 2}} />
              <RNPickerSelect
              placeholder={placeholder}
              items={this.state.shifts}
              onValueChange={value => {
                  this.setState({
                  selectedShift: value,
                  vShiftId: value,
                  vDeviceId: '',
                  deviceId: "",
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
              <View style={{paddingVertical: 5}} />  
            </View> : <></>}

            <Text style={{paddingLeft: 25, fontWeight: '700'}}>DeviceID</Text>
            <Mytextinput
              placeholder="Device ID"
              editable={false}
              value={this.state.vDeviceId}
            />

            <View style={{display:this.state.displayProductionDateSelection ? "flex" : 'none'}}>
              <View style={{paddingVertical: 5}} />
              <Text style={{paddingLeft: 25, fontWeight: '700'}}>Production Date</Text>
              <DateTimePickerModal
                isVisible={this.state.isDatePickerVisible}
                mode="date"
                onConfirm={(dt)=> this.handleConfirm(dt)}
                onCancel={()=> this.hideDatePicker()}
              />
              <Mytextinput
                refInner={this.secondTextInputRef}
                placeholder="Date"
                value={this.state.today}
                showSoftInputOnFocus={false}
                onFocus={()=> this.showDatePicker()}
              />
            </View>

            <View style={{paddingVertical: 5}} />
            <Text style={{paddingLeft: 25, fontWeight: '700'}}>Password</Text>
            <Mytextinput
              refInner={this.passRef}
              secureTextEntry
              placeholder="Password"
              value={this.state.Password}
              onChangeText={(Password: string) => this.setState({ Password })}
            />
            
            <View style={{paddingVertical: 5}} />  
            <Mybutton
              title="Get Plan Info"
              customClick={()=> this.userLoginAndGetData()}
            />
            <Pressable onLongPress={()=> this.showDateSelector()} style={{height: 25, width: 25, borderRadius:25, position:'absolute', top:2, right: 2, backgroundColor:'#fff'}}></Pressable>
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