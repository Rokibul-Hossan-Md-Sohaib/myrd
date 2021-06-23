import React, { Component } from 'react'
import { View, Text, StatusBar, Pressable, Dimensions, StyleSheet, Modal, TouchableOpacity, Button, Animated, Easing } from 'react-native';
import moment from 'moment'
import Toast from 'react-native-toast-message';
import {handleAndroidBackButton, removeAndroidBackButtonHandler} from '../utils/backHandler.config';
import NetInfo, {NetInfoSubscription, NetInfoState} from '@react-native-community/netinfo'
import {
  writeProductionToLocalDB, 
  writeReworkedToLocalDB, 
  writeRejectToLocalDB, 
  writeDefectToLocalDB,
  syncBulkData
} from '../db/dbServices/__LDB_Count_Services'
import {    
  getCurrentHourId,
  getTodaysTotalFttCount,
  getTodaysTotalDefectCount,
  getUniqueAttributes,
  getTodaysTotalRejectCount,
  getTodaysTotalReworkCount,
  getCurrentLoggedInUserForToday,
  getAllDefects,
  getCurrentHourExistingData
} from '../db/dbServices/__LDB_Count_Utilities'
import Icon from 'react-native-vector-icons/FontAwesome5'
import * as constKVP from '../utils/constKVP'
import {moderateScale} from 'react-native-size-matters'
import Orientation from 'react-native-orientation';
import { ScrollView } from 'react-native-gesture-handler';
import { NavigationScreenProp } from 'react-navigation';
import { __API_OK_PATH } from '../utils/constKVP';
import { DailyProductionPlanSummery, QMS_ProductionCountHourly } from '../db/schemas/entities';
let dateObj: Date = new Date();

/**
 * /DataTracking/SyncBulkProductionData
 * /DataTracking/SyncBulkDefectData
 * /DataTracking/SyncBulkRejectData
 * /DataTracking/SyncBulkReworkedData
 * 
 */

type Props = {
  navigation: NavigationScreenProp<any,any>
};

type State = {
  today: string,
  totalDayFttCount: number,
  totalDayDefectCount: number,
  totalDayRejectCount:number,
  totalDayReworkedCount:number,

  fttCount: number,
  defectCount: number,
  rejectCount: number,
  reworkedCount: number,

  incrementBy: number,
  screenWidth: number,
  screenHeight: number,
  modalVisible: boolean,

  shwoNextButton:boolean,
  showStyleImage:boolean,
  modeCode: number,
  modeColor: string,

  allDefects: any[],
  defectCategories:any[],
  filteredDefects:any[],
  selectedDefectObj:any,
  selectedDefectCategory: any,
  selectedDefectHeadId: any,

  currentProdObj:any,
  currentHourObj:any,
  current_login:any,
  currentCountObj:any,

  unitName: string,
  lineName: string,
  
  currentHour: any,
  isConnected: boolean | null,
  isApiOK: boolean | null,
  isSynced: boolean | null
};



class ProductionCountSizeWise extends React.Component<Props, State> {

    _subscription: NetInfoSubscription | null = null;

    state: State ={
      today: moment().format('YYYY-MM-DD'),
      totalDayFttCount: 0,
      totalDayDefectCount: 0,
      totalDayRejectCount:0,
      totalDayReworkedCount:0,

      fttCount: 0,
      defectCount: 0,
      rejectCount: 0,
      reworkedCount: 0,

      incrementBy: 1,
      screenWidth: 0,
      screenHeight: 0,
      modalVisible: false,

      shwoNextButton:false,
      showStyleImage:false,
      modeCode: -1,
      modeColor: "#3d9efd",

      allDefects:[],
      defectCategories:[],
      filteredDefects:[],
      selectedDefectObj:null,
      selectedDefectCategory: null,
      selectedDefectHeadId: null,

      currentProdObj:{},
      currentHourObj:{},
      current_login:{},
      currentCountObj:{},

      unitName: '',
      lineName: "",

      currentHour: null,
      isConnected: false,
      isApiOK: true,
      isSynced: true,
    }
    _rotateValue: Animated.Value;

//moment(new Date()).format("hh:00A");
    constructor(props: Props) {
      super(props);
      this._rotateValue = new Animated.Value(0);
      this.props.navigation.addListener(
        'didFocus',
        payload => {
          Orientation.lockToLandscapeLeft();
          handleAndroidBackButton(this.navigateBack);
        });
    }

    navigateBack = ()=>{
        this.props.navigation.goBack();
    }

    syncCurrentData = async () =>{
        this.startSyncRotation();
        var syncyed = await syncBulkData();
        if(syncyed){
          Toast.show({
            type: "success",
            position: 'bottom',
            text1: "Data Syncying Successful.",
            visibilityTime: 1500,
            });
            this.setState({isSynced: syncyed, isConnected: syncyed, isApiOK: syncyed},()=> this.stopSyncRotation());
        }else{
          Toast.show({
            type: "error",
            position: 'bottom',
            text1: "Something Wrong with Data Sync.",
            visibilityTime: 1500,
            });
            this.setState({isSynced: syncyed, isConnected: syncyed, isApiOK: syncyed},()=> this.stopSyncRotation());
        }
    }

    stopSyncRotation(){
      this._rotateValue.stopAnimation();
    }

    startSyncRotation(){
      this._rotateValue.setValue(0);
      Animated.timing(this._rotateValue, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true
      }).start((o)=>{
        if(o.finished){
          this.startSyncRotation();
        }
      });
    }

    countFtt(){
      /**Check if the API End is available now */
      //this.checkApiAvailability();
      //vHourId: this.getCurrentHourId(),
      //get Previous hour check if new hour equels to state hour
      var thisHourID: any = getCurrentHourId();
      ////console.log('Now',thisHourID)

      if(thisHourID === undefined){
        Toast.show({
          type: "error",
          position: 'top',
          text1: "Alert!",
          text2: "This is not the production Hour!, Try After sometimes.",
          visibilityTime: 1500,
          })
          setTimeout(() => {
            this.props.navigation.goBack();
        }, 2000);
      }else{

            var {
              iAutoId, vDeviceId, dEntryDate, vProductionPlanId, vUnitLineId, vHourId, vBuyerId, vStyleId, vColorId, vSizeId,
              vBuyerName, vSizeName, vExpPoorderNo, vColorName, vStyleName, dShipmentDate,
              dDateOfProduction, dStartTimeOfProduction, dEndTimeOfProduction,iProductionQty,iTotalPlanQty, fSmv, iHel, iMo, iPlanHour, nForecast,
              iTarget, vProTypeId, nHour, iManPower, vPreparedBy, vShiftId
            } = this.state.currentCountObj;

          if(thisHourID["vHourId"] === this.state.currentCountObj.vHourId){    
            
            //This is running hour...
            this.setState(() => ({
              fttCount: this.state.fttCount + 1, //hour based counter
              currentCountObj: { 
                    iAutoId, vDeviceId, dEntryDate, vProductionPlanId, vUnitLineId, vHourId, 
                    vBuyerName, vSizeName, vExpPoorderNo, vColorName, vStyleName, dShipmentDate, vBuyerId, vStyleId, vColorId, vSizeId,
                    dDateOfProduction, dStartTimeOfProduction, dEndTimeOfProduction,iTotalPlanQty,
                    iTarget, vProTypeId, nHour, iManPower, vPreparedBy, vShiftId,  fSmv, iHel, iMo, iPlanHour, nForecast,
                    iProductionQty: iProductionQty + 1, dLastUpdated: dateObj 
                    },
              totalDayFttCount: this.state.totalDayFttCount + 1, //independent of hour
              currentHour: thisHourID["vHourId"]
            }),async ()=>{
              ////console.log('Production count write to db....', this.state.currentCountObj)
            var {currentCountObj} = this.state;
            
            /**Send Data to local persistance */
            var isOk = await writeProductionToLocalDB(currentCountObj);
            this.setState({isApiOK: isOk, isSynced: isOk});
              // isOk.then((val)=>{
              //       this.setState({isApiOK: val});
              // }).catch(errorMessage => {
              ////   console.log(errorMessage);
              //   this.setState({isApiOK: false});
              // });

            });

        }else{
          //New Hour detected, So this will reset hourCounter but main counter will go on...
          // And will create a new db entry with NEW hour ID

          //console.log('New hour totalDayFttCount',this.state.totalDayFttCount);
          this.setState(() => ({
            fttCount: 1,
            currentCountObj: { 
              iAutoId: 0, vDeviceId, dEntryDate, vProductionPlanId, vUnitLineId, vHourId: thisHourID["vHourId"],
              vBuyerName, vSizeName, vExpPoorderNo, vColorName, vStyleName, dShipmentDate, vBuyerId, vStyleId, vColorId, vSizeId,
              dDateOfProduction, dStartTimeOfProduction, dEndTimeOfProduction, iTotalPlanQty,
              iTarget, vProTypeId, nHour, iManPower, vPreparedBy, vShiftId, fSmv, iHel, iMo, iPlanHour, nForecast,
              iProductionQty: 1, dLastUpdated: dateObj 
              },
            totalDayFttCount: this.state.totalDayFttCount + 1,
            currentHour: thisHourID["vHourId"]
          }),async ()=>{
            ////console.log('Production count write to db....', this.state.currentCountObj.iProductionQty)
            Toast.show({
              type: "info",
              position: 'bottom',
              text1: "Info !",
              text2: "New Hour Detected! "+thisHourID["vHourId"],
              visibilityTime: 1500,
              });

              var {currentCountObj} = this.state;
              /**Send Data to local persistance */
              var isOk = await writeProductionToLocalDB(currentCountObj);
              this.setState({isApiOK: isOk});
              // isOk.then((val)=>{
              //       this.setState({isApiOK: val});
              // }).catch(errorMessage => {
              ////   console.log(errorMessage);
              //   this.setState({isApiOK: false});
              // });
          });
        }
      }

    }

    countDefect(){
      /**Check if the API End is available now */
      //this.checkApiAvailability();

      this.setState((prevState, props) => ({
        defectCount: prevState.defectCount + 1,
        totalDayDefectCount: prevState.totalDayDefectCount+1
      }), async ()=>{
        
        var currentDefectCountObj =
          {
            iAutoId: 0,
            vDeviceId: this.state.current_login.vDeviceId,
            dDateOfProduction: this.state.current_login.dLoginDateTime,                      
            vProductionPlanId: this.state.currentProdObj.vProductionPlanId,
            vUnitLineId: this.state.current_login.vUnitLineId,

            vBuyerId: this.state.currentProdObj.vBuyerId,
            vBuyerName: this.state.currentProdObj.vBuyerName,

            vStyleId:  this.state.currentProdObj.vStyleId,
            vStyleName: this.state.currentProdObj.vStyleName,
      
            vExpPoorderNo:  this.state.currentProdObj.vExpPoorderNo,
      
            vColorId:  this.state.currentProdObj.vColorId,
            vColorName: this.state.currentProdObj.vColorName,
      
            vSizeId:  this.state.currentProdObj.vSizeId,
            vSizeName: this.state.currentProdObj.vSizeName,

            vDefectCategoryId: this.state.selectedDefectObj.vDefectCategoryId,
            vDefectCategoryName: this.state.selectedDefectObj.vDefectCategoryName,
            vDefectHeadId: this.state.selectedDefectObj.vHeadId,
            vDefectHeadName: this.state.selectedDefectObj.vHeadName,
            vDefectCode: this.state.selectedDefectObj.code,
            iDefectCount: 1,
            dLastUpdated: dateObj
        };

        /**Send Data to local persistance ==> Not required to acknowledge here */
        var isOk = await writeDefectToLocalDB(currentDefectCountObj);
        //this.setState({isApiOK: isOk}, ()=> this.setModalVisible(constKVP.__MODAL_FOR_DEFECT));
        this.setState((prev)=>({
          isApiOK: isOk,
          isSynced: isOk,
          modalVisible: !prev.modalVisible, 
          modeCode: constKVP.__MODAL_FOR_DEFECT,
          modeColor: constKVP.__MODAL_DEFECT_BUTTON_COLOR
        }));
        /***TODO: Show Total Defects on Count, save on local db As individual Defect category */
        /***TODO: Save Defect Count Data to Local DB, And should be updated any existing defect data with production plan id, dDateOf Prod, vULID, Defect Code */
      });
    }
    
    countreject(){
      /**Check if the API End is available now */
      //this.checkApiAvailability();

      this.setState((prevState, props) => ({
        rejectCount: prevState.rejectCount + 1,
        totalDayRejectCount: prevState.totalDayRejectCount+1
      }), async ()=>{
          ////console.log('count defect')
         var currentRejectCountObj =
          {
            iAutoId: 0,
            vDeviceId: this.state.current_login.vDeviceId,
            dDateOfProduction: this.state.current_login.dLoginDateTime,                      
            vProductionPlanId: this.state.currentProdObj.vProductionPlanId,
            vUnitLineId: this.state.current_login.vUnitLineId,

            vBuyerId: this.state.currentProdObj.vBuyerId,
            vBuyerName: this.state.currentProdObj.vBuyerName,

            vStyleId:  this.state.currentProdObj.vStyleId,
            vStyleName: this.state.currentProdObj.vStyleName,
      
            vExpPoorderNo:  this.state.currentProdObj.vExpPoorderNo,
      
            vColorId:  this.state.currentProdObj.vColorId,
            vColorName: this.state.currentProdObj.vColorName,
      
            vSizeId:  this.state.currentProdObj.vSizeId,
            vSizeName: this.state.currentProdObj.vSizeName,

            vDefectCategoryId: this.state.selectedDefectObj.vDefectCategoryId,
            vDefectCategoryName: this.state.selectedDefectObj.vDefectCategoryName,
            vDefectHeadId: this.state.selectedDefectObj.vHeadId,
            vDefectHeadName: this.state.selectedDefectObj.vHeadName,
            vDefectCode: this.state.selectedDefectObj.code,
            iRejectCount: 1,
            dLastUpdated: dateObj
        };

        ////console.log(currentRejectCountObj);
        var isOk = await writeRejectToLocalDB(currentRejectCountObj);
        this.setState((prev)=>({
          isApiOK: isOk, 
          isSynced: isOk,
          modalVisible: !prev.modalVisible, 
          modeCode: constKVP.__MODAL_FOR_REJECT,
          modeColor: constKVP.__MODAL_REJECT_BUTTON_COLOR
        }));
        /***TODO: Show Total Defects on Count, save on local db As individual Defect category */
        /***TODO: Save Defect Count Data to Local DB, And should be updated any existing defect data with production plan id, dDateOf Prod, vULID, Defect Code */
      });

    }

    countreworked(){
      /**Check if the API End is available now */
      //this.checkApiAvailability();

      this.setState((prevState, props) => ({
        reworkedCount: prevState.reworkedCount + 1,
        totalDayReworkedCount: prevState.totalDayReworkedCount+1
      }), async ()=>{
          ////console.log('count defect')
         var currentReworkedCountObj =
          {
            iAutoId: 0,
            vDeviceId: this.state.current_login.vDeviceId,
            dDateOfProduction: this.state.current_login.dLoginDateTime,                      
            vProductionPlanId: this.state.currentProdObj.vProductionPlanId,
            vUnitLineId: this.state.current_login.vUnitLineId,

            vBuyerId: this.state.currentProdObj.vBuyerId,
            vBuyerName: this.state.currentProdObj.vBuyerName,

            vStyleId:  this.state.currentProdObj.vStyleId,
            vStyleName: this.state.currentProdObj.vStyleName,
      
            vExpPoorderNo:  this.state.currentProdObj.vExpPoorderNo,
      
            vColorId:  this.state.currentProdObj.vColorId,
            vColorName: this.state.currentProdObj.vColorName,
      
            vSizeId:  this.state.currentProdObj.vSizeId,
            vSizeName: this.state.currentProdObj.vSizeName,

            iReworkedCount: this.state.reworkedCount,
            dLastUpdated: dateObj
        };
        
        ////console.log(currentReworkedCountObj);
        var isOk = await writeReworkedToLocalDB(currentReworkedCountObj);
        this.setState({isApiOK: isOk, isSynced: isOk});
        
      });
    }

    filterDefectesCategoryWise(categoryId: string){
      var filteredDefects = this.state.allDefects.filter(x=> x.vDefectCategoryId === categoryId);
      this.setState({selectedDefectCategory: categoryId, filteredDefects, shwoNextButton:false});
    }

    _handleConnectivityChange = (state: NetInfoState) => {
      this.setState({
        isConnected: state.isConnected,
      },()=> {
        if(state.isConnected){
          this.syncCurrentData();
        }
      });
    };

    componentWillUnmount(){
      this._subscription && this._subscription();
      removeAndroidBackButtonHandler();
      //console.log('unmounted production count');
    }

    // checkApiAvailability= async()=>{
    //   await get(__API_OK_PATH)
    //   .then((response: any) => {
    ////     console.log(response);
    ////     this.setState({isApiOK: true},()=> console.log('api ok', response.data));
    //   })
    //   .catch(errorMessage => {
    ////     this.setState({isApiOK: false},()=> console.log('api ok false', errorMessage));
    //   });
    // }

    componentDidMount= async()=>{

      Orientation.lockToLandscapeLeft();
      /**Check if the API End is available now */
      //await this.checkApiAvailability();

      this._subscription = NetInfo.addEventListener(
        this._handleConnectivityChange
      );

      var currentCountObj: any = {};
      const reqObj: any = this.props.navigation.getParam('userData');
      //console.log('reqObj',reqObj);
      var current_login: any = getCurrentLoggedInUserForToday(this.state.today);
      let allDefects: any = getAllDefects();
      var defectCategories = getUniqueAttributes(allDefects, "vDefectCategoryId", "vDefectCategoryName", "vHeadShortName");
      var currentHour = getCurrentHourId();
      let lineName: string = reqObj["vLineId"];
      let unitName: string = reqObj["vUnitName"]; 
      unitName = unitName.split('-')[1];
      /***
       * 
       * this.state.currentProdObj["vUnitName"].split("-")[1]+'/'+this.state.currentProdObj["vLineId"]}/
       * 
       */
      //lineName: string,

      if(currentHour === undefined){
            Toast.show({
              type: "error",
              position: 'bottom',
              text1: "Alert!",
              text2: "This Hour is not available for Production Entry!, Try Again after this hour.",
              visibilityTime: 1500,
              });
          setTimeout(() => {
              this.props.navigation.goBack();
          }, 2000);
      }else{
          let existingData: any = getCurrentHourExistingData(reqObj, currentHour, current_login)
          let totalDayFttCount = getTodaysTotalFttCount(reqObj);
          let totalDayDefectCount = getTodaysTotalDefectCount(reqObj);
          let totalDayRejectCount = getTodaysTotalRejectCount(reqObj);
          let totalDayReworkedCount = getTodaysTotalReworkCount(reqObj);
          
              if(existingData === undefined){
                //console.log('Not Found Any Data Count');
                currentCountObj =
                    {
                      iAutoId: 0,
                      vDeviceId: current_login.vDeviceId,
                      dEntryDate: dateObj,
                      dLastUpdated: dateObj,
                      vProductionPlanId: reqObj.vProductionPlanId,
                      vUnitLineId: current_login.vUnitLineId,

                      vBuyerId:  reqObj.vBuyerId,
                      vBuyerName: reqObj.vBuyerName,
                
                      vStyleId:  reqObj.vStyleId,
                      vStyleName: reqObj.vStyleName,
                
                      vExpPoorderNo:  reqObj.vExpPoorderNo,
                
                      vColorId:  reqObj.vColorId,
                      vColorName: reqObj.vColorName,
                
                      vSizeId:  reqObj.vSizeId,
                      vSizeName: reqObj.vSizeName,

                      fSmv: reqObj.fSmv, 
                      iHel: reqObj.iHel, 
                      iMo: reqObj.iMo, 
                      iPlanHour: reqObj.iPlanHour, 
                      nForecast: reqObj.nForecast,

                      iProductionQty: 0,
                      iTotalPlanQty: reqObj.iTotalPlanQty,
                      vHourId: currentHour["vHourId"],
                      dDateOfProduction: reqObj.dDate,
                      dStartTimeOfProduction: currentHour.dStartTimeOfProduction,
                      dEndTimeOfProduction: currentHour.dEndTimeOfProduction,
                      dShipmentDate: reqObj.dShipmentDate,
                      iTarget: reqObj.iTarget,
                      vProTypeId: 'PT1',
                      nHour: currentHour.nHour,
                      iManPower: reqObj.iManpower,
                      vPreparedBy: current_login.vDeviceId,
                      vShiftId: reqObj.vShiftId
                  };
              }else{
                //console.log('Found Existing Data Count:', existingData.iProductionQty)
                currentCountObj = existingData;
              }
          //console.log('countObj',currentCountObj);
            
          this.setState({
            currentProdObj: reqObj,allDefects,defectCategories,
            currentHour: currentHour["vHourId"], 
            currentHourObj: currentHour, 
            current_login, 
            currentCountObj, 
            fttCount: currentCountObj.iProductionQty, //current hour wise counter

            unitName,
            lineName,
            
            defectCount: totalDayDefectCount,
            rejectCount: totalDayRejectCount,
            reworkedCount: totalDayReworkedCount,

            totalDayFttCount,
            totalDayDefectCount ,
            totalDayRejectCount,
            totalDayReworkedCount
            //TODO: totalDayFttCount will be total of all hours ftt summation.
          },async ()=>{
            //console.log('write initial production cout object to local db');
            var isOk = await writeProductionToLocalDB(this.state.currentCountObj);
            this.setState({isApiOK: isOk});
            // isOk.then((val)=>{
            //       this.setState({isApiOK: val});
            // }).catch(errorMessage => {
            ////   console.log(errorMessage);
            //   this.setState({isApiOK: false});
            // });
          });
          //TODO: dDateOfProduction= dateObj;  should be the today's date, the day production count took place so that if device shutsdown we can retrive earlier production count data of today
        }
      /***TODO: Will have to check local db if there is anydata available for -> today -> This hour -> this device -> unitlineId -> production PlanID wise
       * if exists set current production count object to existing production count object
       * other wise create new object and insert into localdb and set state object to that new production object...
       */

    }


    selectDefectHead(defectHeadCode: string){
      var selectedDefectObj = this.state.filteredDefects.filter(x=> x.vHeadId === defectHeadCode)[0];
      if(selectedDefectObj === null){
        return;
      }
      this.setState({
        selectedDefectObj, 
        selectedDefectHeadId: selectedDefectObj.vHeadId, 
        shwoNextButton:true
      },()=>{
        //console.log("in state",this.state.selectedDefectObj.vHeadName)
      });
    }

    _onLayout(e: any) {
      //console.log("Screen Orientation Changed...")
      this.setState({
        screenWidth: Dimensions.get('window').width,
        screenHeight: Dimensions.get('window').height
      })
  
    }

    setModalVisible(modeCode: number) {
      if(modeCode === constKVP.__MODAL_FOR_DEFECT){
        let modeColor: string = "#fda912";
        this.setState((prevState/*, props*/) => ({
          modalVisible: !prevState.modalVisible,
          modeColor, modeCode
        }));
      }else if(modeCode === constKVP.__MODAL_FOR_REJECT){
        //modeCode => constKVP.__MODAL_FOR_REJECT
        let modeColor: string = "#ff5353";
        this.setState((prevState/*, props*/) => ({
          modalVisible: !prevState.modalVisible,
          modeColor, modeCode
        }));
      }else{
        let modeColor: string = "#3d9efd";
        this.setState((prevState/*, props*/) => ({
          modalVisible: !prevState.modalVisible,
          modeColor, modeCode: -1
        }));
      }
    }


  render() {
    const {screenHeight, screenWidth} = this.state;
    const RotateData = this._rotateValue.interpolate({
      inputRange: [0,1],
      outputRange: ['0deg', '360deg']
    });
    //style={[{flex: 1, margin: moderateScale(10), flexDirection:'column'}, styles.elementsContainer]}
    return (
      <View style={styles.container} >
        
      <StatusBar hidden={true}/>
        <View style={screenHeight > screenWidth ? styles.ContainerPortrait : styles.ContainerLandscape} onLayout={this._onLayout.bind(this)}>
          
          <View style={{flex:.65, flexDirection:'row', backgroundColor: '#222b45', justifyContent:'space-evenly', borderWidth: .3, borderColor: '#343a40'}}>
            <View style={{flex:.08, justifyContent:'center', alignItems:'center'}}>
                <View style={{height: 25, width:25, backgroundColor: this.state.isConnected ? '#45c065' : '#ff5353', borderRadius: 25 }} />
                <View style={{position:'absolute', height: 15, width:15, backgroundColor: this.state.isApiOK ? '#45c065' : '#fda912', borderRadius: 25 }} />
            </View>

          <View style={{flex: .8, flexDirection:'column', justifyContent:'space-evenly'}}>
            <View style={{flex:1, flexDirection:'row', justifyContent:'space-evenly', borderBottomColor:'#6c757d'}}>
                <Text numberOfLines={1} style={styles.titleTxtStyle}>Buyer: {this.state.currentProdObj.vBuyerName}</Text>
                <Text numberOfLines={1} style={styles.titleTxtStyle}>Style: {this.state.currentProdObj.vStyleName}</Text>
                <Text numberOfLines={1} style={styles.titleTxtStyle}>ExPo: {this.state.currentProdObj.vExpPoorderNo}</Text>
            </View>
            <View style={{flex:1, flexDirection:'row', justifyContent:'space-evenly'}}>
                <Text numberOfLines={1} style={styles.titleTxtStyle}>Color: {this.state.currentProdObj.vColorName}</Text>
                <Text numberOfLines={1} style={styles.titleTxtStyle}>Size: {this.state.currentProdObj.vSizeName}</Text>
                <Text numberOfLines={1} style={styles.titleTxtStyle}>Shipment: {moment(this.state.currentProdObj.dShipmentDate).format('DD-MM-YYYY')}</Text>
            </View>
          </View>

            <View style={{flex:.15, justifyContent:'space-evenly', flexDirection:'row', alignItems:'center'}}>
              <Text style={{fontSize: 16, fontWeight:'bold', color:'#fff'}}>{this.state.unitName +"/"+this.state.lineName }/{this.state.currentHour ?? "N/A" }</Text>
              <Animated.View style={{transform:[{rotate: RotateData}]}}>
                <Icon onPress={()=> this.syncCurrentData()} name="sync" size={20} color={this.state.isSynced ? '#45c065' : "#ff5353"} />
              </Animated.View>
              {/* <Text style={{fontSize: 16, fontWeight:'bold'}}>Sync</Text> */}
            </View>
          </View>

          <View style={{flex: 6, flexDirection: 'column', padding: 10}}>

          
          <View style={{flex: 3, marginBottom:moderateScale(10), flexDirection:'row'}}>

            <Pressable onPress={()=>this.countFtt()} style={{...styles.CountTileStyle, backgroundColor: '#45c065', borderRadius: 7}}>
              <Text style={{fontSize: moderateScale(25), fontWeight:'bold'}}>ACCEPT</Text>
              <Text style={{fontSize: moderateScale(25), fontWeight:'bold', color: '#fff'}}>{this.state.totalDayFttCount}</Text>
            </Pressable >
            
            <Pressable onPress={()=>this.setModalVisible(constKVP.__MODAL_FOR_DEFECT)} style={{...styles.CountTileStyle, marginLeft:moderateScale(10),  backgroundColor: '#fda912', borderRadius: 7}}>
                <Text style={{fontSize: moderateScale(25), fontWeight:'bold'}}>DEFECT</Text>
                <Text style={{fontSize: moderateScale(25), fontWeight:'bold', color: '#fff'}}>{this.state.totalDayDefectCount}</Text>
            </Pressable>

          </View>

          <View style={{flex: 3, flexDirection:'row'}}>
            
            <Pressable onPress={()=>this.setModalVisible(constKVP.__MODAL_FOR_REJECT)} style={{...styles.CountTileStyle, backgroundColor: '#ff5353', borderRadius: 7}}>
            <Text style={{fontSize: moderateScale(25), fontWeight:'bold'}}>REJECT</Text>
            <Text style={{fontSize: moderateScale(25), fontWeight:'bold', color: '#fff'}}>{this.state.totalDayRejectCount}</Text>
            </Pressable>

            <Pressable onPress={()=>this.countreworked()} style={{...styles.CountTileStyle, marginLeft:moderateScale(10),   backgroundColor: '#3d9efd', borderRadius: 7}}>
            <Text style={{fontSize: moderateScale(25), fontWeight:'bold'}}>REWORKED</Text>
            <Text style={{fontSize: moderateScale(25), fontWeight:'bold', color: '#fff'}}>{this.state.totalDayReworkedCount}</Text>
            </Pressable>

          </View>
          </View>
        </View>
        
        <View>
                <Modal
                  animationType="fade"
                  transparent={true}
                  visible={this.state.modalVisible}
                  onRequestClose={() => this.setModalVisible(-1) }>
                  <View style={{height: this.state.screenHeight, width: this.state.screenWidth, backgroundColor:'rgba(0,0,0,0.7)'}}>
                    <View style={{ flex:1, flexDirection:'column', justifyContent:'space-between', borderColor:'green', borderWidth:1, borderRadius:10, marginVertical: this.state.screenHeight/8, backgroundColor:'#222b45',  margin:10, padding:10}}>
                        <View style={{flex:1, flexDirection:'row', justifyContent:'space-between',  margin:10}}>
                          {
                            this.state.showStyleImage ? 
                            <View style={{flex:1, flexDirection:'column', justifyContent:'center', alignItems:'center' }}>
                                <Text style={{fontWeight:'bold', fontSize:25, color:'red'}}>Style Image Will Be shown here.</Text>
                                <Button onPress={()=>{
                                  this.setState({showStyleImage: false},()=>{
                                    this.setModalVisible(-1);
                                  })
                                }} title={"Close (X)"}></Button>
                            </View>
                            :
                                <View style={{flex:1, flexDirection:'row', justifyContent:'flex-start', alignItems:'center' }}>
                                  <View style={{flex:.45, flexDirection:'column', justifyContent:'center', alignItems:'center',  margin:10}}>
                                    {
                                      this.state.defectCategories.map((item, index) => {
                                          return(<View style={{flex:1, padding:2, flexDirection:'row', width: screenWidth/2, justifyContent:'space-around'}} key={index}>
                                            {
                                                  <TouchableOpacity key={index} 
                                                    style={{
                                                      padding:5, 
                                                      width: "80%",
                                                      borderRadius:7,
                                                      justifyContent:'center', 
                                                      alignItems:'center', 
                                                      backgroundColor: item.vDefectCategoryId === this.state.selectedDefectCategory ? "#303d61" : "#222b45",
                                                      borderWidth: item.vDefectCategoryId === this.state.selectedDefectCategory ? 1.5 : 1, 
                                                      borderColor: item.vDefectCategoryId === this.state.selectedDefectCategory ? '#00d68f' : '#FFF'
                                                    }} 
                                                    onPress={() => this.filterDefectesCategoryWise(item.vDefectCategoryId)}>
                                                        <Text style={{fontWeight:'bold', color: item.vDefectCategoryId === this.state.selectedDefectCategory ? '#00d68f' : '#FFF' , fontSize: 14}}>{item.vDefectCategoryId === this.state.selectedDefectCategory ? (item.vDefectCategoryName+" ("+item.vHeadShortName+")   ✔") : (item.vDefectCategoryName+" ("+item.vHeadShortName+")")}</Text>
                                                  </TouchableOpacity>
                                            }
                                          </View>)
                                      })
                                    }
                                    </View>
                                    <View style={{flex:.45, flexDirection:'column', justifyContent:'center', alignItems:'center',  margin:10}}>
                                      {
                                        this.state.filteredDefects.length > 0 ? 
                                            <ScrollView horizontal={false}>
                                                <View style={{flex:1, alignItems: 'center', justifyContent:'center'}}>
                                                  {
                                                    this.state.filteredDefects.map((item, index) => {
                                                        return(<View style={{flex:1,  padding:2, flexDirection:'row', justifyContent:'space-around'}} key={index}>
                                                          {//selectedDefectHeadId
                                                                <TouchableOpacity key={index} 
                                                                  style={{
                                                                    padding:5, 
                                                                    width: "100%",
                                                                    borderRadius:7, 
                                                                    alignItems:'center',
                                                                    borderWidth:  item.vHeadId === this.state.selectedDefectHeadId ? 1.5 : 1,
                                                                    justifyContent:'center', 
                                                                    backgroundColor:  item.vHeadId === this.state.selectedDefectHeadId ? "#303d61" : "#222b45",
                                                                    borderColor: item.vHeadId === this.state.selectedDefectHeadId ? this.state.modeColor :'#20c997'
                                                                    }} onPress={() => this.selectDefectHead(item.vHeadId)}>
                                                                      <Text 
                                                                        style={{
                                                                            fontWeight:'bold', 
                                                                            maxWidth: screenWidth/3, 
                                                                            textAlignVertical:'center',
                                                                            textAlign:'center', 
                                                                            color:item.vHeadId === this.state.selectedDefectHeadId ?  this.state.modeColor :'#20c997',
                                                                            fontSize: 14
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
                                    <View style={{
                                            //flex:.02, 
                                            height: 50,
                                            position:'absolute',
                                            right:0,
                                            bottom:0,
                                            top:"40%",
                                            width: 50,
                                            transform: [{ scale: this.state.shwoNextButton ? 1 : 0 }], 
                                            flexDirection:'column', 
                                            borderRadius:25, 
                                            justifyContent:'center', 
                                            backgroundColor: this.state.modeColor, 
                                            alignItems:'center',  
                                            margin:10
                                            }}>
                                        <TouchableOpacity 
                                          style={{flex:1, justifyContent:'center', alignItems:'center'}} 
                                          onPress={()=> {
                                            /***This logic will be updated when style related images will be used for defect place tracking... */
                                            if(this.state.modeCode === constKVP.__MODAL_FOR_DEFECT){
                                                this.countDefect()
                                            }else{
                                              //this.state.modeCode === constKVP.__MODAL_FOR_REJECT
                                                this.countreject();
                                            } 
                                            /*this.setState({showStyleImage: true})*/
                                          }}
                                          >
                                          <Icon name="long-arrow-alt-right" size={25} color={"#fff"} />
                                          {/* <Text style={{textAlign:'center', textAlignVertical:'center', fontWeight:'bold', color:'#fff', fontSize: 26, textTransform:'uppercase'}}>{"+"}</Text> */}
                                        </TouchableOpacity>
                                    </View>
                              </View>   
                          } 
                        </View>
                        <View style={{flex:1, position:'absolute', right: 0, top: 0, marginTop: -10}}>
                          <TouchableOpacity style={{width:30, height:30,marginTop:10, borderTopRightRadius:7, borderBottomLeftRadius:7, backgroundColor:'#20c997', flex:1, justifyContent:'center'}} onPress={() => this.setModalVisible(-1)}>
                              <Text style={{textAlign:'center', fontWeight:'bold', color:'#fff', fontSize: 15, textTransform:'uppercase'}}>X</Text>
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
      backgroundColor: "#151a30",
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
    },
    titleTxtStyle:{
      flex:1, 
      fontSize: moderateScale(11), 
      fontWeight:'bold', 
      textAlign:'center',
      color: '#fff'
    }
  
  });

export default ProductionCountSizeWise