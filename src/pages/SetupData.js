/*Screen to register the user*/
import React from 'react';
import { View, ScrollView, KeyboardAvoidingView, Alert, StyleSheet, Text } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import Mytextinput from './components/Mytextinput';
import DeviceInfo from 'react-native-device-info'
import moment from 'moment'
import Toast from 'react-native-toast-message';
import Mybutton from './components/Mybutton';
import {post} from '../utils/apiUtils'
import ProgressDialog from '../utils/loader'
import Orientation from 'react-native-orientation';
import {DailyPlanSchema} from '../db/schemas/dbSchema'
import Realm from 'realm';
let realm;

export default class SetupData extends React.Component {

    state = {
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
        deviceId: undefined,
    };

    constructor(props) {
    super(props);
    this.props.navigation.addListener(
      'didFocus',
      payload => {
        Orientation.lockToPortrait()
      });    
    realm = new Realm({ path: 'QmsDb.realm' });
  }

    componentDidMount(){
      Orientation.lockToPortrait()
      const comInfo = realm.objects(DailyPlanSchema.name);
      const reqObj = this.props.navigation.getParam('userData');
        console.log('reqObj', reqObj)
       // console.log('isTab', DeviceInfo.isTablet())

      this.setState({AllPlanInfo: comInfo, reqObj, filteredPlanInfo: comInfo}, ()=>{
        const buyerNames = this.setupPickerData(this.state.AllPlanInfo, 'vBuyerName', 'vBuyerId');
        this.setState({
          buyerNames,
         // loading: false
        },()=> console.log('buyer', this.state.buyerNames.length))
      })   
      
    }

  setupPickerData(dataArr, labelName, valueName, filterTxt, filterColumn){

    var depid = [];

    if(filterTxt && filterColumn){
      depid = dataArr.filter(x => x[filterColumn] === filterTxt).map((obj,idx) => ({[valueName]: obj[valueName], [labelName]: obj[labelName]}));
      //console.log(depid);
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
 
  gotoMultipleSizeCountScreen(){
    if(this.state.colorFilteredSizes.length > 0){
      this.props.navigation.navigate('MultipleSizeCount', {userData: this.state.colorFilteredSizes});
    }else{
      alert("total sizes",this.state.colorFilteredSizes.length);
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
        text2: "Something Went Wrong!",
        visibilityTime: 1500,
        })
    }

  //   var {vCompanyId, vUnitId, vUnitLineId, vShiftId, vDeviceId, Password } = this.state;
  //   var reqObj = {
  //     "deviceId": vDeviceId,
  //     "devicePwd": vDeviceId,//Password,
  //     "companyId": vCompanyId,
  //     "unitId": vUnitId,
  //     "unitLineId": vUnitLineId,
  //     "shiftId": vShiftId,
  //     "dateTime": "2020-11-04"//moment().format('DD-MM-YYYY')
  // }

  // this.setState({loading: true}, ()=>{
  //   post('/GetProductionPlanUnitLineData', reqObj)
  //   .then(response => {
  //       this.setState({loading: false}, ()=>{
  //           var responseData = response.data;
  //           console.log(responseData);
  //       if(responseData.auth){

          
  //         var toastFlavour = responseData.dailyProdPlanData.length > 0 ? "success" : "info";
  //         var toastTitleTxt = responseData.dailyProdPlanData.length > 0 ? "Successed!" : "Info!";

  //         this.writeToLocalDb(responseData.dailyProdPlanData);
          
  //           Toast.show({
  //               type: toastFlavour,
  //               position: 'top',
  //               text1: toastTitleTxt,
  //               text2: responseData.msg+' 👋 length: '+responseData.dailyProdPlanData.length,
  //               visibilityTime: 1500,
  //               })
  //           //this.props.navigation.navigate('HomeScreen', responseData.userObj);
  //       }else{
  //           Toast.show({
  //               type: 'error',
  //               position: 'top',
  //               text1: 'Error!',
  //               text2: responseData.msg,
  //               visibilityTime: 1500,
  //               })
  //       }
  //       });

  //   })
  //   .catch(errorMessage => {   
  //       this.setState({loading: false}, ()=>{
  //           Toast.show({
  //               type: 'error',
  //               position: 'top',
  //               text1: 'Error!',
  //               text2: errorMessage
  //               })
  //       }); 
  //   });
  // })

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


  
  writeToLocalDb = (dataToWrite) =>{
    console.log('write to DB')
    //Clear any existing data in local db
    this.clearLocalDb();
      //write plan data to local db
      //DailyPlanSchema.name
        realm.write(() => {
            dataToWrite.forEach(obj => {
              realm.create(DailyPlanSchema.name, obj);
          });
        });
  }

  clearLocalDb = () => {
    console.log('clear DB')
     realm.write(() => {
    // Delete multiple books by passing in a `Results`, `List`,
    // or JavaScript `Array`
     let allPlanData = realm.objects(DailyPlanSchema.name);
     realm.delete(allPlanData); // Deletes all plans
  });
   
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

            <Text style={{paddingLeft: 25, fontWeight: '700'}}>Buyer</Text>
            <View paddingVertical={2} />
            <RNPickerSelect
            placeholder={placeholder}
            items={this.state.buyerNames}
            onValueChange={value => {
              
              var filteredComData = this.state.AllPlanInfo.filter(x => x.vBuyerId === value); 
              const styleNames = this.setupPickerData(filteredComData, 'vStyleName', 'vStyleId', value, 'vBuyerId');

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

            <View paddingVertical={5} />
            
            { this.state.selectedBuyer ?
              <View>
              <Text style={{paddingLeft: 25, fontWeight: '700'}}>Style</Text>
              <View paddingVertical={2} />
              <RNPickerSelect
              placeholder={placeholder}
              items={this.state.styleNames}
              onValueChange={value => {

                var filteredComData = this.state.AllPlanInfo.filter(x => x.vBuyerId === this.state.vBuyerId && x.vStyleId === value); 
                const expPos = this.setupPickerData(filteredComData, 'vExpPoorderNo', 'vExpPoorderNo', value, 'vStyleId');

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
              
            <View paddingVertical={5} />              
            </View> : <></>}

            { this.state.selectedStyle ?
              <View>
              <Text style={{paddingLeft: 25, fontWeight: '700'}}>Export PO</Text>
              <View paddingVertical={2} />
              <RNPickerSelect
              placeholder={placeholder}
              items={this.state.expPos}
              onValueChange={value => {
                var {vBuyerId, vStyleId } = this.state;
                var filteredComData = this.state.AllPlanInfo.filter(x => 
                                                    x.vBuyerId === vBuyerId && 
                                                    x.vStyleId === vStyleId && 
                                                    x.vExpPoorderNo === value); 
                const colorNames = this.setupPickerData(filteredComData, 'vColorName', 'vColorId', value, 'vExpPoorderNo');

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
              <View paddingVertical={5} />
            </View> : <></>}
  

            { this.state.selectedExpPo ?
              <View>
              <Text style={{paddingLeft: 25, fontWeight: '700'}}>Color</Text>
              <View paddingVertical={2} />
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
                const sizeNames = this.setupPickerData(filteredComData, 'vSizeName', 'vSizeId', value, 'vColorId');
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
              <View paddingVertical={5} />  
            </View> : <></>}

            { this.state.selectedColor ?
              <View>
              <Text style={{paddingLeft: 25, fontWeight: '700'}}>Size</Text>
              <View paddingVertical={2} />
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
              <View paddingVertical={5} />  
            </View> : <></>}

            <Text style={{paddingLeft: 25, fontWeight: '700'}}>Shipment Date</Text>
            <Mytextinput
              placeholder="Shipment Date"
              editable={false}
              value={this.state.dShipmentDate}
              //onChangeText={user_name => this.setState({ user_name })}
            />

            <View paddingVertical={5} />
            <Text style={{paddingLeft: 25, fontWeight: '700'}}>Today</Text>
            <Mytextinput
              value={this.state.dToday}
            />
            
            <View paddingVertical={5} />  
            <Mybutton
              title="Set Up"
              customClick={()=> this.setupDataForProduction()}
            />

            <View paddingVertical={5} />  
            {/* <Mybutton
              title="With Multiple Sizes"
              disabled={this.state.disableMultipleSizeButton}
             customClick={()=>  this.gotoMultipleSizeCountScreen()}
            /> */}
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