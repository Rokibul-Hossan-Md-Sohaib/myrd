import React, { Component } from 'react'
import { View, Text, StatusBar, Pressable, Dimensions, StyleSheet } from 'react-native';
import moment from 'moment'
import {HourInfoSchema, CurrentLoggedInUserSchema, DeviceWiseProductionSchema} from '../db/schemas/dbSchema'
import {moderateScale} from 'react-native-size-matters'
import Orientation from 'react-native-orientation';
import Realm from 'realm';
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

      currentProdObj:{},
      currentHourObj:{},
      current_login:{},
      currentCountObj:[],

      currentHour: null,
      isSynced: false,
    }
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
          alert("This is not the production Hour!, Try After sometimes.");
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
              this.writeToLocalDb(this.state.currentCountObj);
            });

        }else{
          //New Hour detected, So this will reset hourCounter but main counter will go on...
          // And will create a new db entry with NEW hour ID
          this.setState(() => ({
            fttCount: 1,
            currentCountObj: { 
              iAutoId, vDeviceId, dEntryDate, vProductionPlanId, vUnitLineId, vHourId: thisHourID["vHourId"],
              dDateOfProduction, dStartTimeOfProduction, dEndTimeOfProduction,
              iTarget, vProTypeId, nHour, iManPower, vPreparedBy, vShiftId, 
              iProductionQty: 1, dLastUpdated: dateObj 
              },
            totalDayFttCount: this.state.totalDayFttCount + 1,
            currentHour: thisHourID["vHourId"]
          }),()=>{
            //console.log('Production count write to db....', this.state.currentCountObj.iProductionQty)
            alert("New Hour Detected!", thisHourID["vHourId"]);
            this.writeToLocalDb(this.state.currentCountObj);
          });
        }
      }

    }

    countDefect(){
      this.setState((prevState, props) => ({
        defectCount: prevState.defectCount + 1
      }), ()=>{
          console.log('count defect')
        // this.props.navigation.navigate('Details',{
        //   itemId: 86,
        //   otherParam: 'anything you want here',
        // })
      });
    }

    getCurrentHourId(){
      var timeNow = '1900-01-01T'+new Date().getHours()+':00:00';
      var currentHour = null;
      var hourObj = realm.objects(HourInfoSchema.name)
      .filtered('dStartTimeOfProduction = $0', timeNow)[0];

      if(hourObj != undefined){        
        //console.log('hour now:', hourObj["vHourId"]);
        currentHour = hourObj;//["vHourId"];
      }else{
        //console.log("No Hour Available Now")
        currentHour = undefined;
      }

      return currentHour;
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

    componentDidMount(){
      Orientation.lockToLandscapeLeft();
      var currentCountObj = {};
      const reqObj = this.props.navigation.getParam('userData');
      var current_login = realm.objects(CurrentLoggedInUserSchema.name)[0];
      var currentHour = this.getCurrentHourId();

      if(currentHour === undefined){
          alert("This Hour is not available for Production Entry!, Try Again after sometimes.")
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
            currentProdObj: reqObj,
            currentHour: currentHour["vHourId"], currentHourObj: currentHour, current_login, currentCountObj, fttCount: currentCountObj.iProductionQty, totalDayFttCount //TODO: totalDayFttCount will be total of all hours ftt summation.
          },()=>{
            console.log('write initial production cout object to local db')
            this.writeToLocalDb(this.state.currentCountObj);
          });
          //TODO: dDateOfProduction= dateObj;  should be the today's date, the day production count took place so that if device shutsdown we can retrive earlier production count data of today
        }
      /***TODO: Will have to check local db if there is anydata available for -> today -> This hour -> this device -> unitlineId -> production PlanID wise
       * if exists set current production count object to existing production count object
       * other wise create new object and insert into localdb and set state object to that new production object...
       */

    }

    
  writeToLocalDb = (dataToWrite) =>{
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
            
            <Pressable onPress={()=>this.countDefect()} style={{...styles.CountTileStyle, marginLeft:moderateScale(10),  backgroundColor: '#fda912'}}>
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
    
      {/* <Text>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => this.props.navigation.navigate('Details',{
          itemId: 86,
          otherParam: 'anything you want here',
        })}
        /> */}
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
    textStyle:{
      
    }
  
  });

export default ProductionCountSizeWise