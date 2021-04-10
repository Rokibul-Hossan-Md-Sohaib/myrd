import { Nullable } from '../lib/generic.types';

export type EntityName = "current_login" | 
                         "QMS_SecurityProductionDeviceInfo" | 
                         "Vw_CompanyWiseUnitLine" | 
                         "vwTimeInfo" | 
                         "DailyProductionPlanSummery" | 
                         "vwDefects" |
                         "QMS_DeviceWiseLineDefectDaily" |
                         "QMS_DeviceWiseLineRejectDaily" |
                         "QMS_DeviceWiseLineReworkedDaily" |
                         "QMS_DeviceWiseLineProductionDaily";

export type EntityNameOpt = "current_login?" | 
                            "QMS_SecurityProductionDeviceInfo?" | 
                            "Vw_CompanyWiseUnitLine?" | 
                            "vwTimeInfo?" | 
                            "DailyProductionPlanSummery?" | 
                            "vwDefects?" |
                            "QMS_DeviceWiseLineDefectDaily?" |
                            "QMS_DeviceWiseLineRejectDaily?" |
                            "QMS_DeviceWiseLineReworkedDaily?" |
                            "QMS_DeviceWiseLineProductionDaily?";

export interface current_login {
  readonly deviceId: Nullable<string>,
  readonly devicePwd: Nullable<string>,
  readonly companyId: Nullable<string>,
  readonly unitId: Nullable<string>,
  readonly unitLineId: Nullable<string>,
  readonly shiftId: Nullable<string>,
  readonly dateTime: Nullable<Date>
}

export interface QMS_SecurityProductionDeviceInfo {
  readonly iAutoId: Nullable<number>,
  readonly vDeviceId: Nullable<string>,
  readonly vCompanyId: Nullable<string>,
  readonly vCompanyName: Nullable<string>,
  readonly vShortCode: Nullable<string>,
  readonly vUnitId: Nullable<string>,
  readonly vUnitName: Nullable<string>,
  readonly vLineId: Nullable<string>,
  readonly vUnitLineId: Nullable<string>,
  readonly vShiftId: Nullable<string>,
  readonly bIsActive: Nullable<boolean>
}

export interface Vw_CompanyWiseUnitLine {
  readonly vUnitLineId: Nullable<string>,
  readonly vCompanyChildId: Nullable<string>,
  readonly vUnitDescription: Nullable<string>,
  readonly vShortCode: Nullable<string>,
  readonly vUnitId: Nullable<string>,
  readonly vUnitName: Nullable<string>,
  readonly vLineId: Nullable<string>,
  readonly vShiftId: Nullable<string>
}

export interface vwTimeInfo {
  readonly iAutoId: number,
  readonly vUnitId: Nullable<string>,
  readonly vHourId: Nullable<string>,
  readonly dStartTimeOfProduction: Date,
  readonly dStartTime: Nullable<string>,
  readonly dEndTimeOfProduction: Date,
  readonly dEndTime: Nullable<string>,
  readonly nHour: Nullable<number>,
  readonly iChangeHour: Nullable<number>,
  readonly iOrderBy: Nullable<number>,
  readonly iSection: Nullable<number>
}

export interface DailyProductionPlanSummery {
  readonly iAutoId: Nullable<number>,
  readonly dDate: Date,
  readonly dShipmentDate: Date,
  readonly vSewingDamageId: Nullable<string>,
  readonly vDailyInspectionId: Nullable<string>,
  readonly vDailyInspDetailsId: Nullable<string>,
  readonly vUnitId: Nullable<string>,
  readonly vUnitName: Nullable<string>,
  readonly vLineId: Nullable<string>,
  readonly vUnitLineId: Nullable<string>,
  readonly vExpPoorderNo: Nullable<string>,
  readonly vColorId: Nullable<string>,
  readonly vColorName: Nullable<string>,
  readonly vSizeId: Nullable<string>,
  readonly vSizeName: Nullable<string>,
  readonly stylePo: Nullable<string>,
  readonly iManpower: Nullable<number>,
  readonly vStyleId: Nullable<string>,
  readonly vStyleName: Nullable<string>,
  readonly vBuyerId: Nullable<string>,
  readonly vBuyerName: Nullable<string>,
  readonly vShortName: Nullable<string>,
  readonly vDailyForecastId: Nullable<string>,
  readonly vUniqueForcastDetailsId: Nullable<string>,
  readonly vProductionPlanId: Nullable<string>,
  readonly iTotalPlanQty: Nullable<number>,
  readonly iTarget: Nullable<number>,
  readonly nForecast: Nullable<number>,
  readonly fSmv: Nullable<number>,
  readonly iMo: Nullable<number>,
  readonly iHel: Nullable<number>,
  readonly iPlanHour: Nullable<number>,
  readonly iIsNew: Nullable<number>,
  readonly mCost: Nullable<number>,
  readonly vSetPackId: Nullable<string>,
  readonly vShiftId: Nullable<string>,
  readonly orderReference: Nullable<string>,
  readonly orderRefSewing: Nullable<string>,
  readonly colorWiseOrderReference: Nullable<string>
}

export interface vwDefects {
  readonly vHeadId: Nullable<string>,
  readonly vAutoId: Nullable<string>,
  readonly vHeadName: Nullable<string>,
  readonly vHeadShortName: Nullable<string>,
  readonly vDefectCategoryId: Nullable<string>,
  readonly vDefectCategoryName: Nullable<string>,
  readonly vCategoryShortName: Nullable<string>,
  readonly code: Nullable<string>
}

export interface QMS_DeviceWiseLineDefectDaily {
    readonly iAutoId:  number,
    readonly vDeviceId: Nullable<string>,
    readonly dDateOfProduction: Date,
    readonly vProductionPlanId: Nullable<string>,
    readonly vUnitLineId: Nullable<string>,
    readonly vBuyerId: Nullable<string>,
    readonly vBuyerName: Nullable<string>,
    readonly vStyleId: Nullable<string>,
    readonly vStyleName: Nullable<string>,
    readonly vExpPoorderNo: Nullable<string>,
    readonly vColorId: Nullable<string>,
    readonly vColorName: Nullable<string>,
    readonly vSizeId: Nullable<string>,
    readonly vSizeName: Nullable<string>,
    readonly vDefectCategoryId: Nullable<string>,
    readonly vDefectCategoryName: Nullable<string>,
    readonly vDefectHeadId: Nullable<string>,
    readonly vDefectHeadName: Nullable<string>,
    readonly vDefectCode: Nullable<string>,
    readonly iDefectCount: number,
    readonly dLastUpdated: Date,
}

export interface QMS_DeviceWiseLineProductionDaily {
   readonly iAutoId: number,
   readonly vDeviceId: Nullable<string>,
   readonly dEntryDate: Date,
   readonly dLastUpdated: Date,
   readonly vProductionPlanId: Nullable<string>,
   readonly vUnitLineId: Nullable<string>,

   readonly vBuyerId: Nullable<string>,
   readonly vBuyerName: Nullable<string>,

   readonly vStyleId: Nullable<string>,
   readonly vStyleName: Nullable<string>,

   readonly vExpPoorderNo: Nullable<string>,

   readonly vColorId: Nullable<string>,
   readonly vColorName: Nullable<string>,

   readonly vSizeId: Nullable<string>,
   readonly vSizeName: Nullable<string>,

   readonly vHourId: Nullable<string>,
   readonly dDateOfProduction: Date,
   readonly dStartTimeOfProduction: Date,
   readonly dEndTimeOfProduction: Date,
   readonly dShipmentDate: Date,
   readonly iProductionQty: Nullable<number>,
   readonly iTarget: Nullable<number>,
   readonly vProTypeId: Nullable<string>,
   readonly nHour: Nullable<number>,
   readonly iManPower: Nullable<number>,
   readonly vPreparedBy: Nullable<string>,
   readonly vShiftId: Nullable<string>
}

export interface QMS_DeviceWiseLineRejectDaily {
   readonly iAutoId:  number,
   readonly vDeviceId: Nullable<string>,
   readonly dDateOfProduction: Date,
   readonly vProductionPlanId: Nullable<string>,
   readonly vUnitLineId: Nullable<string>,

   readonly vBuyerId: Nullable<string>,
   readonly vBuyerName: Nullable<string>,

   readonly vStyleId: Nullable<string>,
   readonly vStyleName: Nullable<string>,

   readonly vExpPoorderNo: Nullable<string>,

   readonly vColorId: Nullable<string>,
   readonly vColorName: Nullable<string>,

   readonly vSizeId: Nullable<string>,
   readonly vSizeName: Nullable<string>,


   readonly vDefectCategoryId: Nullable<string>,
   readonly vDefectCategoryName: Nullable<string>,
   readonly vDefectHeadId: Nullable<string>,
   readonly vDefectHeadName: Nullable<string>,
   readonly vDefectCode: Nullable<string>,
   readonly iRejectCount: number,
   readonly dLastUpdated: Date,
}

export interface QMS_DeviceWiseLineReworkedDaily {
  readonly iAutoId:  number,
  readonly vDeviceId: Nullable<string>,
  readonly dDateOfProduction: Date,
  readonly vProductionPlanId: Nullable<string>,
  readonly vUnitLineId: Nullable<string>,

  readonly vBuyerId: Nullable<string>,
  readonly vBuyerName: Nullable<string>,

  readonly vStyleId: Nullable<string>,
  readonly vStyleName: Nullable<string>,

  readonly vExpPoorderNo: Nullable<string>,

  readonly vColorId: Nullable<string>,
  readonly vColorName: Nullable<string>,

  readonly vSizeId: Nullable<string>,
  readonly vSizeName: Nullable<string>,

  readonly iReworkedCount: number,
  readonly dLastUpdated: Date,
}