import Realm, { ObjectSchema } from "realm";

import {
  DefectSchema, 
  HourInfoSchema, 
  DailyPlanSchema,
  DefectCountSchema, 
  ProductionCountSchema,
  RejectCountSchema,
  ReworkedCountSchema,
  CurrentLoggedInUserSchema, 
  QmsSecurityProductionDeviceInfo
} from "./realm-schema";

const schema = [
  DefectSchema, 
  HourInfoSchema, 
  DailyPlanSchema,
  DefectCountSchema, 
  ProductionCountSchema,
  RejectCountSchema,
  ReworkedCountSchema,
  CurrentLoggedInUserSchema, 
  QmsSecurityProductionDeviceInfo
] as ObjectSchema[];

const realmConfig: Realm.Configuration = { 
  path: 'QmsDb.realm',
  schema
};

export default new Realm(realmConfig);
