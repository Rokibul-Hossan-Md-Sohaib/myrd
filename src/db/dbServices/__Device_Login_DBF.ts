import Realm from "../schemas/realm";
import { 
    HourInfoSchema, 
    DailyPlanSchema,
    CurrentLoggedInUserSchema, 
    QmsSecurityProductionDeviceInfo,
    ProductionCountSchema,
    DefectCountSchema,
    RejectCountSchema,
    ReworkedCountSchema
 } from "../schemas/realm-schema";
import { 
  QMS_DefectCountDaily,
  QMS_ProductionCountHourly,
  QMS_RejectCountDaily,
  QMS_ReworkedCountDaily,
  QMS_SecurityProductionDeviceInfo
 } from "../schemas/entities";
import moment from 'moment'
import {convertToArray} from '../../utils/utilityFunctions'
import { RealmQuery } from "../lib/realm-helper.types";

export function getQmsDeviceSecurityData(): any{

    let comInfo: RealmQuery = Realm.objects<QMS_SecurityProductionDeviceInfo>(QmsSecurityProductionDeviceInfo.name);
    comInfo = convertToArray(comInfo);
    return comInfo;
}

export function writeToLocalDb(dataToWrite: any[], timeHour: any[], current_login: any){
    console.log('write to DB')
    //Clear any existing data in local db
    clearLocalDb();
      //write plan data to local db
      //DailyPlanSchema.name
        Realm.write(() => {
            dataToWrite.forEach(obj => {
              Realm.create(DailyPlanSchema.name, obj);
          });

         timeHour.forEach(obj => {
              Realm.create(HourInfoSchema.name, obj);
          });

          Realm.create(CurrentLoggedInUserSchema.name, current_login)

        });
  }

export function rehydrateExistingdata(productionData: any[], defectData: any[], rejectData: any[], reworkedData:any[]){
  Realm.write(() => {

    productionData.forEach(obj => {

      let existingData: any = Realm.objects<QMS_ProductionCountHourly>(ProductionCountSchema.name)
                            .filtered('dDateOfProduction = $0 && vProductionPlanId =$1 && vHourId = $2 && vUnitLineId = $3 && vDeviceId=$4 && vStyleId=$5 && vSizeId=$6 && vExpPoorderNo=$7 && vColorId=$8 && vBuyerId=$9', 
                            obj.dDateOfProduction, 
                            obj.vProductionPlanId, 
                            obj.vHourId, 
                            obj.vUnitLineId, 
                            obj.vDeviceId,
                            obj.vStyleId,
                            obj.vSizeId,
                            obj.vExpPoorderNo,
                            obj.vColorId,
                            obj.vBuyerId)[0];

          if(existingData === undefined){
            //as no previous data exists, we will create new data row...
            Realm.create(ProductionCountSchema.name, obj);
          }else{
            /**Last updated time is greater & productionQty has changed */
            var isafter = moment(obj.dLastUpdated).isAfter(existingData.dLastUpdated);
            var greaterQty = obj.iProductionQty > existingData.iProductionQty;
            if(isafter || greaterQty){
              existingData.iProductionQty =  obj.iProductionQty;
              existingData.dLastUpdated =  obj.dLastUpdated;
            }
          }
  });

  defectData.forEach(obj => {
    let existingData: any = Realm.objects<QMS_DefectCountDaily>(DefectCountSchema.name)
                         .filtered('dDateOfProduction = $0 && vProductionPlanId =$1 && vUnitLineId = $2 && vDeviceId=$3 && vDefectCode=$4 && vStyleId=$5 && vSizeId=$6 && vExpPoorderNo=$7 && vColorId=$8 && vBuyerId=$9', 
                         obj.dDateOfProduction, 
                         obj.vProductionPlanId, 
                         obj.vUnitLineId, 
                         obj.vDeviceId,
                         obj.vDefectCode,
                         obj.vStyleId,
                         obj.vSizeId,
                         obj.vExpPoorderNo,
                         obj.vColorId,
                         obj.vBuyerId
                         )[0];

       if(existingData === undefined){
         //as no previous data exists, we will create new data row...
         Realm.create(DefectCountSchema.name, obj);
       }else{
        var isafter = moment(obj.dLastUpdated).isAfter(existingData.dLastUpdated);
        var greaterQty = obj.iDefectCount > existingData.iDefectCount;
          if(isafter || greaterQty){
            existingData.iDefectCount =  obj.iDefectCount;
            existingData.dLastUpdated =  obj.dLastUpdated;
          }
       }
  });

  rejectData.forEach(obj => {
    
    let existingData: any = Realm.objects<QMS_RejectCountDaily>(RejectCountSchema.name)
     .filtered('dDateOfProduction = $0 && vProductionPlanId =$1 && vUnitLineId = $2 && vDeviceId=$3 && vDefectCode=$4 && vStyleId=$5 && vSizeId=$6 && vExpPoorderNo=$7 && vColorId=$8 && vBuyerId=$9', 
                   obj.dDateOfProduction, 
                   obj.vProductionPlanId, 
                   obj.vUnitLineId, 
                   obj.vDeviceId,
                   obj.vDefectCode,
                   obj.vStyleId,
                   obj.vSizeId,
                   obj.vExpPoorderNo,
                   obj.vColorId,
                   obj.vBuyerId
                   )[0];
             
       if(existingData === undefined){
         //as no previous data exists, we will create new data row...
         Realm.create(RejectCountSchema.name, obj);
       }else{
        var isafter = moment(obj.dLastUpdated).isAfter(existingData.dLastUpdated);
        var greaterQty = obj.iRejectCount > existingData.iRejectCount;
          if(isafter || greaterQty){
            existingData.iRejectCount =  obj.iRejectCount;
            existingData.dLastUpdated =  obj.dLastUpdated;
          }
       }
  });

  reworkedData.forEach(obj => {

        let existingData: any = Realm.objects<QMS_ReworkedCountDaily>(ReworkedCountSchema.name)
        .filtered('dDateOfProduction = $0 && vProductionPlanId =$1 && vUnitLineId = $2 && vDeviceId=$3 && vStyleId=$4 && vSizeId=$5 && vExpPoorderNo=$6 && vColorId=$7 && vBuyerId=$8', 
        obj.dDateOfProduction, 
        obj.vProductionPlanId, 
        obj.vUnitLineId, 
        obj.vDeviceId,
        obj.vStyleId,
        obj.vSizeId,
        obj.vExpPoorderNo,
        obj.vColorId,
        obj.vBuyerId
        )[0];

    if(existingData === undefined){
    //as no previous data exists, we will create new data row...
      Realm.create(ReworkedCountSchema.name, obj);
    }else{
      var isafter = moment(obj.dLastUpdated).isAfter(existingData.dLastUpdated);
        var greaterQty = obj.iReworkedCount > existingData.iReworkedCount;
          if(isafter || greaterQty){
            existingData.iReworkedCount =  obj.iReworkedCount;
            existingData.dLastUpdated =  obj.dLastUpdated;
          }
    }   
      //Realm.create(ReworkedCountSchema.name, obj);
  });

});
}

function clearLocalDb(){
    console.log('clear DB')
     Realm.write(() => {
    // Delete multiple books by passing in a `Results`, `List`,
    // or JavaScript `Array`

    let allcCurrentLoginData = Realm.objects(CurrentLoggedInUserSchema.name);
     Realm.delete(allcCurrentLoginData);

    let allTimeData = Realm.objects(HourInfoSchema.name);
     Realm.delete(allTimeData);

     let allPlanData = Realm.objects(DailyPlanSchema.name);
     Realm.delete(allPlanData); // Deletes all plans
  });
   
}
