import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { colors } from 'theme'

import HeaderLeft from './HeaderLeft'
import HeaderTitle from './HeaderTitle'

import Home from 'scenes/home'
import Details from 'scenes/details'
import Profile from 'scenes/profile'
import Edit from 'scenes/edit'
import Config from 'scenes/config'
import Chat from 'scenes/chat'

import SignIn from '../../../screens/SignIn'
import SignUp from '../../../screens/SignUp'
import ConfirmSignUp from '../../../screens/ConfirmSignUp'

// ------------------------------------
// Constants
// ------------------------------------

const Stack = createStackNavigator()

const navigationProps = {
  headerTintColor: 'white',
  headerStyle: { backgroundColor: colors.darkPurple },
  headerTitleStyle: { fontSize: 18 },
}

// ------------------------------------
// Navigators
// ------------------------------------

export const SignInNavigator = () => (
  <Stack.Navigator
    initialRouteName="SignIn"
    headerMode="none"
    screenOptions={navigationProps}
  >
    <Stack.Screen
      name="SignIn"
      component={SignIn}
    />
    <Stack.Screen
      name="SignUp"
      component={SignUp}
    />
    <Stack.Screen
      name="ConfirmSignUp"
      component={ConfirmSignUp}
    />
  </Stack.Navigator>
)

export const HomeNavigator = () => (
  <Stack.Navigator
    initialRouteName="Home"
    headerMode="screen"
    screenOptions={navigationProps}
  >
    <Stack.Screen
      name="Home"
      component={Home}
      options={({ navigation }) => ({
        title: 'Home',
        headerLeft: () => <HeaderLeft navigation={navigation} />,
        headerTitle: () => <HeaderTitle />,
      })}
    />
    <Stack.Screen
      name="Details"
      component={Details}
      options={({ navigation }) => ({
        title: 'Home',
        headerLeft: () => <HeaderLeft navigation={navigation} />,
        headerTitle: () => <HeaderTitle />,
      })}
    />
  </Stack.Navigator>
)

export const ProfileNavigator = () => (
  <Stack.Navigator
    initialRouteName="Profile"
    headerMode="screen"
    screenOptions={navigationProps}
  >
    <Stack.Screen
      name="Profile"
      component={Profile}
      options={({ navigation }) => ({
        title: 'Profile',
        headerLeft: () => <HeaderLeft navigation={navigation} />,
        headerTitle: () => <HeaderTitle />,
      })}
    />
    <Stack.Screen
      name="Edit"
      component={Edit}
      options={{
        title: 'Edit',
      }}
    />
  </Stack.Navigator>
)

export const ConfigNavigator = () => (
  <Stack.Navigator
    initialRouteName="Config"
    headerMode="screen"
    screenOptions={navigationProps}
  >
    <Stack.Screen
      name="Config"
      component={Config}
      options={({ navigation }) => ({
        title: 'Config',
        headerLeft: () => <HeaderLeft navigation={navigation} />,
        headerTitle: () => <HeaderTitle />,
      })}
    />
  </Stack.Navigator>
)

export const ChatNavigator = () => (
  <Stack.Navigator
    initialRouteName="Chat"
    headerMode="screen"
    screenOptions={navigationProps}
  >
    <Stack.Screen
      name="Chat"
      component={Chat}
      options={({ navigation }) => ({
        title: 'Chat',
        headerLeft: () => <HeaderLeft navigation={navigation} />,
        headerTitle: () => <HeaderTitle />,
      })}
    />
  </Stack.Navigator>
)
