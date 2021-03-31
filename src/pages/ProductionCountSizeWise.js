import React, { Component } from 'react'
import { View, Text, StatusBar, Pressable, Dimensions, StyleSheet, Modal, TouchableOpacity, Button } from 'react-native';
import moment from 'moment'
import Toast from 'react-native-toast-message';
import {HourInfoSchema, CurrentLoggedInUserSchema, DeviceWiseProductionSchema, DefectSchema} from '../db/schemas/dbSchema'
import {moderateScale} from 'react-native-size-matters'
import Orientation from 'react-native-orientation';
import Realm from 'realm';
import { ScrollView } from 'react-native-gesture-handler';
let realm, dateObj = new Date();
class ProductionCountSizeWise extends Component {

    state={
      fttCount: 0,
      totalDayFttCount: 0,

      defectCount: 0,
      rejectCount: 0,
      rectifiedCount: 0,
      incrementBy: 1,
      screenWidth: null,
      screenHeight: null,
      modalVisible: false,

      shwoNextButton:false,
      showStyleImage:false,

      allDefects:[],
      defectCategories:[],
      filteredDefects:[],
      selectedDefectObj:null,
      selectedDefectCategory: null,
      selectedDefectHeadId: null,

      currentProdObj:{},
      currentHourObj:{},
      current_login:{},
      currentCountObj:[],

      currentHour: null,
      isSynced: false,
    }

    /**
     * Toast.show({
            type: toastFlavour,
            position: 'bottom',
            text1: toastTitleTxt,
            text2: responseData.msg+' 👋 length: '+responseData.dailyProdPlanData.length,
            visibilityTime: 1500,
            })
     *  
     */
//moment(new Date()).format("hh:00A");
    constructor(props) {
      super(props);
      this.props.navigation.addListener(
        'didFocus',
        payload => {
          Orientation.lockToLandscapeLeft();
        });    
      realm = new Realm({ path: 'QmsDb.realm' });
    }

    countFtt(){
      //vHourId: this.getCurrentHourId(),
      //get Previous hour check if new hour equels to state hour
      var thisHourID = this.getCurrentHourId();

      if(thisHourID === undefined){
        Toast.show({
          type: "error",
          position: 'top',
          text1: "Alert!",
          text2: "This is not the production Hour!, Try After sometimes.",
          visibilityTime: 1500,
          })
      }else{

            var {
              iAutoId, vDeviceId, dEntryDate, vProductionPlanId, vUnitLineId, vHourId,
              dDateOfProduction, dStartTimeOfProduction, dEndTimeOfProduction,iProductionQty,
              iTarget, vProTypeId, nHour, iManPower, vPreparedBy, vShiftId
            } = this.state.currentCountObj;

          if(thisHourID["vHourId"] === this.state.currentCountObj.vHourId){    
            
            //This is running hour...
            this.setState(() => ({
              fttCount: this.state.fttCount + 1,
              currentCountObj: { 
                    iAutoId, vDeviceId, dEntryDate, vProductionPlanId, vUnitLineId, vHourId,
                    dDateOfProduction, dStartTimeOfProduction, dEndTimeOfProduction,
                    iTarget, vProTypeId, nHour, iManPower, vPreparedBy, vShiftId, 
                    iProductionQty: iProductionQty + 1, dLastUpdated: dateObj 
                    },
              totalDayFttCount: this.state.totalDayFttCount + 1,
              currentHour: thisHourID["vHourId"]
            }),()=>{
              //console.log('Production count write to db....', this.state.currentCountObj)
              this.writeProductionToLocalDB(this.state.currentCountObj);
            });

        }else{
          //New Hour detected, So this will reset hourCounter but main counter will go on...
          // And will create a new db entry with NEW hour ID
          this.setState(() => ({
            fttCount: 1,
            currentCountObj: { 
              iAutoId: 0, vDeviceId, dEntryDate, vProductionPlanId, vUnitLineId, vHourId: thisHourID["vHourId"],
              dDateOfProduction, dStartTimeOfProduction, dEndTimeOfProduction,
              iTarget, vProTypeId, nHour, iManPower, vPreparedBy, vShiftId, 
              iProductionQty: 1, dLastUpdated: dateObj 
              },
            totalDayFttCount: this.state.totalDayFttCount + 1,
            currentHour: thisHourID["vHourId"]
          }),()=>{
            //console.log('Production count write to db....', this.state.currentCountObj.iProductionQty)
            Toast.show({
              type: "info",
              position: 'bottom',
              text1: "Info !",
              text2: "New Hour Detected! "+thisHourID["vHourId"],
              visibilityTime: 1500,
              });
            this.writeProductionToLocalDB(this.state.currentCountObj);
          });
        }
      }

    }

    countDefect(){

      this.setState((prevState, props) => ({
        defectCount: prevState.defectCount + 1,
      }), ()=>{
          //console.log('count defect')
          currentDefectCountObj =
          {
            iAutoId: 0,
            vDeviceId: this.state.current_login.deviceId,
            dDateOfProduction: this.state.current_login.dateTime,                      
            vProductionPlanId: this.state.currentProdObj.vProductionPlanId,
            vUnitLineId: this.state.current_login.unitLineId,
            vSizeName: this.state.currentProdObj.vSizeName,
            vDefectCategoryId: this.state.selectedDefectObj.vDefectCategoryId,
            vDefectCategoryName: this.state.selectedDefectObj.vDefectCategoryName,
            vDefectHeadId: this.state.selectedDefectObj.vHeadId,
            vDefectHeadName: this.state.selectedDefectObj.vHeadName,
            vDefectCode: this.state.selectedDefectObj.code,
            iDefectCount: this.state.defectCount,
        };

        console.log(currentDefectCountObj);
        this.writeDefectToLocalDB(currentDefectCountObj);
        /***TODO: Show Total Defects on Count, save on local db As individual Defect category */
        /***TODO: Save Defect Count Data to Local DB, And should be updated any existing defect data with production plan id, dDateOf Prod, vULID, Defect Code */
        this.setModalVisible();
      });
    }

    writeDefectToLocalDB = (dataToWrite) =>{
           /***TODO: Check Esisting Data, if exists Update, otherwise add new entry */
           /**Show total defect count on screen Tile */
           /** defect count should be at size level... */
           console.log(dataToWrite);
    }

    getCurrentHourId(){
      var timeNow = '1900-01-01T'+dateObj.getHours()+':00:00';
      var currentHour = null;
      var hourObj = realm.objects(HourInfoSchema.name)
      .filtered('dStartTimeOfProduction = $0', timeNow)[0];

      if(hourObj === undefined){        
        
        //console.log("No Hour Available Now")
        timeNow = '1900-01-01T'+(dateObj.getHours()-1)+':00:00';
        currentHour =  realm.objects(HourInfoSchema.name)
      .filtered('dStartTimeOfProduction = $0', timeNow)[0];

        if(currentHour === undefined){ //IF CURRENT HOUR IS 6/7 AM
            timeNow = '1900-01-01T'+(dateObj.getHours()-2)+':00:00';
            currentHour =  realm.objects(HourInfoSchema.name)
          .filtered('dStartTimeOfProduction = $0', timeNow)[0];
        }

      }else{
        //console.log('hour now:', hourObj["vHourId"]);
        currentHour = hourObj;//["vHourId"];
      }

      return currentHour;
    }

    filterDefectesCategoryWise(categoryId){
      var filteredDefects = this.state.allDefects.filter(x=> x.vDefectCategoryId === categoryId);
      this.setState({selectedDefectCategory: categoryId, filteredDefects, shwoNextButton:false},()=> console.log("Defectes Count",filteredDefects.length))
    }

    getTodaysTotalFttCount(reqObj){
      let existingData = realm.objects(DeviceWiseProductionSchema.name)
      .filtered('dDateOfProduction = $0 && vProductionPlanId =$1', reqObj.dDate, reqObj.vProductionPlanId);
      if(existingData.length > 0){
          return existingData.reduce((accumulator, item)=> accumulator + item.iProductionQty, 0);
      }else{
          return 0;
      }
    }

    componentWillUnmount(){
      console.log('unmounted production count');
    }

    getUniqueAttributes(jsnArr, attrbId, attribVal, ext){
      //var depid = jsnArr.map((obj,idx) => ({[attrbId]: obj[attrbId], [attribVal]: obj[attribVal]}))
      var uniqueResult = [], mapx = new Map();
            for (const item of jsnArr) {
                if(!mapx.has(item[attrbId])){
                    mapx.set(item[attrbId], true);    // set any value to Map
                    uniqueResult.push({
                        [attrbId]: item[attrbId],
                        [attribVal]: item[attribVal],
                        [ext]: item[ext]
                    });
                }
            }
        return uniqueResult;
    }

    componentDidMount(){
      Orientation.lockToLandscapeLeft();
      var currentCountObj = {};
      const reqObj = this.props.navigation.getParam('userData');
      var current_login = realm.objects(CurrentLoggedInUserSchema.name)[0];
      var allDefects = realm.objects(DefectSchema.name);
      var defectCategories = this.getUniqueAttributes(allDefects, "vDefectCategoryId", "vDefectCategoryName", "vHeadShortName");
      var currentHour = this.getCurrentHourId();

      if(currentHour === undefined){
            Toast.show({
              type: "error",
              position: 'bottom',
              text1: "Alert!",
              text2: "This Hour is not available for Production Entry!, Try Again after sometimes.",
              visibilityTime: 1500,
              });

              // currentCountObj =
              //       {
              //         iAutoId: 0,
              //         vDeviceId: current_login.deviceId,
              //         dEntryDate: dateObj,
              //         dLastUpdated: dateObj,
              //         vProductionPlanId: reqObj.vProductionPlanId,
              //         vUnitLineId: current_login.unitLineId,
              //         vHourId: currentHour["vHourId"],
              //         dDateOfProduction: reqObj.dDate,
              //         dStartTimeOfProduction: currentHour.dStartTimeOfProduction,
              //         dEndTimeOfProduction: currentHour.dEndTimeOfProduction,
              //         iProductionQty: 0,
              //         iTarget: reqObj.iTarget,
              //         vProTypeId: 'PT1',
              //         nHour: currentHour.nHour,
              //         iManPower: reqObj.iManpower,
              //         vPreparedBy: current_login.deviceId,
              //         vShiftId: reqObj.vShiftId
              //     };
      }else{
          let existingData = realm.objects(DeviceWiseProductionSchema.name)
          .filtered('dDateOfProduction = $0 && vProductionPlanId =$1 && vHourId = $2 && vUnitLineId = $3 && vDeviceId=$4', reqObj.dDate, reqObj.vProductionPlanId, currentHour["vHourId"], current_login.unitLineId, current_login.deviceId)[0];
          let totalDayFttCount = this.getTodaysTotalFttCount(reqObj);
          // console.log('Existing Data Count:', existingData)
          // console.log(typeof(existingData))

              if(existingData === undefined){
                console.log('Not Found Any Data Count');
                currentCountObj =
                    {
                      iAutoId: 0,
                      vDeviceId: current_login.deviceId,
                      dEntryDate: dateObj,
                      dLastUpdated: dateObj,
                      vProductionPlanId: reqObj.vProductionPlanId,
                      vUnitLineId: current_login.unitLineId,
                      vHourId: currentHour["vHourId"],
                      dDateOfProduction: reqObj.dDate,
                      dStartTimeOfProduction: currentHour.dStartTimeOfProduction,
                      dEndTimeOfProduction: currentHour.dEndTimeOfProduction,
                      iProductionQty: 0,
                      iTarget: reqObj.iTarget,
                      vProTypeId: 'PT1',
                      nHour: currentHour.nHour,
                      iManPower: reqObj.iManpower,
                      vPreparedBy: current_login.deviceId,
                      vShiftId: reqObj.vShiftId
                  };
              }else{
                console.log('Found Existing Data Count:', existingData.iProductionQty)
                currentCountObj = existingData;
              }
            
          this.setState({
            currentProdObj: reqObj,allDefects,defectCategories,
            currentHour: currentHour["vHourId"], currentHourObj: currentHour, current_login, currentCountObj, fttCount: currentCountObj.iProductionQty, totalDayFttCount //TODO: totalDayFttCount will be total of all hours ftt summation.
          },()=>{
            console.log('write initial production cout object to local db')
            this.writeProductionToLocalDB(this.state.currentCountObj);
          });
          //TODO: dDateOfProduction= dateObj;  should be the today's date, the day production count took place so that if device shutsdown we can retrive earlier production count data of today
        }
      /***TODO: Will have to check local db if there is anydata available for -> today -> This hour -> this device -> unitlineId -> production PlanID wise
       * if exists set current production count object to existing production count object
       * other wise create new object and insert into localdb and set state object to that new production object...
       */

    }

    
  writeProductionToLocalDB = (dataToWrite) =>{
    console.log('write to DB')

    //Clear any existing data in local db
    //this.clearLocalDb();

      realm.write(() => { //write single data
        //realm.create(DeviceWiseProductionSchema.name, updatedData);
        let existingData = realm.objects(DeviceWiseProductionSchema.name)
                            .filtered('dDateOfProduction = $0 && vProductionPlanId =$1 && vHourId = $2 && vUnitLineId = $3 && vDeviceId=$4', 
                            dataToWrite.dDateOfProduction, 
                            dataToWrite.vProductionPlanId, 
                            dataToWrite.vHourId, 
                            dataToWrite.vUnitLineId, 
                            dataToWrite.vDeviceId)[0];

          if(existingData === undefined){
            //as no previous data exists, we will create new data row...
            realm.create(DeviceWiseProductionSchema.name, dataToWrite);
          }else{
            existingData.iProductionQty =  dataToWrite.iProductionQty;
            existingData.dLastUpdated =  dateObj;
          }                            
            
      });
  }

//   clearLocalDb = () => {
//     console.log('clear DB')
//      realm.write(() => {
//     // Delete multiple books by passing in a `Results`, `List`,
//     // or JavaScript `Array`
//      let allPlanData = realm.objects(DeviceWiseProductionSchema.name);
//      realm.delete(allPlanData); // Deletes all plans
//   });
   
// }

    selectDefectHead(defectHeadCode){
      var selectedDefectObj = this.state.filteredDefects.filter(x=> x.vHeadId === defectHeadCode)[0];
      if(selectedDefectObj === null){
        return;
      }
      this.setState({
        selectedDefectObj, 
        selectedDefectHeadId: selectedDefectObj.vHeadId, 
        shwoNextButton:true
      },()=>{
        console.log("in state",this.state.selectedDefectObj.vHeadName)
      });
    }

    countrectified(){
      this.setState((prevState, props) => ({
        rectifiedCount: prevState.rectifiedCount + 1
      }));
    }

    countreject(){
      this.setState((prevState, props) => ({
        rejectCount: prevState.rejectCount + 1
      }));
    }

    _onLayout(e) {
      console.log("Screen Orientation Changed...")
      this.setState({
        screenWidth: Dimensions.get('window').width,
        screenHeight: Dimensions.get('window').height
      })
  
    }

    setModalVisible() {
      //this.setState((prevState)=> {modalVisible: visible});
      this.setState((prevState/*, props*/) => ({
        modalVisible: !prevState.modalVisible
      }));
    }


  render() {
    const {screenHeight, screenWidth} = this.state
    //style={[{flex: 1, margin: moderateScale(10), flexDirection:'column'}, styles.elementsContainer]}
    return (
      <View style={styles.container} >
        
      <StatusBar hidden={true}/>
        <View style={screenHeight > screenWidth ? styles.ContainerPortrait : styles.ContainerLandscape} onLayout={this._onLayout.bind(this)}>
          
          <View style={{flex:.65, flexDirection:'row', justifyContent:'space-evenly', borderWidth: 1, borderColor: 'green'}}>
            <View style={{flex:.1, justifyContent:'center', alignItems:'center'}}>
                {/* <Text>green</Text> */}
                <View style={{height: 20, width:20, backgroundColor: this.state.isSynced ? 'green' : 'red', borderRadius: 25 }} />
            </View>


          <View style={{flex: .8, flexDirection:'column', justifyContent:'space-around'}}>
            <View style={{flex:1, flexDirection:'row', justifyContent:'space-around', borderBottomColor:'green'}}>
                <Text numberOfLines={1} style={{flex:1, fontSize: moderateScale(11), fontWeight:'bold', textAlign:'center'}}>Buyer: {this.state.currentProdObj.vBuyerName}</Text>
                <Text numberOfLines={1} style={{flex:1, fontSize: moderateScale(11), fontWeight:'bold', textAlign:'center'}}>Style: {this.state.currentProdObj.vStyleName}</Text>
                <Text numberOfLines={1} style={{flex:1, fontSize: moderateScale(11), fontWeight:'bold', textAlign:'center'}}>ExPo: {this.state.currentProdObj.vExpPoorderNo}</Text>
            </View>
            <View style={{flex:1, flexDirection:'row', justifyContent:'space-around'}}>
                <Text numberOfLines={1} style={{flex:1, fontSize: moderateScale(11), fontWeight:'bold', textAlign:'center'}}>Color: {this.state.currentProdObj.vColorName}</Text>
                <Text numberOfLines={1} style={{flex:1, fontSize: moderateScale(11), fontWeight:'bold', textAlign:'center'}}>Size: {this.state.currentProdObj.vSizeName}</Text>
                <Text numberOfLines={1} style={{flex:1, fontSize: moderateScale(11), fontWeight:'bold', textAlign:'center'}}>Shipment: {moment(this.state.currentProdObj.dShipmentDate).format('DD-MM-YYYY')}</Text>
            </View>
          </View>

            
            <View style={{flex:.1, justifyContent:'center', alignItems:'center'}}>
              <Text style={{fontSize: 16, fontWeight:'bold'}}>{ this.state.currentHour ?? "N/A"}</Text>
            </View>
          </View>

          {/* <View style={{flex: 6, flexDirection: 'column'}}>

          </View> */}
          <View style={{flex: 3, marginBottom:moderateScale(10), flexDirection:'row'}}>

            <Pressable onPress={()=>this.countFtt()} style={{...styles.CountTileStyle, backgroundColor: '#45c065'}}>
              <Text style={{fontSize: moderateScale(25), fontWeight:'bold'}}>FTT</Text>
              <Text style={{fontSize: moderateScale(25), fontWeight:'bold', color: '#fff'}}>{this.state.totalDayFttCount}</Text>
            </Pressable >
            
            <Pressable onPress={()=>this.setModalVisible()} style={{...styles.CountTileStyle, marginLeft:moderateScale(10),  backgroundColor: '#fda912'}}>
                <Text style={{fontSize: moderateScale(25), fontWeight:'bold'}}>DEFECT</Text>
                <Text style={{fontSize: moderateScale(25), fontWeight:'bold', color: '#fff'}}>{this.state.defectCount}</Text>
            </Pressable>

          </View>

          <View style={{flex: 3, flexDirection:'row'}}>
            
            <Pressable onPress={()=>this.countreject()} style={{...styles.CountTileStyle, backgroundColor: '#ff5353'}}>
            <Text style={{fontSize: moderateScale(25), fontWeight:'bold'}}>REJECT</Text>
            <Text style={{fontSize: moderateScale(25), fontWeight:'bold', color: '#fff'}}>{this.state.rejectCount}</Text>
            </Pressable>

            <Pressable onPress={()=>this.countrectified()} style={{...styles.CountTileStyle, marginLeft:moderateScale(10),   backgroundColor: '#3d9efd'}}>
            <Text style={{fontSize: moderateScale(25), fontWeight:'bold'}}>RECTIFIED</Text>
            <Text style={{fontSize: moderateScale(25), fontWeight:'bold', color: '#fff'}}>{this.state.rectifiedCount}</Text>
            </Pressable>

          </View>

        </View>
        
        <View>
                <Modal
                  animationType="fade"
                  transparent={true}
                  visible={this.state.modalVisible}
                  onRequestClose={() => this.setModalVisible() }>
                  <View style={{height: this.state.screenHeight, width: this.state.screenWidth, backgroundColor:'rgba(0,0,0,0.7)'}}>
                    <View style={{ flex:1, flexDirection:'column', justifyContent:'space-between', borderColor:'green', borderWidth:1, borderRadius:10, marginVertical: this.state.screenHeight/8, backgroundColor:'#fff',  margin:10, padding:10}}>
                        <View style={{flex:1, flexDirection:'row', justifyContent:'space-between',  margin:10}}>
                          {
                            this.state.showStyleImage ? 
                            <View style={{flex:1, flexDirection:'column', justifyContent:'center', alignItems:'center' }}>
                                <Text style={{fontWeight:'bold', fontSize:25, color:'red'}}>Style Image Will Be shown here.</Text>
                                <Button onPress={()=>{
                                  this.setState({showStyleImage: false},()=>{
                                    this.setModalVisible();
                                  })
                                }} title={"Close (X)"}></Button>
                            </View>
                            :
                                <View style={{flex:1, flexDirection:'row', justifyContent:'space-between', }}>
                                  <View style={{flex:.49, flexDirection:'column', justifyContent:'center', alignItems:'center',  margin:10}}>
                                    {
                                      this.state.defectCategories.map((item, index) => {
                                          return(<View style={{flex:1, padding:5, flexDirection:'row', width: screenWidth/2, justifyContent:'space-around'}} key={index}>
                                            {
                                                  <TouchableOpacity key={index} 
                                                    style={{
                                                      padding:5, 
                                                      borderRadius:25,
                                                      justifyContent:'center', 
                                                      alignItems:'center', 
                                                      borderWidth:1, 
                                                      borderColor: item.vDefectCategoryId === this.state.selectedDefectCategory ? '#880e4f' : '#b58ba2'
                                                    }} 
                                                    onPress={() => this.filterDefectesCategoryWise(item.vDefectCategoryId)}>
                                                        <Text style={{fontWeight:'bold', color: item.vDefectCategoryId === this.state.selectedDefectCategory ? '#880e4f' : '#b58ba2' , fontSize: 12}}>{item.vDefectCategoryId === this.state.selectedDefectCategory ? (item.vDefectCategoryName+" ("+item.vHeadShortName+")   ✔") : (item.vDefectCategoryName+" ("+item.vHeadShortName+")")}</Text>
                                                  </TouchableOpacity>
                                            }
                                          </View>)
                                      })
                                    }
                                    </View>
                                    <View style={{flex:.49, flexDirection:'column', justifyContent:'center', alignItems:'center',  margin:10}}>
                                      {
                                        this.state.filteredDefects.length > 0 ? 
                                            <ScrollView horizontal={false}>
                                                <View style={{flex:1, alignItems: 'center', justifyContent:'center'}}>
                                                  {
                                                    this.state.filteredDefects.map((item, index) => {
                                                        return(<View style={{flex:1,  padding:5, flexDirection:'row', justifyContent:'space-around'}} key={index}>
                                                          {//selectedDefectHeadId
                                                                <TouchableOpacity key={index} 
                                                                  style={{
                                                                    padding:5, 
                                                                    borderRadius:25, 
                                                                    borderWidth:1, 
                                                                    borderColor: item.vHeadId === this.state.selectedDefectHeadId ? "green":'#7fb37f'
                                                                    }} onPress={() => this.selectDefectHead(item.vHeadId)}>
                                                                      <Text 
                                                                        style={{
                                                                            fontWeight:'bold', 
                                                                            maxWidth: screenWidth/3, 
                                                                            textAlignVertical:'center', 
                                                                            textAlign:'center', 
                                                                            color:item.vHeadId === this.state.selectedDefectHeadId ? "green":'#7fb37f',
                                                                            fontSize: 12
                                                                            }}>
                                                                          {item.vHeadId === this.state.selectedDefectHeadId ? ("("+item.code+") -> "+item.vHeadName+"   ✔✔") : ("("+item.code+") -> "+item.vHeadName)}
                                                                        </Text>
                                                                </TouchableOpacity>
                                                          }
                                                        </View>)
                                                    })
                                                  }
                                                </View>
                                            </ScrollView> : <Text style={{fontWeight:'bold', color:'red'}}>Select One Category</Text>

                                      }
                                      
                                    </View>
                                    <View style={{flex:.02, transform: [{ scale: this.state.shwoNextButton ? 1 : 0 }], flexDirection:'column', borderRadius:25, justifyContent:'center', backgroundColor:'#3d9efd', alignItems:'center',  margin:10}}>
                                        <TouchableOpacity 
                                          style={{flex:1, justifyContent:'center', alignItems:'center'}} 
                                          onPress={()=> this.countDefect() /*this.setState({showStyleImage: true})*/}
                                          >
                                          <Text uppercase={false} style={{textAlign:'center', fontWeight:'bold', color:'#fff', fontSize: 25}}>{">"}</Text>
                                        </TouchableOpacity>
                                    </View>
                              </View>   
                          } 
                        </View>
                        <View style={{flex:1, position:'absolute', right: 0, top: 0, marginTop: -10}}>
                          <TouchableOpacity style={{width:30, height:30,marginTop:10, borderTopRightRadius:7, borderBottomLeftRadius:7, backgroundColor:'green', flex:1, justifyContent:'center'}} onPress={() => this.setModalVisible()}>
                              <Text uppercase={false} style={{textAlign:'center', fontWeight:'bold', color:'#fff', fontSize: 15}}>X</Text>
                          </TouchableOpacity>
                        </View>
                    </View>
                  </View>
                </Modal>
              </View>
  </View>
    )
  }
}

const styles = StyleSheet.create({
    container: {
      //marginTop: 48,
      flex: 1
    },
    headerStyle: {
      fontSize: 36,
      textAlign: 'center',
      fontWeight: '100',
      //marginBottom: 24
    },
    CountTileStyle:{
      flex: 1,
      flexDirection:'row', 
      justifyContent: 'space-evenly', 
      alignItems:'center'
    },
    ContainerPortrait: {
      flex: 1,
      // flexDirection: 'column',
      // justifyContent: 'center',
      // alignItems: 'center'
    },
    ContainerLandscape: {
      flex: 1
      // flexDirection: 'row',
      // justifyContent: 'center',
      // alignItems: 'center'
    },
    elementsContainer: {
      backgroundColor: '#ecf5fd',
      //margin: 5,
      //marginLeft: 24,
      //marginRight: 24,
      //marginBottom: 24
    },
    cardShadow:{
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.20,
      shadowRadius: 1.41,
      elevation: 3,
  
      borderWidth:0.3,
      borderRadius:10,
      borderColor:'green'
    }
  
  });

export default ProductionCountSizeWise