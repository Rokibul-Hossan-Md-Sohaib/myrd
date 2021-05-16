import { Nullable } from '../lib/generic.types';

export type EntityName = "LoggedIn_Session" | 
                         "QMS_SecurityProductionDeviceInfo" | 
                         "Vw_CompanyWiseUnitLine" | 
                         "vwTimeInfo" | 
                         "DailyProductionPlanSummery" | 
                         "vwDefects" |
                         "QMS_DefectCountDaily" |
                         "QMS_RejectCountDaily" |
                         "QMS_ReworkedCountDaily" |
                         "QMS_ProductionCountHourly";

export type EntityNameOpt = "LoggedIn_Session?" | 
                            "QMS_SecurityProductionDeviceInfo?" | 
                            "Vw_CompanyWiseUnitLine?" | 
                            "vwTimeInfo?" | 
                            "DailyProductionPlanSummery?" | 
                            "vwDefects?" |
                            "QMS_DefectCountDaily?" |
                            "QMS_RejectCountDaily?" |
                            "QMS_ReworkedCountDaily?" |
                            "QMS_ProductionCountHourly?";

export interface LoggedIn_Session {
  readonly vDeviceId: Nullable<string>,
  readonly vDeviceSec: Nullable<string>,
  readonly vCompanyId: Nullable<string>,
  readonly vUnitId: Nullable<string>,
  readonly vUnitLineId: Nullable<string>,
  readonly vShiftId: Nullable<string>,
  readonly dLoginDateTime: Nullable<Date>
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

export interface QMS_DefectCountDaily {
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

export interface QMS_ProductionCountHourly {
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
   readonly iTotalPlanQty: Nullable<number>,
   readonly iTarget: Nullable<number>,
   readonly vProTypeId: Nullable<string>,
   readonly nHour: Nullable<number>,
   readonly iManPower: Nullable<number>,
   readonly vPreparedBy: Nullable<string>,
   readonly vShiftId: Nullable<string>
}

export interface QMS_RejectCountDaily {
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

export interface QMS_ReworkedCountDaily {
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