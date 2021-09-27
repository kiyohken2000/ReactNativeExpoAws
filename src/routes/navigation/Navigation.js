import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import DrawerNavigator from './drawer'
import { withAuthenticator } from 'aws-amplify-react-native'
import { SignInNavigator } from './stacks'
import { useSelector } from "react-redux"

function Main() {
  const isSignIn = useSelector((state) => state.app.authState)
  console.log(isSignIn)
  return (
    <NavigationContainer>
      {isSignIn?
        <DrawerNavigator />:
        <SignInNavigator />
      }
    </NavigationContainer>
  )
}

// export default withAuthenticator(Main)
export default Main