/*Example of RealM Database in React Native*/
import React from 'react';
import codePush from 'react-native-code-push';
//Import react-navigation
import { createAppContainer } from 'react-navigation';
import { createStackNavigator} from 'react-navigation-stack';
import Toast from 'react-native-toast-message';
//Import external files
import HomeScreen from './src/pages/HomeScreen';
// import RegisterUser from './src/pages/RegisterUser';
// import UpdateUser from './src/pages/UpdateUser';
// import ViewUser from './src/pages/ViewUser';
// import ViewAllUser from './src/pages/ViewAllUser';
// import DeleteUser from './src/pages/DeleteUser';
import DeviceLogin from './src/pages/DeviceLogin'
import SetupData from './src/pages/SetupData'
import ProductionCountSizeWise from './src/pages/ProductionCountSizeWise'
import MultipleSizeCount from './src/pages/MultipleSizeCount'

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
  },
  // View: {
  //   screen: ViewUser,
  //   navigationOptions: {
  //     title: 'View User',
  //     headerStyle: { backgroundColor: '#3a59b7' },
  //     headerTintColor: '#ffffff',
  //   },
  // },
  // ViewAll: {
  //   screen: ViewAllUser,
  //   navigationOptions: {
  //     title: 'View All User',
  //     headerStyle: { backgroundColor: '#3a59b7' },
  //     headerTintColor: '#ffffff',
  //   },
  // },
  // Update: {
  //   screen: UpdateUser,
  //   navigationOptions: {
  //     title: 'Update User',
  //     headerStyle: { backgroundColor: '#3a59b7' },
  //     headerTintColor: '#ffffff',
  //   },
  // },
  // Register: {
  //   screen: RegisterUser,
  //   navigationOptions: {
  //     title: 'Register User',
  //     headerStyle: { backgroundColor: '#3a59b7' },
  //     headerTintColor: '#ffffff',
  //   },
  // },
  // Delete: {
  //   screen: DeleteUser,
  //   navigationOptions: {
  //     title: 'Delete User',
  //     headerStyle: { backgroundColor: '#3a59b7' },
  //     headerTintColor: '#ffffff',
  //   },
  // },
});

const AppContainer =  createAppContainer(App);

const ToastContainer = () => <>
                              <AppContainer/> 
                              <Toast ref={(ref) => Toast.setRef(ref)} />
                            </>

export default codePush(ToastContainer);