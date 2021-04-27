import {
    ProductionCountSchema, 
    DefectCountSchema,
    RejectCountSchema,
    ReworkedCountSchema
} from '../schemas/realm-schema';
import { QMS_DefectCountDaily, QMS_ProductionCountHourly, QMS_RejectCountDaily, QMS_ReworkedCountDaily } from '../schemas/entities';
import Realm from "../schemas/realm";
import {post, syncDataRequest } from '../../utils/apiUtils';
import { convertToArray } from '../../utils/utilityFunctions';
import { __TRACK_DFCT_DATA, __TRACK_PROD_DATA, __TRACK_REJT_DATA, __TRACK_REWD_DATA } from '../../utils/constKVP';
const dateObj: Date = new Date();

const writeProductionToLocalDB = (dataToWrite: any) =>{
    
      Realm.write(() => { //write single data
        //Realm.create(ProductionCountSchema.name, updatedData);
        let existingData: any = Realm.objects<QMS_ProductionCountHourly>(ProductionCountSchema.name)
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
            Realm.create(ProductionCountSchema.name, dataToWrite);
          }else{
            existingData.iProductionQty =  dataToWrite.iProductionQty;
            existingData.dLastUpdated =  dateObj;
          }
      });

      /**Send Data to Server for persistance */
      post(__TRACK_PROD_DATA, dataToWrite)
      .then((response: any) => console.log(response.data)).catch(errorMessage => console.log('err prod count :',errorMessage));
      // Realm.close();
  }

const writeReworkedToLocalDB = (dataToWrite: any) =>{

    Realm.write(() => { //write single data
     //Realm.create(ProductionCountSchema.name, updatedData);
     let existingData: any = Realm.objects<QMS_ReworkedCountDaily>(ReworkedCountSchema.name)
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
         Realm.create(ReworkedCountSchema.name, dataToWrite);
       }else{
         existingData.iReworkedCount =  dataToWrite.iReworkedCount;
         existingData.dLastUpdated   =  dateObj;
       }                            
         
   });
   
      /**Send Data to Server for persistance */
     post(__TRACK_REWD_DATA, dataToWrite)
    .then((response: any) => console.log(response.data)).catch(errorMessage => console.log('err reworked count:',errorMessage));
   //Realm.close();
}

const writeRejectToLocalDB = (dataToWrite: any) =>{
    
    Realm.write(() => { //write single data
     //Realm.create(ProductionCountSchema.name, updatedData);
     let existingData: any = Realm.objects<QMS_RejectCountDaily>(RejectCountSchema.name)
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
         Realm.create(RejectCountSchema.name, dataToWrite);
       }else{
         existingData.iRejectCount +=  1;
         existingData.dLastUpdated   =  dateObj;

         dataToWrite.iRejectCount = existingData.iRejectCount;
         dataToWrite.dLastUpdated = existingData.dLastUpdated;
       }                            
         
   });
    console.log('reject Obj count',dataToWrite.iRejectCount);
    console.log('reject Obj updated',dataToWrite.dLastUpdated);
    //console.log(dataToWrite);
     /**Send Data to Server for persistance */
    post(__TRACK_REJT_DATA, dataToWrite)
    .then((response: any) => console.log(response.data)).catch(errorMessage => console.log('err:',errorMessage));
}

const writeDefectToLocalDB = (dataToWrite: any) =>{

    Realm.write(() => { //write single data

     let existingData: any = Realm.objects<QMS_DefectCountDaily>(DefectCountSchema.name)
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
         Realm.create(DefectCountSchema.name, dataToWrite);
       }else{
         existingData.iDefectCount +=  1;
         existingData.dLastUpdated   =  dateObj;

         dataToWrite.iDefectCount = existingData.iDefectCount;
         dataToWrite.dLastUpdated = existingData.dLastUpdated;
       }                            
         
   });
   /**Send Data to Server for persistance */
   post(__TRACK_DFCT_DATA, dataToWrite)
   .then((response: any) => console.log(response.data)).catch(errorMessage => console.log('err:',errorMessage));
}

const syncBulkData = async () =>{
  
    var prodData: any, defectData: any, rejectData: any, reworkData: any;

    prodData = Realm.objects(ProductionCountSchema.name);
    prodData = convertToArray(prodData);

    defectData = Realm.objects(DefectCountSchema.name);
    defectData = convertToArray(defectData);

    rejectData = Realm.objects(RejectCountSchema.name);
    rejectData = convertToArray(rejectData);

    reworkData = Realm.objects(ReworkedCountSchema.name);
    reworkData = convertToArray(reworkData);
    
    await syncDataRequest(prodData, defectData, rejectData, reworkData)
    .then((response: any) => console.log('\nsync response:',"\n"+response[0].data, "\n"+response[1].data, "\n"+response[2].data, "\n"+response[3].data)).catch(errorMessage => console.log('err prod count :',errorMessage));
  
}

  export {
      writeProductionToLocalDB, 
      writeReworkedToLocalDB,
      writeRejectToLocalDB,
      writeDefectToLocalDB,
      syncBulkData
    };
