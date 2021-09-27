import React from 'react'
import { StyleSheet, Text, View, StatusBar } from 'react-native'
import Button from 'components/Button'
import { colors } from 'theme'
import { Auth } from 'aws-amplify';
import { useDispatch } from "react-redux"
import { auth } from '../../slices/app.slice';

export default function Home() {
  const dispatch = useDispatch()

  const signOut = async() => {
    try {
      await Auth.signOut()
      dispatch(auth({ authState: false}))
    } catch (error) {
      console.log('Error sign out:', error)
    }
  }
  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.title}>Home</Text>
      <Button
        title="Sign Out"
        color="white"
        backgroundColor={colors.lightPurple}
        onPress={signOut}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.lightGrayPurple,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
})
