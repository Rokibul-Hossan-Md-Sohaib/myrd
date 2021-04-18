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
import { LoggedIn_Session, QMS_ProductionCountHourly, vwDefects, vwTimeInfo } from '../schemas/entities';
const dateObj: Date = new Date();

const  getCurrentHourId = (): vwTimeInfo => {
    let currentHour: vwTimeInfo;
    let timeNow: string = '1900-01-01T'+new Date().getHours()+':00:00';
    //console.log('timeNow',timeNow)
    let hourObj: any = Realm.objects<vwTimeInfo>(HourInfoSchema.name)
    .filtered('dStartTimeOfProduction = $0', timeNow);

    hourObj = convertToArray(hourObj)

    if(hourObj.length > 0){        
      //Current Hour info available
      currentHour = hourObj[0];//["vHourId"];
    }else{
      //Current Hour info not available
      // So set current to 1 hour back
      timeNow = '1900-01-01T'+(dateObj.getHours()-1)+':00:00';
      hourObj = Realm.objects<vwTimeInfo>(HourInfoSchema.name)
        .filtered('dStartTimeOfProduction = $0', timeNow);
      hourObj = convertToArray(hourObj)

        if(hourObj.length > 0){       
          currentHour = hourObj[0];
        }else{
          //Current Hour not found in 1 hour back
          // So set current to 2 hours back
          timeNow = '1900-01-01T'+(dateObj.getHours()-2)+':00:00';
          hourObj = Realm.objects<vwTimeInfo>(HourInfoSchema.name)
            .filtered('dStartTimeOfProduction = $0', timeNow);
          hourObj = convertToArray(hourObj)
            currentHour = hourObj[0];
        }
    }

    return currentHour;
  }

const getTodaysTotalFttCount = (reqObj: any) => {
    let existingData: any = Realm.objects(ProductionCountSchema.name)
    .filtered('dDateOfProduction = $0 && vProductionPlanId =$1 && vUnitLineId =$2 && vStyleId=$3 && vSizeId=$4 && vExpPoorderNo=$5 && vColorId=$6 && vBuyerId=$7', 
              reqObj.dDate, 
              reqObj.vProductionPlanId, 
              reqObj.vUnitLineId, 
              reqObj.vStyleId, 
              reqObj.vSizeId,
              reqObj.vExpPoorderNo,
              reqObj.vColorId,
              reqObj.vBuyerId);
    if(existingData.length > 0){
        return existingData.reduce((accumulator: number, item: any)=> accumulator + item.iProductionQty, 0);
    }else{
        return 0;
    }
  }

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

const getTodaysTotalRejectCount = (reqObj: any)=>{
  let existingDefectData = Realm.objects(RejectCountSchema.name)
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
      return existingDefectData.reduce((accumulator: number, item: any)=> accumulator + item.iRejectCount, 0);
  }else{
      return 0;
  }
}

const getTodaysTotalReworkCount=(reqObj: any)=>{
    let existingDefectData = Realm.objects(ReworkedCountSchema.name)
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
        return existingDefectData.reduce((accumulator: number, item: any)=> accumulator + item.iReworkedCount, 0);
    }else{
        return 0;
    }
  }

const getCurrentLoggedInUserForToday=(dayString: string)=>{
    let currLoginData: RealmQuery = Realm.objects<LoggedIn_Session>(CurrentLoggedInUserSchema.name).filtered('dateTime = $0', dayString);
    currLoginData = convertToArray(currLoginData);
    return currLoginData[0];
}

const getAllDefects=()=>{
    let allDefects = Realm.objects<vwDefects>(DefectSchema.name);
    allDefects = convertToArray(allDefects);
    return allDefects;
}

const getCurrentHourExistingData=(reqObj: any, currentHour: vwTimeInfo, current_login: LoggedIn_Session)=>{
  let existingData: any = Realm.objects<QMS_ProductionCountHourly>(ProductionCountSchema.name)
          .filtered('dDateOfProduction = $0 && vProductionPlanId =$1 && vHourId = $2 && vUnitLineId = $3 && vDeviceId=$4', 
                      reqObj.dDate, 
                      reqObj.vProductionPlanId, 
                      currentHour.vHourId, 
                      current_login.unitLineId, 
                      current_login.deviceId);
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