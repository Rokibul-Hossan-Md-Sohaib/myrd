const DemoUserSchema = {
    name: 'user_details',
    properties: {
      user_id: { type: 'int?', default: 0 },
      user_name: 'string?',
      user_contact: 'string?',
      user_address: 'string?',
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
        //primaryKey: 'vUnitLineId',
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
          dStartTimeOfEntry: 'date?',
          dStartEntryTime: 'string?',
          dEndTimeOfEntry: 'date?',
          dEndEntryTime: 'string?',
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

  const DeviceWiseProductionSchema = {
    name: 'QMS_DeviceWiseLineProductionDaily',
    primaryKey: 'iAutoId',
    properties:{
      iAutoId: 'int',
      vDeviceId: 'string?',
      dEntryDate: 'date',
      dLastUpdated: 'date',
      vProductionPlanId: 'string?',
      vUnitLineId: 'string?',
      vHourId: 'string?',
      dDateOfProduction: 'date',
      dStartTimeOfProduction: 'date',
      dEndTimeOfProduction: 'date',
      iProductionQty: 'int?',
      iTarget: 'string?',
      vProTypeId: 'string?',
      nHour: 'string?',
      iManPower: 'string?',
      vPreparedBy: 'string?',
      vShiftId: 'string?'
    },
  }

  export {CompanyWiseUnitLineSchema, HourInfoSchema, DailyPlanSchema, DeviceWiseProductionSchema, DemoUserSchema, QmsSecurityProductionDeviceInfo};