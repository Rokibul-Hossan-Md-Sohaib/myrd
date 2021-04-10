import Realm from "./realm";
import { 
    CompanyWiseUnitLineSchema, 
    DefectSchema, 
    HourInfoSchema, 
    DailyPlanSchema,
    DeviceWiseDefectSchema, 
    DeviceWiseProductionSchema,
    DeviceWiseRejectSchema,
    DeviceWiseReworkedSchema,
    CurrentLoggedInUserSchema, 
    QmsSecurityProductionDeviceInfo
 } from "./realm-schema";
import { current_login } from "./entities";

export function getCurrentLoggedInUserForToday(dayString: string) {
  return Realm.objects<current_login>(CurrentLoggedInUserSchema.name).filtered('dateTime = $0', dayString);
}

