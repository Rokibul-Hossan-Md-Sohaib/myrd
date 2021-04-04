const CurrentLoggedInUserSchema = {
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

const QmsSecurityProductionDeviceInfo = {
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

      const CompanyWiseUnitLineSchema = {
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

const HourInfoSchema = {
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

const DailyPlanSchema = {
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

const DefectSchema ={
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

const DeviceWiseDefectSchema = {
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

const DeviceWiseProductionSchema = {
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

const DeviceWiseRejectSchema = {
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

const DeviceWiseReworkedSchema = {
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

  export {
    CompanyWiseUnitLineSchema, 
    DefectSchema, 
    HourInfoSchema, 
    DailyPlanSchema,
    DeviceWiseDefectSchema, 
    DeviceWiseProductionSchema,
    DeviceWiseRejectSchema,
    DeviceWiseReworkedSchema,
    CurrentLoggedInUserSchema, 
    QmsSecurityProductionDeviceInfo};