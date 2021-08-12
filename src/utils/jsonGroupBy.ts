import moment from 'moment'
const groupByJsonKey = (jsn: any, key: any) => {

    return jsn.reduce(function(newArray: any, item: any) {
  
      //matching the provided key and pushing matched data rows to newArray, and value of provided key converted to uppercase
  
      (newArray[moment(item[key]).format('LLLL').toUpperCase().split(' ').splice(0,4).join(' ')] = newArray[moment(item[key]).format('LLLL').toUpperCase().split(' ').splice(0,4).join(' ')] || []).push(item);
  
      return newArray;
  
    }, {});
  
  };


const jsonGroupByFunc = (json: any, key: any)=>{

    const groupedByKey = groupByJsonKey(json, key)
    const groupKeys = Object.keys(groupedByKey)
    const result = groupKeys.map(x => ({"title": x, "data":groupedByKey[x]}));

    return result;
}

export {jsonGroupByFunc};