/*Screen to register the user*/
import React from 'react';
import { View, ScrollView, KeyboardAvoidingView, StyleSheet, Text, Pressable, StatusBar } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import DeviceInfo from 'react-native-device-info';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Mytextinput from './components/Mytextinput';
import moment from 'moment'
import Toast from 'react-native-toast-message';
import Mybutton from './components/Mybutton';
import {post} from '../utils/apiUtils'
import ProgressDialog from '../utils/loader'
import {setupPickerData} from '../utils/utilityFunctions'
import {handleAndroidBackButton, removeAndroidBackButtonHandler} from '../utils/backHandler.config';
import Orientation from 'react-native-orientation';
import {getQmsDeviceSecurityData, rehydrateExistingdata, writeToLocalDb} from '../db/dbServices/__Device_Login_DBF'
import NetInfo, {NetInfoSubscription, NetInfoState, NetInfoWifiState} from '@react-native-community/netinfo'
//import Realm from 'realm';
import { NavigationScreenProp } from 'react-navigation';
import { __REHYDRATING_DATA_PATH } from '../utils/constKVP';
//let realm: Realm;

type Props = {
  navigation: NavigationScreenProp<any,any>
};

type State = {
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
        Orientation.lockToLandscapeLeft();
        handleAndroidBackButton(this.navigateBack);
      });
  }

  
  navigateBack = ()=>{
    this.props.navigation.navigate("HomeScreen");
}

    componentWillUnmount(){
      removeAndroidBackButtonHandler();
    }

    async componentDidMount(){

      // var macAddress = DeviceInfo.getMacAddressSync();
      // //54:21:9D:1E:0B:DC
      // //var deviceId = DeviceInfo.getDeviceId();
      // var uniqueId = DeviceInfo.getUniqueId();
      // // 4572eace315ef2aa

      // console.log('mac',macAddress,  uniqueId);

      Orientation.lockToLandscapeLeft();
      let comInfo:any = getQmsDeviceSecurityData();

      this.setState({AllDeviceInfo: comInfo}, ()=>{
        const comNames = setupPickerData(this.state.AllDeviceInfo, 'vCompanyName', 'vCompanyId', '', '');

        this.setState({
          comNames,
         // loading: false
        })
      })   
      
    }

    setUnitData(comid: string){
      const unitNames = setupPickerData(this.state.filteredDeviceInfo, 'vUnitName', 'vUnitId', comid, 'vCompanyId');
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
      const lineNames = setupPickerData(this.state.filteredDeviceInfo, 'vLineId', 'vUnitLineId', unitId, 'vUnitId');
        this.setState({lineNames}, 
          // ()=> console.log('lineName nos', lineNames.length)
          );
    }

    setShiftData(): void{
      const shifts = setupPickerData(this.state.filteredDeviceInfo, 'vShiftId', 'vShiftId', '', '');
        this.setState({shifts}, 
          //()=> console.log('shifts nos', shifts.length)
          );
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
      this.setState({vDeviceId, deviceId: vDeviceId, Password: vDeviceId}, 
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

    var macAddress = DeviceInfo.getMacAddressSync().trim();
    if(!macAddress){
      macAddress = DeviceInfo.getUniqueId();
    }

    console.log(' dis mac',macAddress)
    
    var reqObj: any = {
      "vDeviceId": vDeviceId,
      "vDeviceSec": Password,
      "vCompanyId": vCompanyId,
      "vUnitId": vUnitId,
      "vUnitLineId": vUnitLineId,
      "vMacAddress": macAddress,
      "vShiftId": vShiftId,
      "dLoginDateTime": this.state.today//moment().format('YYYY-MM-DD') //"2020-11-04"//moment().format('YYYY-MM-DD')
  }

  this.setState({loading: true, reqObj}, ()=>{
    post(__REHYDRATING_DATA_PATH, reqObj)
    .then((response: any) => {
        this.setState({loading: false}, ()=>{
            var responseData = response.data;//.compUnitPlanData;
            var rehydrateData = responseData.existingAvailableData;
            //console.log(responseData); timeHourData
            //.compUnitPlanData.msg GetProductionPlanUnitLineData
        if(responseData.auth){
          var timeHour = responseData.timeInfos;
          
          var toastFlavour = responseData.dailyProdPlanData.length > 0 ? "success" : "info";
          var toastTitleTxt = responseData.dailyProdPlanData.length > 0 ? "Successed!" : "Info!";

          writeToLocalDb(responseData.dailyProdPlanData, timeHour, reqObj);
          rehydrateExistingdata(rehydrateData[0].productionData, rehydrateData[1].defectData, rehydrateData[2].rejectData, rehydrateData[3].reworkedData);
          
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
                visibilityTime: 2000,
                })
        }
        });

    })
    .catch(errorMessage => {   
        this.setState({loading: false}, ()=>{
            Toast.show({
                type: 'error',
                position: 'bottom',
                text1: 'Error with internet!',
                text2: errorMessage
                })
        }); 
    });
  })

    //console.log(reqObj);
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

  render() {
    const placeholder = {
        label: 'Select an option...',
        value: null,
        color: '#007FFF',
      };
    return (
      <View style={{ backgroundColor: '#151a30', flex: 1 }}>
        <StatusBar hidden />
        <ScrollView keyboardShouldPersistTaps="handled">
          <KeyboardAvoidingView
            behavior="padding"
            style={{ flex: 1, justifyContent: 'space-between' }}>
            <ProgressDialog loading={this.state.loading} />

            <View style={{paddingVertical: 5}} />

            <Text style={{paddingLeft: 25, fontWeight: '700', color:'#fff'}}>Company</Text>

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
              <Text style={{paddingLeft: 25, fontWeight: '700', color:'#fff'}}>Unit</Text>
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
              <Text style={{paddingLeft: 25, fontWeight: '700', color:'#fff'}}>Line</Text>
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
              <Text style={{paddingLeft: 25, fontWeight: '700',  color:'#fff'}}>Shift</Text>
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

            <Text style={{paddingLeft: 25, fontWeight: '700', color:'#fff'}}>DeviceID</Text>
            <Mytextinput
              placeholder="Device ID"
              editable={false}
              style={{
                backgroundColor: "#2d395c",
                color: "#fff",
                borderRadius: 7,
              }}
              value={this.state.vDeviceId}
            />

            <View style={{display:this.state.displayProductionDateSelection ? "flex" : 'none'}}>
              <View style={{paddingVertical: 5}} />
              <Text style={{paddingLeft: 25, fontWeight: '700', color:'#fff'}}>Production Date</Text>
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
                style={{
                  backgroundColor: "#2d395c",
                  color: "#fff",
                  borderRadius: 7,
                }}
                onFocus={()=> this.showDatePicker()}
              />
            </View>

            <View style={{paddingVertical: 5}} />
            <Text style={{paddingLeft: 25, fontWeight: '700', color:'#fff'}}>Password</Text>
            <Mytextinput
              refInner={this.passRef}
              secureTextEntry
              placeholder="Password"
              value={this.state.Password}
              style={{
                backgroundColor: "#2d395c",
                color: "#fff",
                borderRadius: 7,
              }}
              onChangeText={(Password: string) => this.setState({ Password })}
            />
            
            <View style={{paddingVertical: 5}} />  
            <Mybutton
              title="Get Plan Info"
              customClick={()=> this.userLoginAndGetData()}
              style={{
                backgroundColor: '#28a745',
                width: "50%",
                alignSelf: "center"
              }}
            />
            <Pressable onLongPress={()=> this.showDateSelector()} style={{height: 25, width: 25, borderRadius:25, position:'absolute', top:2, right: 2, backgroundColor:'#151a30'}}></Pressable>
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
      //borderWidth: 1,
      //borderColor: 'gray',
      backgroundColor: "#2d395c",
      borderRadius: 7,
      color: '#fff',
      paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
      fontSize: 16,
      marginLeft: 20,
      marginRight: 20,
      paddingHorizontal: 10,
      paddingVertical: 8,
      //borderWidth: 0.5,
      //borderColor: '#000',
      backgroundColor: "#2d395c",
      borderRadius: 7,
      color: '#fff',
      paddingRight: 30, // to ensure the text is never behind the icon
    },
  });