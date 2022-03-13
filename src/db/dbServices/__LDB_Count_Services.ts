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

const writeProductionToLocalDB = async (dataToWrite: any): Promise<boolean> =>{

    console.log('production Obj',dataToWrite);
      var isApiOK: boolean = false;
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
            existingData.dLastUpdated =  new Date();
          }
      });

      /**Send Data to Server for persistance */
      await post(__TRACK_PROD_DATA, dataToWrite)
      .then((response: any) => {
        console.log(response.data);
        isApiOK = true;
      }).catch(errorMessage => {
        console.log('err prod count :',errorMessage);
        isApiOK = false;
      });
      // Realm.close();
      return Promise.resolve(isApiOK);
  }

const writeReworkedToLocalDB = async (dataToWrite: any): Promise<boolean> =>{
    var isApiOK: boolean = false;
    Realm.write(() => {
    //Realm.create(ProductionCountSchema.name, updatedData);
    let existingData: any = Realm.objects<QMS_ReworkedCountDaily>(ReworkedCountSchema.name)
      .filtered('dDateOfProduction = $0 && vProductionPlanId =$1 && vUnitLineId = $2 && vDeviceId=$3 && vStyleId=$4 && vSizeId=$5 && vExpPoorderNo=$6 && vColorId=$7 && vBuyerId=$8 && vHourId = $9',
        dataToWrite.dDateOfProduction,
        dataToWrite.vProductionPlanId,
        dataToWrite.vUnitLineId,
        dataToWrite.vDeviceId,
        dataToWrite.vStyleId,
        dataToWrite.vSizeId,
        dataToWrite.vExpPoorderNo,
        dataToWrite.vColorId,
        dataToWrite.vBuyerId,
        dataToWrite.vHourId
      )[0];

    if (existingData === undefined) {
      //as no previous data exists, we will create new data row...
      Realm.create(ReworkedCountSchema.name, dataToWrite);
    } else {
      existingData.iReworkedCount += dataToWrite.iReworkedCount;
      existingData.dLastUpdated = new Date();

      dataToWrite.iReworkedCount = existingData.iReworkedCount;
      dataToWrite.dLastUpdated = existingData.dLastUpdated;
    }

  });
   
      /**Send Data to Server for persistance */
     await post(__TRACK_REWD_DATA, dataToWrite)
    .then((response: any) => {
      console.log(response.data)
      isApiOK = true;
    })
    .catch(errorMessage => {
      console.log('err reworked count:',errorMessage);
      isApiOK = false;
    });
   //Realm.close();

   return Promise.resolve(isApiOK);
}

const writeRejectToLocalDB = async (dataToWrite: any): Promise<boolean> =>{
    var isApiOK: boolean = false;
    Realm.write(() => { //write single data
     //Realm.create(ProductionCountSchema.name, updatedData);
     let existingData: any = Realm.objects<QMS_RejectCountDaily>(RejectCountSchema.name)
     .filtered('dDateOfProduction = $0 && vProductionPlanId =$1 && vUnitLineId = $2 && vDeviceId=$3 && vDefectCode=$4 && vStyleId=$5 && vSizeId=$6 && vExpPoorderNo=$7 && vColorId=$8 && vBuyerId=$9 && vHourId = $10', 
                   dataToWrite.dDateOfProduction, 
                   dataToWrite.vProductionPlanId, 
                   dataToWrite.vUnitLineId, 
                   dataToWrite.vDeviceId,
                   dataToWrite.vDefectCode,
                   dataToWrite.vStyleId,
                   dataToWrite.vSizeId,
                   dataToWrite.vExpPoorderNo,
                   dataToWrite.vColorId,
                   dataToWrite.vBuyerId,
                   dataToWrite.vHourId
                   )[0];
             
       if(existingData === undefined){
         //as no previous data exists, we will create new data row...
         Realm.create(RejectCountSchema.name, dataToWrite);
       }else{
         existingData.iRejectCount +=  1;
         existingData.dLastUpdated   =  new Date();

         dataToWrite.iRejectCount = existingData.iRejectCount;
         dataToWrite.dLastUpdated = existingData.dLastUpdated;
       }                            
         
   });
    console.log('reject Obj count',dataToWrite.iRejectCount);
    console.log('reject Obj updated',dataToWrite.dLastUpdated);
    //console.log(dataToWrite);
     /**Send Data to Server for persistance */
    await post(__TRACK_REJT_DATA, dataToWrite)
    .then((response: any) => {
      console.log(response.data)
      isApiOK = true;
    })
    .catch(errorMessage => {
      console.log('err:',errorMessage);
      isApiOK = false;
    });

    return Promise.resolve(isApiOK);
}

const writeDefectToLocalDB = async (dataToWrite: any): Promise<boolean> =>{
    var isApiOK: boolean = false;
    Realm.write(() => { //write single data

     let existingData: any = Realm.objects<QMS_DefectCountDaily>(DefectCountSchema.name)
                         .filtered('dDateOfProduction = $0 && vProductionPlanId =$1 && vUnitLineId = $2 && vDeviceId=$3 && vDefectCode=$4 && vStyleId=$5 && vSizeId=$6 && vExpPoorderNo=$7 && vColorId=$8 && vBuyerId=$9 && vHourId = $10', 
                         dataToWrite.dDateOfProduction, 
                         dataToWrite.vProductionPlanId, 
                         dataToWrite.vUnitLineId, 
                         dataToWrite.vDeviceId,
                         dataToWrite.vDefectCode,
                         dataToWrite.vStyleId,
                         dataToWrite.vSizeId,
                         dataToWrite.vExpPoorderNo,
                         dataToWrite.vColorId,
                         dataToWrite.vBuyerId,
                         dataToWrite.vHourId
                         )[0];

       if(existingData === undefined){
         //as no previous data exists, we will create new data row...
         Realm.create(DefectCountSchema.name, dataToWrite);
       }else{
         /**Increment local db existing defect counter by 1**/
         existingData.iDefectCount +=  1;
         existingData.dLastUpdated   =  new Date();

         /**Get updated defect counter from local db existing data**/
         dataToWrite.iDefectCount = existingData.iDefectCount;
         dataToWrite.dLastUpdated = new Date();
       }                            
         
   });
   /**Send Data to Server for persistance */
   await post(__TRACK_DFCT_DATA, dataToWrite)
   .then((response: any) => {
     console.log(response.data);
     isApiOK = true;
    })
   .catch(errorMessage => {
     console.log('err:',errorMessage)
     isApiOK = false;
    });

    return Promise.resolve(isApiOK);
}

const syncBulkData = async (): Promise<boolean> =>{
    var isSuccessful: boolean = false;
    var prodData: any, defectData: any, rejectData: any, reworkData: any;

    prodData = Realm.objects(ProductionCountSchema.name);
    prodData = convertToArray(prodData);

    defectData = Realm.objects(DefectCountSchema.name);
    defectData = convertToArray(defectData);

    rejectData = Realm.objects(RejectCountSchema.name);
    rejectData = convertToArray(rejectData);

    reworkData = Realm.objects(ReworkedCountSchema.name);
    reworkData = convertToArray(reworkData);
    console.log(prodData.length, defectData.length, rejectData.length, reworkData.length);

    if(prodData.length == 0 && defectData.length == 0 && rejectData.length == 0 && reworkData.length == 0){
        console.log('No Data syncying required for as no previous data available')
        /**No Data syncying required for as no previous data available...**/
        isSuccessful = true;
    }else{
      await syncDataRequest(prodData, defectData, rejectData, reworkData)
      .then((response: any) =>{
          if(Array.isArray(response) && response.length == 4){
            isSuccessful = true;
            console.log('\nsync response:',"\n"+response[0].data, "\n"+response[1].data, "\n"+response[2].data, "\n"+response[3].data);
          }else{
            isSuccessful = false;
          }
         // console.log('bulksync came here...')
      })
      .catch(errorMessage => {
          isSuccessful = false;
          console.log('err prod count :',errorMessage)
      });
    }
    return Promise.resolve(isSuccessful);
}




//data read
const ReadFromRealm =  (dataToWrite: any): Promise<boolean> =>{

  console.log('production Obj',dataToWrite);
    var isApiOK: boolean = false;
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
                          dataToWrite.vBuyerId);


        if(existingData === undefined){
          //as no previous data exists, we will create new data row...
          Realm.create(ProductionCountSchema.name, dataToWrite);
        }else{
          existingData.iProductionQty =  dataToWrite.iProductionQty;
          existingData.dLastUpdated =  new Date();
        }
    });

    /**Send Data to Server for persistance */
    // await post(__TRACK_PROD_DATA, dataToWrite)
    // .then((response: any) => {
    //   console.log(response.data);
    //   isApiOK = true;
    // }).catch(errorMessage => {
    //   console.log('err prod count :',errorMessage);
    //   isApiOK = false;
    // });
    // Realm.close();
    return Promise.resolve(isApiOK);
}

const queryRead = () => new Promise ((resolve, reject) =>{
  let allRead = Realm.objects<QMS_ProductionCountHourly>(ProductionCountSchema.name)
  resolve(allRead)
})
  export {
      writeProductionToLocalDB, 
      writeReworkedToLocalDB,
      writeRejectToLocalDB,
      writeDefectToLocalDB,
      syncBulkData,
      ReadFromRealm,
      queryRead
    };
