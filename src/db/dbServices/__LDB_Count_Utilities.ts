import { 
  DefectSchema,
  HourInfoSchema,
  ProductionCountSchema, 
  DefectCountSchema,
  RejectCountSchema,
  ReworkedCountSchema,
  CurrentLoggedInUserSchema } from '../schemas/realm-schema';
import {convertToArray} from '../../utils/utilityFunctions'
import { RealmQuery } from "../lib/realm-helper.types";
import Realm from "../schemas/realm";
import moment from 'moment'
import { LoggedIn_Session, QMS_ProductionCountHourly, vwDefects, vwTimeInfo } from '../schemas/entities';

/**Gets the current production hour according tp specific timeframe **/
const  getCurrentHourId = (): vwTimeInfo => {
    let currentHour: any;
    let timeNow: string = moment().format('1900-01-01THH:mm:ss');
    //'1900-01-01T'+new Date().getHours()+':00:00';
    console.log('timeNow', timeNow)
    try {
      let hourObj: any = Realm.objects<vwTimeInfo>(HourInfoSchema.name)
      .filtered('dStartTimeOfProduction <= $0 && dEndTimeOfProduction >= $0', timeNow);
        // $0 => dStartTimeOfProduction && $0 <= dEndTimeOfProduction
      //console.log('filtered hour',hourObj);
      hourObj = convertToArray(hourObj)
      console.log('arr hour',hourObj);
  
      if(hourObj.length > 0){        
        //Current Hour info available
        currentHour = hourObj[0];//["vHourId"];
       }else{
         currentHour = undefined;
       }
      
    } catch (error) {
        console.log(error);
        currentHour = undefined;
    }

    return currentHour;
  }

/** Gives todays total FTT count**/
const getTodaysTotalFttCount = (reqObj: any) => {
    let existingProductionData: any = Realm.objects(ProductionCountSchema.name)
    .filtered('dDateOfProduction = $0 && vProductionPlanId =$1 && vUnitLineId =$2 && vStyleId=$3 && vSizeId=$4 && vExpPoorderNo=$5 && vColorId=$6 && vBuyerId=$7', 
              reqObj.dDate, 
              reqObj.vProductionPlanId, 
              reqObj.vUnitLineId, 
              reqObj.vStyleId, 
              reqObj.vSizeId,
              reqObj.vExpPoorderNo,
              reqObj.vColorId,
              reqObj.vBuyerId);
    if(existingProductionData.length > 0){
        return existingProductionData.reduce((accumulator: number, item: any)=> accumulator + item.iProductionQty, 0);
    }else{
        return 0;
    }
  }

/** Gives todays total Defect count**/
const getTodaysTotalDefectCount = (reqObj: any)=>{
    let existingDefectData = Realm.objects(DefectCountSchema.name)
        .filtered('dDateOfProduction = $0 && vProductionPlanId =$1 && vUnitLineId =$2 && vStyleId=$3 && vSizeId=$4 && vExpPoorderNo=$5 && vColorId=$6 && vBuyerId=$7', 
                reqObj.dDate, 
                reqObj.vProductionPlanId, 
                reqObj.vUnitLineId, 
                reqObj.vStyleId, 
                reqObj.vSizeId,
                reqObj.vExpPoorderNo,
                reqObj.vColorId,
                reqObj.vBuyerId);
    if(existingDefectData.length > 0){
        return existingDefectData.reduce((accumulator: number, item: any)=> accumulator + item.iDefectCount, 0);
    }else{
        return 0;
    }
}

const getUniqueAttributes=(jsnArr: any[], attrbId: string, attribVal: string, ext: string)=>{
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

/** Gives todays total Reject count**/
const getTodaysTotalRejectCount = (reqObj: any)=>{
  let existingRejectData = Realm.objects(RejectCountSchema.name)
  .filtered('dDateOfProduction = $0 && vProductionPlanId =$1 && vUnitLineId =$2 && vStyleId=$3 && vSizeId=$4 && vExpPoorderNo=$5 && vColorId=$6 && vBuyerId=$7', 
            reqObj.dDate, 
            reqObj.vProductionPlanId, 
            reqObj.vUnitLineId, 
            reqObj.vStyleId, 
            reqObj.vSizeId,
            reqObj.vExpPoorderNo,
            reqObj.vColorId,
            reqObj.vBuyerId);
  if(existingRejectData.length > 0){
      return existingRejectData.reduce((accumulator: number, item: any)=> accumulator + item.iRejectCount, 0);
  }else{
      return 0;
  }
}

/** Gives todays total Reworked count**/
const getTodaysTotalReworkCount=(reqObj: any)=>{
    let existingReworkedData = Realm.objects(ReworkedCountSchema.name)
    .filtered('dDateOfProduction = $0 && vProductionPlanId =$1 && vUnitLineId =$2 && vStyleId=$3 && vSizeId=$4 && vExpPoorderNo=$5 && vColorId=$6 && vBuyerId=$7', 
              reqObj.dDate, 
              reqObj.vProductionPlanId, 
              reqObj.vUnitLineId, 
              reqObj.vStyleId, 
              reqObj.vSizeId,
              reqObj.vExpPoorderNo,
              reqObj.vColorId,
              reqObj.vBuyerId);
    if(existingReworkedData.length > 0){
        return existingReworkedData.reduce((accumulator: number, item: any)=> accumulator + item.iReworkedCount, 0);
    }else{
        return 0;
    }
  }

/** Get todays logged in user data **/
const getCurrentLoggedInUserForToday=(dayString: string)=>{
    let currLoginData: RealmQuery = Realm.objects<LoggedIn_Session>(CurrentLoggedInUserSchema.name).filtered('dLoginDateTime = $0', dayString);
    currLoginData = convertToArray(currLoginData);
    return currLoginData[0];
}

/** Get all master defect data from local DB **/
const getAllDefects=()=>{
    let allDefects = Realm.objects<vwDefects>(DefectSchema.name);
    allDefects = convertToArray(allDefects);
    return allDefects;
}

/** This function gets current hour existing production count from local DB **/
const getCurrentHourExistingData=(reqObj: any, currentHour: vwTimeInfo, current_login: LoggedIn_Session)=>{
  let existingData: any = Realm.objects<QMS_ProductionCountHourly>(ProductionCountSchema.name)
          .filtered('dDateOfProduction = $0 && vProductionPlanId =$1 && vHourId = $2 && vUnitLineId = $3 && vDeviceId=$4', 
                      reqObj.dDate, 
                      reqObj.vProductionPlanId, 
                      currentHour.vHourId, 
                      current_login.vUnitLineId, 
                      current_login.vDeviceId);
      existingData = convertToArray(existingData);

      return existingData[0];
}

  export {
    getCurrentHourId,
    getTodaysTotalFttCount,
    getTodaysTotalDefectCount,
    getUniqueAttributes,
    getTodaysTotalRejectCount,
    getTodaysTotalReworkCount,
    getCurrentLoggedInUserForToday,
    getAllDefects,
    getCurrentHourExistingData
  }