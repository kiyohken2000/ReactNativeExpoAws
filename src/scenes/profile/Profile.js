import React from 'react'
import { StyleSheet, Text, View, StatusBar } from 'react-native'
import { colors } from 'theme'
import { useSelector } from "react-redux"

export default function Profile() {
  const user = useSelector((state) => state.app.profile)

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.title}>{user.name}</Text>
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