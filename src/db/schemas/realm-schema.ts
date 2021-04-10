import { RealmSchema } from '../lib/realm-schema.types';
import { EntityName, EntityNameOpt, 
         DailyProductionPlanSummery, 
         QMS_DeviceWiseLineDefectDaily, 
         QMS_DeviceWiseLineProductionDaily,
         QMS_DeviceWiseLineRejectDaily,
         QMS_DeviceWiseLineReworkedDaily,
         QMS_SecurityProductionDeviceInfo,
         Vw_CompanyWiseUnitLine,
         current_login,
         vwDefects,
         vwTimeInfo
        } from './entities';

interface Schema<TEntity extends object> extends RealmSchema<TEntity, EntityName, EntityName | EntityNameOpt> {};   

export const CurrentLoggedInUserSchema: Schema<current_login>  = {
  name: 'current_login',
  properties: {
    deviceId: 'string?',
    devicePwd: 'string?',
    companyId: 'string?',
    unitId: 'string?',
    unitLineId: 'string?',
    shiftId: 'string?',
    dateTime: 'date?'
  },
};

export const QmsSecurityProductionDeviceInfo: Schema<QMS_SecurityProductionDeviceInfo> = {
      name: 'QMS_SecurityProductionDeviceInfo',
      properties:{
        iAutoId: 'int?',
        vDeviceId: 'string?',
        vCompanyId: 'string?',
        vCompanyName: 'string?',
        vShortCode: 'string?',
        vUnitId: 'string?',
        vUnitName: 'string?',
        vLineId: 'string?',
        vUnitLineId: 'string?',
        vShiftId: 'string?',
        bIsActive: 'bool?'
      },
    };

export const CompanyWiseUnitLineSchema: Schema<Vw_CompanyWiseUnitLine> = {
      name: 'Vw_CompanyWiseUnitLine',
      properties:{
        vUnitLineId: 'string?',
        vCompanyChildId: 'string?',
        vUnitDescription: 'string?',
        vShortCode: 'string?',
        vUnitId: 'string?',
        vUnitName: 'string?',
        vLineId: 'string?',
        vShiftId: 'string?'
      },
    };

export const HourInfoSchema: Schema<vwTimeInfo> = {
      name: 'vwTimeInfo',
      primaryKey: 'iAutoId',
      properties:{
        iAutoId: 'int',
        vUnitId: 'string?',
        vHourId: 'string?',
        dStartTimeOfProduction: 'date',
        dStartTime: 'string?',
        dEndTimeOfProduction: 'date',
        dEndTime: 'string?',
        nHour: 'int?',
        iChangeHour: 'int?',
        iOrderBy: 'int?',
        iSection: 'int?'
      },
    };

export const DailyPlanSchema: Schema<DailyProductionPlanSummery> = {
  name: 'DailyProductionPlanSummery',
  properties: {
    iAutoId: 'int?',
    dDate: 'date',
    dShipmentDate: 'date',
    vSewingDamageId: 'string?',
    vDailyInspectionId: 'string?',
    vDailyInspDetailsId: 'string?',
    vUnitId: 'string?',
    vUnitName: 'string?',
    vLineId: 'string?',
    vUnitLineId: 'string?',
    vExpPoorderNo: 'string?',
    vColorId: 'string?',
    vColorName: 'string?',
    vSizeId: 'string?',
    vSizeName: 'string?',
    stylePo: 'string?',
    iManpower: 'int?',
    vStyleId: 'string?',
    vStyleName: 'string?',
    vBuyerId: 'string?',
    vBuyerName: 'string?',
    vShortName: 'string?',
    vDailyForecastId: 'string?',
    vUniqueForcastDetailsId: 'string?',
    vProductionPlanId: 'string?',
    iTotalPlanQty: 'int?',
    iTarget: 'int?',
    nForecast: 'int?',
    fSmv: 'double?',
    iMo: 'int?',
    iHel: 'int?',
    iPlanHour: 'int?',
    iIsNew: 'int?',
    mCost: 'double?',
    vSetPackId: 'string?',
    vShiftId: 'string?',
    orderReference: 'string?',
    orderRefSewing: 'string?',
    colorWiseOrderReference: 'string?'
  }
}

export const DefectSchema: Schema<vwDefects> ={
  name: 'vwDefects',
  properties:{
    vHeadId: 'string?',
    vAutoId: 'string?',
    vHeadName: 'string?',
    vHeadShortName: 'string?',
    vDefectCategoryId: 'string?',
    vDefectCategoryName: 'string?',
    vCategoryShortName: 'string?',
    code: 'string?'
}
}

export const DeviceWiseDefectSchema: Schema<QMS_DeviceWiseLineDefectDaily> = {
  name: 'QMS_DeviceWiseLineDefectDaily',
  properties:{
    iAutoId:  'int',
    vDeviceId: 'string?',
    dDateOfProduction: 'date',
    vProductionPlanId: 'string?',
    vUnitLineId: 'string?',

    vBuyerId:  'string?',
    vBuyerName: 'string?',

    vStyleId:  'string?',
    vStyleName: 'string?',

    vExpPoorderNo:  'string?',

    vColorId:  'string?',
    vColorName: 'string?',

    vSizeId:  'string?',
    vSizeName: 'string?',

    vDefectCategoryId: 'string?',
    vDefectCategoryName: 'string?',
    vDefectHeadId: 'string?',
    vDefectHeadName: 'string?',
    vDefectCode: 'string?',

    iDefectCount:  'int',
    
    dLastUpdated: 'date',
}
}

export const DeviceWiseProductionSchema: Schema<QMS_DeviceWiseLineProductionDaily> = {
  name: 'QMS_DeviceWiseLineProductionDaily',
  properties:{
    iAutoId: 'int',
    vDeviceId: 'string?',
    dEntryDate: 'date',
    dLastUpdated: 'date',
    vProductionPlanId: 'string?',
    vUnitLineId: 'string?',
    
    vBuyerId:  'string?',
    vBuyerName: 'string?',

    vStyleId:  'string?',
    vStyleName: 'string?',

    vExpPoorderNo:  'string?',

    vColorId:  'string?',
    vColorName: 'string?',

    vSizeId:  'string?',
    vSizeName: 'string?',

    vHourId: 'string?',
    dDateOfProduction: 'date',
    dStartTimeOfProduction: 'date',
    dEndTimeOfProduction: 'date',
    dShipmentDate: 'date',
    iProductionQty: 'int?',
    iTarget: 'int?',
    vProTypeId: 'string?',
    nHour: 'int?',
    iManPower: 'int?',
    vPreparedBy: 'string?',
    vShiftId: 'string?'
  },
}

export const DeviceWiseRejectSchema: Schema<QMS_DeviceWiseLineRejectDaily> = {
  name: 'QMS_DeviceWiseLineRejectDaily',
  properties:{
    iAutoId:  'int',
    vDeviceId: 'string?',
    dDateOfProduction: 'date',
    vProductionPlanId: 'string?',
    vUnitLineId: 'string?',

    vBuyerId:  'string?',
    vBuyerName: 'string?',

    vStyleId:  'string?',
    vStyleName: 'string?',

    vExpPoorderNo:  'string?',

    vColorId:  'string?',
    vColorName: 'string?',

    vSizeId:  'string?',
    vSizeName: 'string?',


    vDefectCategoryId: 'string?',
    vDefectCategoryName: 'string?',
    vDefectHeadId: 'string?',
    vDefectHeadName: 'string?',
    vDefectCode: 'string?',
    iRejectCount:  'int',
    dLastUpdated: 'date',
}
}

export const DeviceWiseReworkedSchema: Schema<QMS_DeviceWiseLineReworkedDaily> = {
  name: 'QMS_DeviceWiseLineReworkedDaily',
  properties:{
    iAutoId:  'int',
    vDeviceId: 'string?',
    dDateOfProduction: 'date',
    vProductionPlanId: 'string?',
    vUnitLineId: 'string?',

    vBuyerId:  'string?',
    vBuyerName: 'string?',

    vStyleId:  'string?',
    vStyleName: 'string?',

    vExpPoorderNo:  'string?',

    vColorId:  'string?',
    vColorName: 'string?',

    vSizeId:  'string?',
    vSizeName: 'string?',

    iReworkedCount:  'int',
    dLastUpdated: 'date',
}
}








