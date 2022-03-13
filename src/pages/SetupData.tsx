import React from 'react';
import { View, ScrollView, KeyboardAvoidingView, Alert, StyleSheet, Text, BackHandler, StatusBar } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import moment from 'moment'
import Toast from 'react-native-toast-message';
import Mybutton from './components/Mybutton';
import {post} from '../utils/apiUtils'
import ProgressDialog from '../utils/loader'
import Orientation from 'react-native-orientation';
import {handleAndroidBackButton, removeAndroidBackButtonHandler} from '../utils/backHandler.config';
import {setupPickerData} from '../utils/utilityFunctions'
import {getAllDailyProductionPlanSummery, loggedOutAndAbleToGoToLoginPage} from '../db/dbServices/__Setup_Data_DBF'
import { NavigationScreenProp } from 'react-navigation';
import { syncBulkData } from '../db/dbServices/__LDB_Count_Services';
import { __LOGOUT_PATH } from '../utils/constKVP';

type Props = {
  navigation: NavigationScreenProp<any,any>
};

type State = {
  loading: boolean,
  disableMultipleSizeButton: boolean,
  colorFilteredSizes: any[],
  vDeviceId: string,
  finalProductionObject: any,
  vBuyerId: string,
  vBuyerName: string,
  vStyleId: string,
  vStyleName: string,
  vExpPoorderNo: string,
  vColorId: string,
  vColorName: string,
  vSizeId: string,
  vSizeName: string,
  dShipmentDate: string,
  dToday: string,
  reqObj: any, //data came from previous screen...
  AllPlanInfo: any[],
  filteredPlanInfo: any[],
  buyerNames: any[],
  styleNames: any[],
  expPos: any[],
  colorNames: any[],
  sizeNames: any[],
  selectedBuyer: any,
  selectedStyle: any,
  selectedExpPo: any,
  selectedColor: any,
  selectedSize: any,
  isSyncSuccessful: boolean
};


export default class SetupData extends React.Component<Props, State> {

    state: State = {
        loading: false,
        disableMultipleSizeButton: true,
        colorFilteredSizes:[],
        vDeviceId: '',
        finalProductionObject: undefined,
        vBuyerId: '',
        vBuyerName: '',
        vStyleId: '',
        vStyleName: '',
        vExpPoorderNo: '',
        vColorId: '',
        vColorName: '',
        vSizeId: '',
        vSizeName: '',
        dShipmentDate: '',
        dToday: moment().format('DD-MM-YYYY'),
        
        reqObj:[], //data came from previous screen...
        AllPlanInfo: [],
        filteredPlanInfo:[],
        buyerNames: [],
        styleNames: [],
        expPos:[],
        colorNames: [],
        sizeNames: [],

        selectedBuyer: undefined,
        selectedStyle: undefined,
        selectedExpPo: undefined,
        selectedColor: undefined,
        selectedSize: undefined,
        isSyncSuccessful: false
    };

    constructor(props: Props) {
    super(props);
    this.props.navigation.addListener(
      'didFocus',
      payload => {
        Orientation.lockToLandscapeLeft();
        handleAndroidBackButton(this.navigateBack);
      });
  }

  navigateBack = ()=>{
    Alert.alert(
      "Do you want to really quit the app?",
      "",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Exit", onPress: () => BackHandler.exitApp()}
      ]
    );
  }

  //when click in logout button
  syncAndLogout(){
    Alert.alert(
      "Do you Want to Logout?",
      "Data Needs to be synced before logout.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Sync & Logout", onPress: () => this.syncData() }
      ]
    );
  }

  syncData = async () =>{
    /**TODO: BULK DATA SYNC */
    await syncBulkData();
    console.log("data will be synced")
    /**Here Bulk Data Will be synced  then call logoutAndGotoLoginPage() */
    this.logoutAndGotoLoginPage();
  }

  async logoutAndGotoLoginPage(): Promise<void>{
    /**Logout from Server */
    await post(__LOGOUT_PATH, this.state.reqObj)
    .then(() => {}).catch(errorMessage => console.log(errorMessage));

    /**Logout from LocalDb as well */
    let isLoggedOut = loggedOutAndAbleToGoToLoginPage();
    if(isLoggedOut){
      console.log('logged out')
        this.props.navigation.navigate('DeviceLogin')
    }else{
      console.log("logout failed!")
    }
  }

  SyncAllDataWithServer = async()=>{
    var isOk = await syncBulkData();
        if(isOk){
          Toast.show({
            type: "success",
            position: 'bottom',
            text1: "Data Syncying Successful.",
            visibilityTime: 1500,
            });
        }else{
          Toast.show({
            type: "error",
            position: 'bottom',
            text1: "Something Wrong with Data Sync.",
            visibilityTime: 1500,
            });
        }
  }

    componentDidMount(){
      console.log("component mounted...")
      Orientation.lockToLandscapeLeft();
      let comInfo: any = getAllDailyProductionPlanSummery();
      const reqObj = this.props.navigation.getParam('userData');
        console.log('reqObj', reqObj)
       // console.log('isTab', DeviceInfo.isTablet())

      this.setState({AllPlanInfo: comInfo, reqObj, filteredPlanInfo: comInfo}, ()=>{
        const buyerNames: any = setupPickerData(this.state.AllPlanInfo, 'vBuyerName', 'vBuyerId', '', '');
        this.setState({
          buyerNames,
         // loading: false
        }
        //,()=> console.log('buyer', this.state.buyerNames.length)
        )
      })   
      
    }
    componentWillUnmount(){
      console.log("component unmounted...");
      removeAndroidBackButtonHandler();
    }
 
  gotoMultipleSizeCountScreen(){
    var {finalProductionObject, colorFilteredSizes} = this.state;
    if(this.state.colorFilteredSizes.length > 0 && finalProductionObject){
      this.props.navigation.navigate('MultipleSizeCount', {userData: finalProductionObject, colorSizes: colorFilteredSizes});//{userData: this.state.colorFilteredSizes});
    }else{
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Error!',
        text2: "Something Went Wrong, Select all Production related info first!",
        visibilityTime: 1500,
        })
    }
  }

  
  setupDataForProduction(){
    var {finalProductionObject} = this.state;
    console.log('setup prod data', finalProductionObject);

    if(finalProductionObject){
        this.props.navigation.navigate('ProductionCountSizeWise', {userData: finalProductionObject});
    }else{
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Error!',
        text2: "Something Went Wrong, Select all Production related info first!",
        visibilityTime: 1500,
        })
    }
  }

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

            <Text style={{paddingLeft: 25, fontWeight: '700', color: '#fff'}}>Buyer</Text>
            <View style={{paddingVertical: 2}} />
            <RNPickerSelect
            placeholder={placeholder}
            items={this.state.buyerNames}
            onValueChange={value => {
              
              var filteredComData = this.state.AllPlanInfo.filter(x => x.vBuyerId === value); 
              const styleNames = setupPickerData(filteredComData, 'vStyleName', 'vStyleId', value, 'vBuyerId');

                this.setState({
                  selectedBuyer: value,
                  styleNames,
                  finalProductionObject: undefined,
                  disableMultipleSizeButton: true,
                  colorFilteredSizes: [],
                  //filteredPlanInfo: filteredComData,
                  vBuyerId: value,
                  vStyleId: '',
                  vStyleName: '',
                  vExpPoorderNo: '',
                  vColorId: '',
                  vColorName: '',
                  vSizeId: '',
                  vSizeName: '',
                  dShipmentDate: '',

                  selectedStyle: '',
                  selectedExpPo: '',
                  selectedColor: '',
                  selectedSize: '',
                }, ()=>{
                  console.log('buyer',value);
              });
            }}
            style={pickerSelectStyles}
            value={this.state.selectedBuyer}
            useNativeAndroidPickerStyle={false}
            />

            <View style={{paddingVertical: 5}} />
            
            { this.state.selectedBuyer ?
              <View>
              <Text style={{paddingLeft: 25, fontWeight: '700', color: '#fff'}}>Style</Text>
              <View style={{paddingVertical: 2}} />
              <RNPickerSelect
              placeholder={placeholder}
              items={this.state.styleNames}
              onValueChange={value => {

                var filteredComData = this.state.AllPlanInfo.filter(x => x.vBuyerId === this.state.vBuyerId && x.vStyleId === value);
                const expPos = setupPickerData(filteredComData, 'vExpPoorderNo', 'vExpPoorderNo', value, 'vStyleId');

                  this.setState({
                    selectedStyle: value,
                    expPos,
                    finalProductionObject: undefined,
                    disableMultipleSizeButton: true,
                    colorFilteredSizes: [],
                    vStyleId: value,
                    vExpPoorderNo: '',
                    vColorId: '',
                    vColorName: '',
                    vSizeId: '',
                    vSizeName: '',
                    dShipmentDate: '',
  
                    selectedExpPo: '',
                    selectedColor: '',
                    selectedSize: '',
                }, ()=>{
                  console.log('style',value);
              });
              }}
              style={pickerSelectStyles}
              value={this.state.selectedStyle}
              useNativeAndroidPickerStyle={false}
              />
              
            <View style={{paddingVertical: 5}} />              
            </View> : <></>}

            { this.state.selectedStyle ?
              <View>
              <Text style={{paddingLeft: 25, fontWeight: '700', color: '#fff'}}>Export PO</Text>
              <View style={{paddingVertical: 2}} />
              <RNPickerSelect
              placeholder={placeholder}
              items={this.state.expPos}
              onValueChange={value => {
                var {vBuyerId, vStyleId } = this.state;
                var filteredComData = this.state.AllPlanInfo.filter(x => 
                                                    x.vBuyerId === vBuyerId && 
                                                    x.vStyleId === vStyleId && 
                                                    x.vExpPoorderNo === value); 
                const colorNames = setupPickerData(filteredComData, 'vColorName', 'vColorId', value, 'vExpPoorderNo');

                  this.setState({
                    selectedExpPo: value,
                    colorNames,
                    finalProductionObject: undefined,
                    disableMultipleSizeButton: true,
                    colorFilteredSizes: [],
                    //filteredPlanInfo: filteredComData,
                    vExpPoorderNo: value,
                    vColorId: '',
                    vColorName: '',
                    vSizeId: '',
                    vSizeName: '',
                    dShipmentDate: '',
  
                    selectedColor: "",
                    selectedSize: '',
                }, ()=>{
                //   this.state.shiftAvailavle ? console.log('Shift available, Select Line to get Device ID') : this.getDeviceId();
                   console.log('Exp-PO', value);
              });
              }}
              style={pickerSelectStyles}
              value={this.state.selectedExpPo}
              useNativeAndroidPickerStyle={false}
              />            
              <View style={{paddingVertical: 5}} />
            </View> : <></>}
  

            { this.state.selectedExpPo ?
              <View>
              <Text style={{paddingLeft: 25, fontWeight: '700', color: '#fff'}}>Color</Text>
              <View style={{paddingVertical: 2}} />
              <RNPickerSelect
              placeholder={placeholder}
              items={this.state.colorNames}
              onValueChange={value => {
                var {vBuyerId, vStyleId, vExpPoorderNo } = this.state;
                var filteredComData = this.state.AllPlanInfo.filter(x => 
                                      x.vBuyerId === vBuyerId && 
                                      x.vStyleId === vStyleId && 
                                      x.vExpPoorderNo === vExpPoorderNo && 
                                      x.vColorId === value);
                //console.log('filteres',filteredComData);
                const sizeNames = setupPickerData(filteredComData, 'vSizeName', 'vSizeId', value, 'vColorId');
                  //console.log('sizes',sizeNames, 'size', value)
                  this.setState({
                    selectedColor: value,
                    sizeNames,
                    finalProductionObject: undefined,
                    disableMultipleSizeButton: false,
                    colorFilteredSizes: filteredComData,
                    //filteredPlanInfo: filteredComData,
                    vColorId: value,
                    vSizeId: '',
                    vSizeName: '',
                    dShipmentDate: '',
                    selectedSize: '',
                }, ()=>{
                 
                  console.log('color', value);
              });
              }}
              style={pickerSelectStyles}
              value={this.state.selectedColor}
              useNativeAndroidPickerStyle={false}
              />            
              <View style={{paddingVertical: 5}} />  
            </View> : <></>}

            { this.state.selectedColor ?
              <View>
              <Text style={{paddingLeft: 25, fontWeight: '700', color: '#fff'}}>Size</Text>
              <View style={{paddingVertical: 2}} />
              <RNPickerSelect
              placeholder={placeholder}
              items={this.state.sizeNames}
              onValueChange={value => {

                  this.setState({
                   selectedSize: value,
                    
                    vSizeId: value,
                    dShipmentDate: '',
                }, ()=>{
                  console.log('size', this.state.selectedSize);
                  
                  //TODO: issue with G1 -> L1 -> Target -> PO-210  -> Size XXL -> selectedObj -> undefined

                   var {vBuyerId, vStyleId, vExpPoorderNo, vColorId, vSizeId} = this.state;

                   var selectedObj = this.state.AllPlanInfo.filter(x => 
                                          x.vBuyerId === vBuyerId && 
                                          x.vStyleId === vStyleId && 
                                          x.vExpPoorderNo === vExpPoorderNo && 
                                          x.vColorId === vColorId &&
                                          x.vSizeId ===  vSizeId)[0];

                    console.log('selectedObj', selectedObj);
                    
                    this.setState({
                      finalProductionObject: selectedObj, 
                      dShipmentDate: selectedObj ? moment(selectedObj.dShipmentDate).format('DD-MM-YYYY') : ''},
                      ()=>{
                        
                    })
                  //console.log( {selectedBuyer, selectedStyle, selectedExpPo, selectedColor, selectedSize});
              });
              }}
              style={pickerSelectStyles}
              value={this.state.selectedSize}
              useNativeAndroidPickerStyle={false}
              // ref={el => {
              //     this.inputRefs.favSport1 = el;
              // }}
              />            
              {/* <View style={{paddingVertical: 5}} />   */}
            </View> : <></>}

            {/* <Text style={{paddingLeft: 25, fontWeight: '700', color: '#fff'}}>Shipment Date</Text>
            <Mytextinput
              placeholder="Shipment Date"
              editable={false}
              value={this.state.dShipmentDate}
              style={{
                backgroundColor: "#2d395c",
                color: "#fff",
                borderRadius: 7,
                
              }}
              
              //onChangeText={user_name => this.setState({ user_name })}
            /> */}

            {/* <View style={{paddingVertical: 5}} />
            <Text style={{paddingLeft: 25, fontWeight: '700', color: '#fff'}}>Today</Text>
            <Mytextinput
              value={this.state.dToday}
              style={{
                backgroundColor: "#2d395c",
                color: "#fff",
                borderRadius: 7,
              }}
            /> */}
            
            <View style={{paddingVertical: 5}} />  
            <View style={{
              display:'flex', 
              flexDirection:'row', 
              justifyContent:'center',
              alignItems: 'center'
              }}>
                

                {/* <View style={{paddingVertical: 5}} />   */}
                {/* <Mybutton
                  title="Multiple Sizes"
                  disabled={this.state.disableMultipleSizeButton}
                customClick={()=>  this.gotoMultipleSizeCountScreen()}
                /> */}

                <Mybutton
                  title="Logout"
                  style={{backgroundColor:"#ff5353", width: 100}}
                  //disabled={this.state.showLogoutButton}
                customClick={()=>   this.syncAndLogout()}
                />
                
                <Mybutton
                  style={{backgroundColor: "#3d9efd", width: 100}}
                  title="Sync Data"
                  //disabled={this.state.showLogoutButton}
                customClick={()=> this.SyncAllDataWithServer()}
                />
                
                <Mybutton
                  style={{backgroundColor:"#2aad48", width: 100}}
                  title="Set Up"
                  customClick={()=> this.gotoMultipleSizeCountScreen()}
                />
            </View>
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
        paddingLeft: 70,
    }
})


const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: 'gray',
      backgroundColor: "#2d395c",
      borderRadius: 7,
      color: '#fff',
      paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
      fontSize: 16,
      marginLeft: 20,
      backgroundColor: "#2d395c",
      marginRight: 20,
      paddingHorizontal: 10,
      paddingVertical: 8,
      //borderWidth: 0.5,
      //borderColor: '#000',
      borderRadius: 7,
      color: '#fff',
      paddingRight: 30, // to ensure the text is never behind the icon
    },
  });