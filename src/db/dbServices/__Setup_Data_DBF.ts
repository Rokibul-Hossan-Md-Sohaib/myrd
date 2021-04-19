import Realm from "../schemas/realm";
import { 
    DailyPlanSchema,
    CurrentLoggedInUserSchema
 } from "../schemas/realm-schema";
 import moment from 'moment'
import { 
    DailyProductionPlanSummery
 } from "../schemas/entities";
import {convertToArray} from '../../utils/utilityFunctions'
import { RealmQuery } from "../lib/realm-helper.types";


export function getAllDailyProductionPlanSummery(): any{

    let dailyProdPlan: RealmQuery = Realm.objects<DailyProductionPlanSummery>(DailyPlanSchema.name);
    dailyProdPlan = convertToArray(dailyProdPlan);
    return dailyProdPlan;
}


export function writeToLocalDb(dataToWrite: any[]){
    console.log('write to DB')
    //Clear any existing data in local db
        clearLocalDb();
      //write plan data to local db
      //DailyPlanSchema.name
        Realm.write(() => {
            dataToWrite.forEach(obj => {
              Realm.create(DailyPlanSchema.name, obj);
          });
        });
  }

export function loggedOutAndAbleToGoToLoginPage(): boolean{
    let fullDate: string = moment().format().split("T")[0]+'T00:00:00.000Z'
    /**Assuming that previous data already exists... */
    Realm.write(() => {
      let allDeviceInfo: any = Realm.objects(DailyPlanSchema.name).filtered('dDate = $0', fullDate);
      //console.log(allDeviceInfo.length)
      Realm.delete(allDeviceInfo);
  
      let loginData = Realm.objects(CurrentLoggedInUserSchema.name)
      .filtered('dLoginDateTime = $0', fullDate);
      //console.log(allDeviceInfo.length)
      Realm.delete(loginData);
  });

    let loggedinData = Realm.objects(CurrentLoggedInUserSchema.name)
    .filtered('dLoginDateTime = $0', fullDate);

    let prevPlanData = Realm.objects(DailyPlanSchema.name)
    .filtered('dDate = $0', fullDate);

    if(loggedinData.length == 0 && prevPlanData.length == 0){
     // console.log('logged out')
      return true;
      //  this.props.navigation.navigate('DeviceLogin')
    }else{
      //console.log("logout failed!")
      return false
    }
}

  function clearLocalDb(){
    console.log('clear DB')
     Realm.write(() => {
    // Delete multiple books by passing in a `Results`, `List`,
    // or JavaScript `Array`
     let allPlanData = Realm.objects(DailyPlanSchema.name);
     Realm.delete(allPlanData); // Deletes all plans
  });
   
}