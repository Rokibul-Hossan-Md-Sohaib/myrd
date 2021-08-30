import React from 'react';
import codePush from 'react-native-code-push';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator} from 'react-navigation-stack';
import Toast from 'react-native-toast-message';
import HomeScreen from './src/pages/HomeScreen';
import DeviceLogin from './src/pages/DeviceLogin'
import SetupData from './src/pages/SetupData'
import ProductionCountSizeWise from './src/pages/ProductionCountSizeWise'
import MultipleSizeCount from './src/pages/MultipleSizeCount'

let codePushOptions = { 
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME, 
  installMode: codePush.InstallMode.IMMEDIATE, 
  updateDialog: true,
  allowRestart: true 
}; 

const App = createStackNavigator({
  HomeScreen: {
    screen: HomeScreen,
    navigationOptions: {
      title: 'QMS Home',
      headerStyle: { backgroundColor: '#222b45' },
      headerTintColor: '#ffffff',
      headerLeft: ()=> null
    },
  },
  DeviceLogin: {
    screen: DeviceLogin,
    navigationOptions: {
      title: 'QMS Login',
      headerStyle: { backgroundColor: '#222b45' },
      headerTintColor: '#ffffff',
      headerLeft: ()=> null
    },
  },
  SetupData: {
    screen: SetupData,
    navigationOptions: {
      title: 'QMS Data Setup',
      headerStyle: { backgroundColor: '#222b45' },
      headerTintColor: '#ffffff',
      headerLeft: ()=> null
    },
  },
  ProductionCountSizeWise: {
    screen: ProductionCountSizeWise,
    navigationOptions: {
      headerShown: false,
      title: 'QMS Production Count',
      headerStyle: { backgroundColor: '#3a59b7' },
      headerTintColor: '#ffffff',
    }
  },
  MultipleSizeCount: {
    screen: MultipleSizeCount,
    navigationOptions: {
      headerShown: false,
      title: 'QMS Sizes Count',
      headerStyle: { backgroundColor: '#3a59b7' },
      headerTintColor: '#ffffff',
    }
  }
});

const AppContainer =  createAppContainer(App);

const ToastContainer = () => <>
                              <AppContainer/> 
                              <Toast ref={(ref) => Toast.setRef(ref)} />
                            </>

export default codePush(codePushOptions)(ToastContainer);