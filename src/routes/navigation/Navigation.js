import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import DrawerNavigator from './drawer'
import { Auth } from 'aws-amplify';
import { SignInNavigator } from './stacks'
import { useSelector, useDispatch } from "react-redux"
import { auth } from '../../slices/app.slice';

export default function Main() {
  const dispatch = useDispatch()
  const isSignIn = useSelector((state) => state.app.authState)

  useEffect(() => {
    checkAuthState()
    userInfo()
  }, [])

  const checkAuthState = async() => {
    try {
      await Auth.currentAuthenticatedUser()
      dispatch(auth({ authState: true }))
    } catch (error) {
      console.log('User is not signed in:', error)
      dispatch(auth({ authState: false })) 
    }
  }

  const userInfo = async() => {
    const info = await Auth.currentUserInfo()
    const more = await Auth.currentAuthenticatedUser()
    console.log('user info:', info)
  }

  return (
    <NavigationContainer>
      {isSignIn?
        <DrawerNavigator />:
        <SignInNavigator />
      }
    </NavigationContainer>
  )
}
