const DemoUserSchema = {
    name: 'user_details',
    properties: {
      user_id: { type: 'int', default: 0 },
      user_name: 'string',
      user_contact: 'string',
      user_address: 'string',
    },
  };

const CompanyWiseUnitLineSchema = {
        name: 'Vw_CompanyWiseUnitLine',
        primaryKey: 'vUnitLineID',
        properties:{
          vCompanyChildID: 'string',
          vUnitDescription: 'string',
          vShortCode: 'string',
          vUnitID: 'string',
          vUnitName: 'string',
          vUnitLineID: 'string',
          vLineID: 'string',
          vShiftID: 'string'
        },
      };

const HourInfoSchema = {
        name: 'vwTimeInfo',
        primaryKey: 'iAutoID',
        properties:{
          iAutoID: 'int',
          vUnitID: 'string',
          vHourID: 'string',
          dStartTimeOfProduction: 'date',
          dStartTime: 'string',
          dEndTimeOfProduction: 'date',
          dEndTime: 'string',
          dStartTimeOfEntry: 'date',
          dStartEntryTime: 'date',
          dEndTimeOfEntry: 'date',
          dEndEntryTime: 'date',
          nHour: 'string',
          iChangeHour: 'string',
          iOrderBy: 'string',
          iSection: 'string'
        },
      };

const DailyPlanSchema = {
    name: 'DailyProductionPlanSummery',
    properties: {
      iAutoId: 'int',
      dDate: 'date',
      dShipmentDate: 'date',
      vSewingDamageID: 'string',
      vDailyInspectionID: 'string',
      vDailyInspDetailsID: 'string',
      vUnitID: 'string',
      vUnitName: 'string',
      vLineID: 'string',
      vUnitLineID: 'string',
      vExpPOOrderNO: 'string',
      vColorID: 'string',
      vColorName: 'string',
      vSizeID: 'string',
      vSizeName: 'string',
      StylePO: 'string',
      iManpower: 'int',
      vStyleID: 'string',
      vStyleName: 'string',
      vBuyerID: 'string',
      vBuyerName: 'string',
      vShortName: 'string',
      vDailyForecastID: 'string',
      vUniqueForcastDetailsID: 'string',
      vProductionPlanID: 'string',
      iTotalPlanQty: 'int',
      iTarget: 'int',
      nForecast: 'int',
      fSMV: 'string',
      iMO: 'int',
      iHel: 'int',
      iPlanHour: 'string',
      iIsNew: 'int',
      mCost: 'string',
      vSetPackID: 'string',
      vShiftID: 'string',
      OrderReference: 'string',
      OrderRefSewing: 'string',
      ColorWiseOrderReference: 'string'
    }
  }

  const DeviceWiseProductionSchema = {
    name: 'QMS_DeviceWiseLineProductionDaily',
    primaryKey: 'iAutoID',
    properties:{
      iAutoID: 'int',
      vDeviceID: 'string',
      dEntryDate: 'date',
      dLastUpdated: 'date',
      vProductionPlanID: 'string',
      vUnitLineID: 'string',
      vHourID: 'string',
      dDateOfProduction: 'date',
      dStartTimeOfProduction: 'date',
      dEndTimeOfProduction: 'date',
      iProductionQty: 'int',
      iTarget: 'string',
      vProTypeID: 'string',
      nHour: 'string',
      iManPower: 'string',
      vPreparedBy: 'string',
      vShiftID: 'string'
    },
  }

  export {CompanyWiseUnitLineSchema, HourInfoSchema, DailyPlanSchema, DeviceWiseProductionSchema, DemoUserSchema};