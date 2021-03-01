const DemoUserSchema = {
    name: 'user_details',
    properties: {
      user_id: { type: 'int?', default: 0 },
      user_name: 'string?',
      user_contact: 'string?',
      user_address: 'string?',
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
          dStartTimeOfEntry: 'date',
          dStartEntryTime: 'date',
          dEndTimeOfEntry: 'date',
          dEndEntryTime: 'date',
          nHour: 'string?',
          iChangeHour: 'string?',
          iOrderBy: 'string?',
          iSection: 'string?'
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
      vExpPOOrderNo: 'string?',
      vColorId: 'string?',
      vColorName: 'string?',
      vSizeId: 'string?',
      vSizeName: 'string?',
      StylePo: 'string?',
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
      fSmv: 'string?',
      iMo: 'int?',
      iHel: 'int?',
      iPlanHour: 'string?',
      iIsNew: 'int?',
      mCost: 'string?',
      vSetPackId: 'string?',
      vShiftId: 'string?',
      OrderReference: 'string?',
      OrderRefSewing: 'string?',
      ColorWiseOrderReference: 'string?'
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

  export {CompanyWiseUnitLineSchema, HourInfoSchema, DailyPlanSchema, DeviceWiseProductionSchema, DemoUserSchema};