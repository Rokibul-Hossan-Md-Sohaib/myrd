import React, { Component } from 'react'
import { View, Text, StatusBar, Pressable, Dimensions, StyleSheet } from 'react-native';
import moment from 'moment'
import {moderateScale} from 'react-native-size-matters'
import Orientation from 'react-native-orientation';
class ProductionCountSizeWise extends Component {

    state={
      fttCount: 0,
      defectCount: 0,
      rejectCount: 0,
      rectifiedCount: 0,
      incrementBy: 1,
      screenWidth: null,
      screenHeight: null,
      currentProdObj:[],
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

    componentDidMount(){
      const reqObj = this.props.navigation.getParam('userData');
      this.setState({
        currentProdObj: reqObj
      });

      Orientation.lockToLandscapeRight();
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

    _onLayout(e) {
      console.log("Screen Orientation Changed...")
      this.setState({
        screenWidth: Dimensions.get('window').width,
        screenHeight: Dimensions.get('window').height
      })
  
    }


  render() {
    const {screenHeight, screenWidth} = this.state
    //style={[{flex: 1, margin: moderateScale(10), flexDirection:'column'}, styles.elementsContainer]}
    return (
      <View style={styles.container} >
        
      <StatusBar hidden={true}/>
        <View style={screenHeight > screenWidth ? styles.ContainerPortrait : styles.ContainerLandscape} onLayout={this._onLayout.bind(this)}>
          
          <View style={{flex:.65, flexDirection:'row', justifyContent:'space-evenly', borderWidth: 1, borderColor: 'green'}}>
            <View style={{flex:.1, justifyContent:'center', alignItems:'center'}}>
                {/* <Text>green</Text> */}
                <View style={{height: 20, width:20, backgroundColor:'green', borderRadius: 25 }} />
            </View>


          <View style={{flex: .8, flexDirection:'column', justifyContent:'space-around'}}>
            <View style={{flex:1, flexDirection:'row', justifyContent:'space-around', borderBottomColor:'green'}}>
                <Text numberOfLines={1} style={{flex:1, fontSize: moderateScale(11), fontWeight:'bold', textAlign:'center'}}>Buyer: {this.state.currentProdObj.vBuyerName}</Text>
                <Text numberOfLines={1} style={{flex:1, fontSize: moderateScale(11), fontWeight:'bold', textAlign:'center'}}>Style: {this.state.currentProdObj.vStyleName}</Text>
                <Text numberOfLines={1} style={{flex:1, fontSize: moderateScale(11), fontWeight:'bold', textAlign:'center'}}>ExPo: {this.state.currentProdObj.vExpPoorderNo}</Text>
            </View>
            <View style={{flex:1, flexDirection:'row', justifyContent:'space-around'}}>
                <Text numberOfLines={1} style={{flex:1, fontSize: moderateScale(11), fontWeight:'bold', textAlign:'center'}}>Color: {this.state.currentProdObj.vColorName}</Text>
                <Text numberOfLines={1} style={{flex:1, fontSize: moderateScale(11), fontWeight:'bold', textAlign:'center'}}>Size: {this.state.currentProdObj.vSizeName}</Text>
                <Text numberOfLines={1} style={{flex:1, fontSize: moderateScale(11), fontWeight:'bold', textAlign:'center'}}>Shipment: {moment(this.state.currentProdObj.dShipmentDate).format('DD-MM-YYYY')}</Text>
            </View>
          </View>

            
            <View style={{flex:.1, justifyContent:'center', alignItems:'center'}}>
              <Text>Right</Text>
            </View>
          </View>

          {/* <View style={{flex: 6, flexDirection: 'column'}}>

          </View> */}
          <View style={{flex: 3, marginBottom:moderateScale(10), flexDirection:'row'}}>

            <Pressable onPress={()=>this.countFtt()} style={{...styles.CountTileStyle, backgroundColor: '#45c065'}}>
              <Text style={{fontSize: moderateScale(25), fontWeight:'bold'}}>FTT</Text>
              <Text style={{fontSize: moderateScale(25), fontWeight:'bold', color: '#fff'}}>{this.state.fttCount}</Text>
            </Pressable >
            
            <Pressable onPress={()=>this.countDefect()} style={{...styles.CountTileStyle, marginLeft:moderateScale(10),  backgroundColor: '#fda912'}}>
                <Text style={{fontSize: moderateScale(25), fontWeight:'bold'}}>DEFECT</Text>
                <Text style={{fontSize: moderateScale(25), fontWeight:'bold', color: '#fff'}}>{this.state.defectCount}</Text>
            </Pressable>

          </View>

          <View style={{flex: 3, flexDirection:'row'}}>
            
            <Pressable onPress={()=>this.countreject()} style={{...styles.CountTileStyle, backgroundColor: '#ff5353'}}>
            <Text style={{fontSize: moderateScale(25), fontWeight:'bold'}}>REJECT</Text>
            <Text style={{fontSize: moderateScale(25), fontWeight:'bold', color: '#fff'}}>{this.state.rejectCount}</Text>
            </Pressable>

            <Pressable onPress={()=>this.countrectified()} style={{...styles.CountTileStyle, marginLeft:moderateScale(10),   backgroundColor: '#3d9efd'}}>
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

const styles = StyleSheet.create({
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
    CountTileStyle:{
      flex: 1,
      flexDirection:'row', 
      justifyContent: 'space-evenly', 
      alignItems:'center'
    },
    ContainerPortrait: {
      flex: 1,
      // flexDirection: 'column',
      // justifyContent: 'center',
      // alignItems: 'center'
    },
    ContainerLandscape: {
      flex: 1
      // flexDirection: 'row',
      // justifyContent: 'center',
      // alignItems: 'center'
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
  
  });

export default ProductionCountSizeWise