import React, { Component, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View, FlatList, ViewBase } from "react-native";
import { ECharts } from "react-native-echarts-wrapper";
import { WebView } from 'react-native-webview';
import MyComponent from "./MyComponent";


const ProductionShow = () => {
  const [isLoading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  console.log(users.compUnitData);

  useEffect(() => {
    fetch('http://eots.kdsgroup.net:81/qmsapi/ApiData/GetProductionSummery?date=2022-03-06&vUnitLineId=UL57')
      .then((response) => response.json())
      .then((json) => setUsers(json))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  // const hours = [
  //   'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H9', 'H10'
  // ];
  // const days = [
  //   'FTT', 'Defect', 'Damage', 'Rework', 'Inspection'


  // ];
  // const data = [
  //   [0, 0, 5], [0, 1, 2], [0, 2, 3], [0, 3, 4], [0, 4, 5], [0, 5, 6], [0, 6, 7], [0, 7, 8], [0, 8, 9], [0, 9, 10],
  //   [1, 0, 1], [1, 1, 2], [1, 2, 3], [1, 3, 4], [1, 4, 5], [1, 5, 6], [1, 6, 7], [1, 7, 8], [1, 8, 9], [1, 9, 10],
  //   [2, 0, 1], [2, 1, 2], [2, 2, 3], [2, 3, 4], [2, 4, 5], [2, 5, 6], [2, 6, 7], [2, 7, 8], [2, 8, 9], [2, 9, 10]
  // ]
  //   .map(function (item) {
  //     return [item[1], item[0], item[2] || '-'];
  //   });

  // option = {
  //   tooltip: {
  //     position: 'top'
  //   },
  //   grid: {
  //     height: '50%',
  //     top: '10%'
  //   },
  //   xAxis: {
  //     type: 'category',
  //     data: hours,
  //     splitArea: {
  //       show: true
  //     }
  //   },
  //   yAxis: {
  //     type: 'category',
  //     data: days,
  //     splitArea: {
  //       show: true
  //     }
  //   },
  //   // visualMap: {
  //   //   min: 0,
  //   //   max: 10,
  //   //   calculable: true,
  //   //   orient: 'horizontal',
  //   //   left: 'center',
  //   //   bottom: '15%'
  //   // },
  //   series: [
  //     {
  //       name: 'Punch Card',
  //       type: 'heatmap',
  //       data: data,
  //       label: {
  //         show: true
  //       },
  //       emphasis: {
  //         itemStyle: {
  //           shadowBlur: 10,
  //           shadowColor: 'rgba(0, 0, 0, 0.5)'
  //         }
  //       }
  //     }
  //   ]
  // }
  return (
    <>
      {/* <View style={styles.chartContainer}>
        <ECharts
          option={option}
          backgroundColor="rgba(93, 169, 81, 0.3)"
        />
      </View> */}
      <View style={styles.header}>
        {isLoading ? <Text>Loading...</Text> :
          (<View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 14, color: 'green', textAlign: 'center', paddingBottom: 10 }}>Articles:</Text>
            <FlatList
              data={users}
              keyExtractor={({ id }, index) => id}
              renderItem={({ item }) => (
                // <Text>{item.id + '. ' + item.title}</Text>
                <Text>{item.dDateOfProduction + '. ' + item.vUnitLineId}</Text>
              )}
            />
          </View>
          )}

      </View>
      <MyComponent />
    </>


  );
}

const styles = StyleSheet.create({
  chartContainer: {
    flex: 1
  },

  header: {
    flex: 1,
    padding: 24,

  }
});

export default ProductionShow


