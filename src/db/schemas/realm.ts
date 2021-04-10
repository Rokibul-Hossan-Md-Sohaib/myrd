import Realm, { ObjectSchema } from "realm";

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

const schema = [
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
] as ObjectSchema[];

const realmConfig: Realm.Configuration = { 
  path: 'QmsDb.realm',
  schema
};

export default new Realm(realmConfig);
