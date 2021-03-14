import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'

export class MultipleSizeCount extends Component {

    state={
        allSizes:[]
    }


    componentDidMount(){
        const reqObj = this.props.navigation.getParam('userData');
        this.setState({allSizes: reqObj}, ()=>{
                console.log('req sizes', this.state.allSizes.length);
        });
    }

    render() {
        return (
            <View style={styles.container}>
                {/* <Text> Multiple Size Production Count. </Text> */}
                {
                    this.state.allSizes.map((x, i)=> 
                    (<View key={i}>
                        <Text
                        numberOfLines={1}
                        style={{
                            textAlign:'center',
                            textAlignVertical:'center',
                            fontWeight:'bold', 
                            backgroundColor:'green',
                            fontSize:18,
                            color: '#fff',
                            width: 70,
                            height: 70,
                            margin: 10
                            }}>
                            {x.vSizeName}
                        </Text>
                    </View>))
                }
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent:'center',
      alignItems: 'center'
    }
});

export default MultipleSizeCount
