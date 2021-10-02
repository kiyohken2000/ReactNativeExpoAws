import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import DrawerNavigator from './drawer'
import { Auth } from 'aws-amplify';
import { SignInNavigator } from './stacks'
import { useSelector, useDispatch } from "react-redux"
import { auth, userData, userProfile } from '../../slices/app.slice'
import Amplify, { API, graphqlOperation } from "aws-amplify"
import { getProfile } from '../../graphql/queries';
import { createProfile } from '../../graphql/mutations';

export default function Main() {
  const dispatch = useDispatch()
  const isSignIn = useSelector((state) => state.app.authState)
  const me = useSelector((state) => state.app.me)

  useEffect(() => {
    checkAuthState()
    userInfo()
  }, [])

  useEffect(() => {
    fetchData()
  }, [me])

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
    dispatch(userData({ me: info }))
  }

  const fetchData = async() => {
    const variables = { id: me.id }
    const profile = await API.graphql({
      query: getProfile,
      variables: variables
    })
    if (profile.data.getProfile) {
      dispatch(userProfile({ profile: profile.data.getProfile }))
    } else {
      const input = {
        id: me.id,
        name: me.username,
        avatar: 'https://i.imgur.com/9b8l2kT.jpg',
        description: me.attributes.email
      }
      await API.graphql(graphqlOperation(createProfile, { input }))
    }
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
