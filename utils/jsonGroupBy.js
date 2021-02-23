import moment from 'moment'
const groupByJsonKey = (jsn, key) => {

    return jsn.reduce(function(newArray, item) {
  
      //matching the provided key and pushing matched data rows to newArray, and value of provided key converted to uppercase
  
      (newArray[moment(item[key]).format('LLLL').toUpperCase().split(' ').splice(0,4).join(' ')] = newArray[moment(item[key]).format('LLLL').toUpperCase().split(' ').splice(0,4).join(' ')] || []).push(item);
  
      return newArray;
  
    }, {});
  
  };


const jsonGroupByFunc = (json, key)=>{

    const groupedByKey = groupByJsonKey(json, key)
    const groupKeys = Object.keys(groupedByKey)
    const result = groupKeys.map(x => ({"title": x, "data":groupedByKey[x]}));

    return result;
}

export {jsonGroupByFunc};