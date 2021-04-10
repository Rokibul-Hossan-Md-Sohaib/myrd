const convertToArray = (realmObjectsArray: any) =>
{
  let copyOfJsonArray = Array.from(realmObjectsArray);
  let jsonArray = JSON.parse(JSON.stringify(copyOfJsonArray));
  return jsonArray;
}

function setupPickerData(dataArr: any, labelName: string, valueName: string, filterTxt: string, filterColumn: string){

  var depid = [];

  if(filterTxt && filterColumn){
    depid = dataArr.filter((x: any) => x[filterColumn] === filterTxt).map((obj: any) => ({[valueName]: obj[valueName], [labelName]: obj[labelName]}));
    //console.log(depid);
  }else{
    depid = dataArr.map((obj: any) => ({[valueName]: obj[valueName], [labelName]: obj[labelName]}));
  }
    //Filter Company string then map for Unit -> Line etc
  var DepResult = [], mapx = new Map();
      for (const item of depid) {
          if(!mapx.has(item[valueName])){
              mapx.set(item[valueName], true);    // set any value to Map mapx.has(depid[0]['vCompanyId']);
              DepResult.push({
                  value : item[valueName],
                  label : item[labelName]
              });
          }
      }
  return DepResult;
}

export {convertToArray, setupPickerData}