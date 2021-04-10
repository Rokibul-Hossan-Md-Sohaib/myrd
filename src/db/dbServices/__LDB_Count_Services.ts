import {
    HourInfoSchema, 
    CurrentLoggedInUserSchema, 
    DeviceWiseProductionSchema, 
    DeviceWiseDefectSchema, 
    DefectSchema, 
    DeviceWiseRejectSchema,
    DeviceWiseReworkedSchema
  } from '../schemas/dbSchema'
import Realm from 'realm';
const realm: Realm = new Realm({ path: 'QmsDb.realm' }), dateObj: Date = new Date();

const writeProductionToLocalDB = (dataToWrite: any) =>{
    console.log('write to DB')

    // const realm = new Realm({
    //   path: 'QmsDb.realm',
    //   schema: [DeviceWiseProductionSchema],
    // });
    
      realm.write(() => { //write single data
        //realm.create(DeviceWiseProductionSchema.name, updatedData);
        let existingData: any = realm.objects(DeviceWiseProductionSchema.name)
                            .filtered('dDateOfProduction = $0 && vProductionPlanId =$1 && vHourId = $2 && vUnitLineId = $3 && vDeviceId=$4 && vStyleId=$5 && vSizeId=$6 && vExpPoorderNo=$7 && vColorId=$8 && vBuyerId=$9', 
                            dataToWrite.dDateOfProduction, 
                            dataToWrite.vProductionPlanId, 
                            dataToWrite.vHourId, 
                            dataToWrite.vUnitLineId, 
                            dataToWrite.vDeviceId,
                            dataToWrite.vStyleId,
                            dataToWrite.vSizeId,
                            dataToWrite.vExpPoorderNo,
                            dataToWrite.vColorId,
                            dataToWrite.vBuyerId)[0];


          if(existingData === undefined){
            //as no previous data exists, we will create new data row...
            realm.create(DeviceWiseProductionSchema.name, dataToWrite);
          }else{
            existingData.iProductionQty =  dataToWrite.iProductionQty;
            existingData.dLastUpdated =  dateObj;
          }
      });

      // realm.close();
  }

const writeReworkedToLocalDB = (dataToWrite: any) =>{
    /***TODO: Check Esisting Data, if exists Update, otherwise add new entry */
    /**Show total defect count on screen Tile */
    /** defect count should be at size level... */

    // const realm = new Realm({
    //   path: 'QmsDb.realm',
    //   schema: [DeviceWiseReworkedSchema],
    // });

    realm.write(() => { //write single data
     //realm.create(DeviceWiseProductionSchema.name, updatedData);
     let existingData: any = realm.objects(DeviceWiseReworkedSchema.name)
                         .filtered('dDateOfProduction = $0 && vProductionPlanId =$1 && vUnitLineId = $2 && vDeviceId=$3 && vStyleId=$4 && vSizeId=$5 && vExpPoorderNo=$6 && vColorId=$7 && vBuyerId=$8', 
                         dataToWrite.dDateOfProduction, 
                         dataToWrite.vProductionPlanId, 
                         dataToWrite.vUnitLineId, 
                         dataToWrite.vDeviceId,
                         dataToWrite.vStyleId,
                         dataToWrite.vSizeId,
                         dataToWrite.vExpPoorderNo,
                         dataToWrite.vColorId,
                         dataToWrite.vBuyerId
                         )[0];

       if(existingData === undefined){
         //as no previous data exists, we will create new data row...
         realm.create(DeviceWiseReworkedSchema.name, dataToWrite);
       }else{
         existingData.iReworkedCount =  dataToWrite.iReworkedCount;
         existingData.dLastUpdated   =  dateObj;
       }                            
         
   });
    
   //realm.close();
}

const writeRejectToLocalDB = (dataToWrite: any) =>{
    /***TODO: Check Esisting Data, if exists Update, otherwise add new entry */
    /**Show total defect count on screen Tile */
    /** defect count should be at size level... */
    realm.write(() => { //write single data
     //realm.create(DeviceWiseProductionSchema.name, updatedData);
     let existingData: any = realm.objects(DeviceWiseRejectSchema.name)
     .filtered('dDateOfProduction = $0 && vProductionPlanId =$1 && vUnitLineId = $2 && vDeviceId=$3 && vDefectCode=$4 && vStyleId=$5 && vSizeId=$6 && vExpPoorderNo=$7 && vColorId=$8 && vBuyerId=$9', 
                   dataToWrite.dDateOfProduction, 
                   dataToWrite.vProductionPlanId, 
                   dataToWrite.vUnitLineId, 
                   dataToWrite.vDeviceId,
                   dataToWrite.vDefectCode,
                   dataToWrite.vStyleId,
                   dataToWrite.vSizeId,
                   dataToWrite.vExpPoorderNo,
                   dataToWrite.vColorId,
                   dataToWrite.vBuyerId
                   )[0];
             
       if(existingData === undefined){
         //as no previous data exists, we will create new data row...
         realm.create(DeviceWiseRejectSchema.name, dataToWrite);
       }else{
         existingData.iRejectCount +=  1;
         existingData.dLastUpdated   =  dateObj;
       }                            
         
   });
    //console.log(dataToWrite);
}

const writeDefectToLocalDB = (dataToWrite: any) =>{
    /***TODO: Check Esisting Data, if exists Update, otherwise add new entry */
    /**Show total defect count on screen Tile */
    /** defect count should be at size level... */
    realm.write(() => { //write single data
     //realm.create(DeviceWiseProductionSchema.name, updatedData);
     let existingData: any = realm.objects(DeviceWiseDefectSchema.name)
                         .filtered('dDateOfProduction = $0 && vProductionPlanId =$1 && vUnitLineId = $2 && vDeviceId=$3 && vDefectCode=$4 && vStyleId=$5 && vSizeId=$6 && vExpPoorderNo=$7 && vColorId=$8 && vBuyerId=$9', 
                         dataToWrite.dDateOfProduction, 
                         dataToWrite.vProductionPlanId, 
                         dataToWrite.vUnitLineId, 
                         dataToWrite.vDeviceId,
                         dataToWrite.vDefectCode,
                         dataToWrite.vStyleId,
                         dataToWrite.vSizeId,
                         dataToWrite.vExpPoorderNo,
                         dataToWrite.vColorId,
                         dataToWrite.vBuyerId
                         )[0];

       if(existingData === undefined){
         //as no previous data exists, we will create new data row...
         realm.create(DeviceWiseDefectSchema.name, dataToWrite);
       }else{
         existingData.iDefectCount +=  1;
         existingData.dLastUpdated   =  dateObj;
       }                            
         
   });
    //console.log(dataToWrite);
}

  export {
      writeProductionToLocalDB, 
      writeReworkedToLocalDB,
      writeRejectToLocalDB,
      writeDefectToLocalDB
    };
