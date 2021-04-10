import Realm from "../schemas/realm";
import { 
    HourInfoSchema, 
    DailyPlanSchema,
    CurrentLoggedInUserSchema, 
    QmsSecurityProductionDeviceInfo
 } from "../schemas/realm-schema";
import { 
    QMS_SecurityProductionDeviceInfo
 } from "../schemas/entities";
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
