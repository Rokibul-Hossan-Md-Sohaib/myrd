import {
    HourInfoSchema, 
    CurrentLoggedInUserSchema, 
    DeviceWiseProductionSchema, 
    DeviceWiseDefectSchema, 
    DefectSchema, 
    DeviceWiseRejectSchema,
    DeviceWiseReworkedSchema
  } from '../schemas/dbSchema'
import {convertToArray} from '../../utils/utilityFunctions'
import Realm from 'realm';
const realm: Realm = new Realm({ path: 'QmsDb.realm' }), dateObj: Date = new Date();

// const convertToArray = (realmObjectsArray: any) =>
// {
//   let copyOfJsonArray = Array.from(realmObjectsArray);
//   let jsonArray = JSON.parse(JSON.stringify(copyOfJsonArray));
//   return jsonArray;
// }

// const convertToArray = (realmObjectsArray: any) =>
// {
//     let copyOfJsonArray: any[], jsonArray: any;

//     Array.isArray(realmObjectsArray) ? copyOfJsonArray = Array.from(realmObjectsArray) :  copyOfJsonArray = realmObjectsArray;

//     if(copyOfJsonArray !== undefined && copyOfJsonArray.length >0 ){
//         jsonArray = JSON.parse(JSON.stringify(copyOfJsonArray));
//     }else{
//         jsonArray = undefined
//     }

//     return jsonArray;
// }

const  getCurrentHourId = (): any => {
    let currentHour: any = null;
    let timeNow: string = '1900-01-01T'+new Date().getHours()+':00:00';
    //console.log('timeNow',timeNow)
    let hourObj: any = realm.objects(HourInfoSchema.name)
    .filtered('dStartTimeOfProduction = $0', timeNow)[0];

    hourObj = convertToArray(hourObj)

    if(hourObj != undefined){        
      //Current Hour info available
      currentHour = hourObj;//["vHourId"];
    }else{
      //Current Hour info not available
      // So set current to 1 hour back
      timeNow = '1900-01-01T'+(dateObj.getHours()-1)+':00:00';
      hourObj = realm.objects(HourInfoSchema.name)
        .filtered('dStartTimeOfProduction = $0', timeNow)[0];
      hourObj = convertToArray(hourObj)

        if(hourObj != undefined){        
          currentHour = hourObj;
        }else{
          //Current Hour not found in 1 hour back
          // So set current to 2 hours back
          timeNow = '1900-01-01T'+(dateObj.getHours()-2)+':00:00';
          hourObj = realm.objects(HourInfoSchema.name)
            .filtered('dStartTimeOfProduction = $0', timeNow)[0];
          hourObj = convertToArray(hourObj)
            currentHour = hourObj;
        }
    }

    return currentHour;
  }

const getTodaysTotalFttCount = (reqObj: any) => {
    let existingData: any = realm.objects(DeviceWiseProductionSchema.name)
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
    let existingDefectData = realm.objects(DeviceWiseDefectSchema.name)
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
  let existingDefectData = realm.objects(DeviceWiseRejectSchema.name)
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
    let existingDefectData = realm.objects(DeviceWiseReworkedSchema.name)
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

  export {
    getCurrentHourId,
    getTodaysTotalFttCount,
    getTodaysTotalDefectCount,
    getUniqueAttributes,
    getTodaysTotalRejectCount,
    getTodaysTotalReworkCount
  }