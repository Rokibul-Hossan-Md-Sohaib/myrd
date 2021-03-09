import React, { Component } from 'react'
import { View, Text, StatusBar, Pressable } from 'react-native';
import {moderateScale} from 'react-native-size-matters'

class ProductionCountSizeWise extends Component {

    state={
      fttCount: 0,
      defectCount: 0,
      rejectCount: 0,
      rectifiedCount: 0,
      incrementBy: 1
    }

    countFtt(){
      this.setState((prevState, props) => ({
        fttCount: prevState.fttCount + 1
      }));
    }

    countDefect(){
      this.setState((prevState, props) => ({
        defectCount: prevState.defectCount + 1
      }), ()=>{
          console.log('count defect')
        // this.props.navigation.navigate('Details',{
        //   itemId: 86,
        //   otherParam: 'anything you want here',
        // })
      });
    }

    countrectified(){
      this.setState((prevState, props) => ({
        rectifiedCount: prevState.rectifiedCount + 1
      }));
    }

    countreject(){
      this.setState((prevState, props) => ({
        rejectCount: prevState.rejectCount + 1
      }));
    }

  render() {
    return (
      <View style={styles.container}>
      <StatusBar hidden={true}/>
    <View style={[{flex: 1, margin: moderateScale(10), flexDirection:'column'}, styles.elementsContainer]}>
      
      <View style={{flex: 4, marginBottom:moderateScale(10), flexDirection:'row'}}>

        <Pressable onPress={()=>this.countFtt()} style={{flex: 1,  backgroundColor: '#45c065', flexDirection:'row', justifyContent: 'space-evenly', alignItems:'center'}}>
          <Text style={{fontSize: moderateScale(25), fontWeight:'bold'}}>FTT</Text>
          <Text style={{fontSize: moderateScale(25), fontWeight:'bold', color: '#fff'}}>{this.state.fttCount}</Text>
        </Pressable >
        
        <Pressable onPress={()=>this.countDefect()} style={{flex: 1, marginLeft:moderateScale(10),  backgroundColor: '#fda912', flexDirection:'row', justifyContent: 'space-evenly', alignItems:'center'}}>
            <Text style={{fontSize: moderateScale(25), fontWeight:'bold'}}>DEFECT</Text>
            <Text style={{fontSize: moderateScale(25), fontWeight:'bold', color: '#fff'}}>{this.state.defectCount}</Text>
        </Pressable>

      </View>

      <View style={{flex: 3, flexDirection:'row'}}>
        
        <Pressable onPress={()=>this.countreject()} style={{flex: 1,  backgroundColor: '#ff5353', flexDirection:'row', justifyContent: 'space-evenly', alignItems:'center'}}>
        <Text style={{fontSize: moderateScale(25), fontWeight:'bold'}}>REJECT</Text>
        <Text style={{fontSize: moderateScale(25), fontWeight:'bold', color: '#fff'}}>{this.state.rejectCount}</Text>
        </Pressable>

        <Pressable onPress={()=>this.countrectified()} style={{flex: 1, marginLeft:moderateScale(10),   backgroundColor: '#3d9efd',  flexDirection:'row', justifyContent: 'space-evenly', alignItems:'center'}}>
        <Text style={{fontSize: moderateScale(25), fontWeight:'bold'}}>RECTIFIED</Text>
        <Text style={{fontSize: moderateScale(25), fontWeight:'bold', color: '#fff'}}>{this.state.rectifiedCount}</Text>
        </Pressable>

      </View>
    </View>
    
      {/* <Text>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => this.props.navigation.navigate('Details',{
          itemId: 86,
          otherParam: 'anything you want here',
        })}
        /> */}
  </View>
    )
  }
}

const styles = {
    container: {
      //marginTop: 48,
      flex: 1
    },
    headerStyle: {
      fontSize: 36,
      textAlign: 'center',
      fontWeight: '100',
      //marginBottom: 24
    },
    elementsContainer: {
      backgroundColor: '#ecf5fd',
      //margin: 5,
      //marginLeft: 24,
      //marginRight: 24,
      //marginBottom: 24
    },
    textStyle:{
      
    }
  
  }

export default ProductionCountSizeWise