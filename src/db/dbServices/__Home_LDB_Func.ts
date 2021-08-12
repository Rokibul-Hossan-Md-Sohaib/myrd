import Realm from "../schemas/realm";
import { 
    DefectSchema,
    DailyPlanSchema,
    DefectCountSchema, 
    ProductionCountSchema,
    RejectCountSchema,
    ReworkedCountSchema,
    CurrentLoggedInUserSchema, 
    QmsSecurityProductionDeviceInfo
 } from "../schemas/realm-schema";
import { 
    DailyProductionPlanSummery,
    LoggedIn_Session
 } from "../schemas/entities";
import moment from 'moment'
import {convertToArray} from '../../utils/utilityFunctions'
import { RealmQuery } from "../lib/realm-helper.types";

export function getCurrentLoggedInUserForToday(dayString: string) {
    let currLoginData: RealmQuery = Realm.objects<LoggedIn_Session>(CurrentLoggedInUserSchema.name).filtered('dLoginDateTime = $0', dayString);
    currLoginData = convertToArray(currLoginData);
    return currLoginData;
}

export function planDataExistsForToday(dayString: string): boolean{
    let planData: RealmQuery = Realm.objects<DailyProductionPlanSummery>(DailyPlanSchema.name).filtered('dDate = $0', dayString);
    if(planData.length > 0) return true;
    return false;
}

export function setDeviceAndDefectMasterDataLocalDB(deviceSecInfo: any[], defectRaw: any[]){
    Realm.write(() => {
        deviceSecInfo.forEach((obj: any) => {
            Realm.create(QmsSecurityProductionDeviceInfo.name, obj);
        });

        defectRaw.forEach((obj: any) => {
          Realm.create(DefectSchema.name, obj);
      });
        //realm.create('Car', {make: 'Honda', model: 'Accord', drive: 'awd'});
      });
}

export function clearStaleLocalDb() {
    //todays date  2021-04-03T00:00:00.000Z
    //let dateObj = new Date();
    let fullDate = moment().format().split("T")[0]+'T00:00:00.000Z'
  
     Realm.write(() => {
    
      let allDeviceInfo = Realm.objects(QmsSecurityProductionDeviceInfo.name);
      console.log('clear Device info', allDeviceInfo.length)
      Realm.delete(allDeviceInfo);
  
      let existingData = Realm.objects(ProductionCountSchema.name)
      .filtered('dDateOfProduction  != $0', fullDate);
      console.log('clear Previous Prod Data', existingData.length)
      Realm.delete(existingData);
  
      let existingDefectData = Realm.objects(DefectCountSchema.name)
      .filtered('dDateOfProduction  != $0', fullDate);
      console.log('clear Previous Defect Data', existingDefectData.length)
      Realm.delete(existingDefectData);
  
      let existingRejectData = Realm.objects(RejectCountSchema.name)
      .filtered('dDateOfProduction  != $0', fullDate);
      console.log('clear Previous Reject Data', existingRejectData.length)
      Realm.delete(existingRejectData);
  
      let existingReworkedData = Realm.objects(ReworkedCountSchema.name)
      .filtered('dDateOfProduction  != $0', fullDate);
      console.log('clear Previous Reworked Data', existingReworkedData.length)
      Realm.delete(existingReworkedData);
  
      let loginData = Realm.objects(CurrentLoggedInUserSchema.name)
      .filtered('dLoginDateTime != $0', fullDate);
      console.log('clear Previous login data', loginData.length)
      Realm.delete(loginData);
  
      let allDailyPlanSchema = Realm.objects(DailyPlanSchema.name)
      .filtered('dDate != $0', fullDate);
      console.log('clear Previous plan data', allDailyPlanSchema.length)
      Realm.delete(allDailyPlanSchema);
  
      let allDefects = Realm.objects(DefectSchema.name);
      console.log('clear Defects master data', allDefects.length)
      Realm.delete(allDefects);
  });
   
}

