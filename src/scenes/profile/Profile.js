import React from 'react'
import { StyleSheet, Text, View, StatusBar, TouchableOpacity, ScrollView } from 'react-native'
import { colors } from 'theme'
import { useSelector, useDispatch } from "react-redux"
import { useNavigation } from '@react-navigation/native'
import { Avatar } from 'react-native-elements'
import { Auth } from 'aws-amplify'
import { auth, userData, userProfile } from '../../slices/app.slice'

export default function Profile() {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.app.profile)

  const signOut = () => {
    Auth.signOut()
    .then((res) =>
      dispatch(auth({ authState: false }))
    )
    .catch((error) => console.log('サインアウト失敗: ', error))
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.container}>
        <View style={styles.avatar}>
          <Avatar
            size="xlarge"
            rounded
            title="NI"
            source={{ uri: user.avatar }}
          />
        </View>
        <Text style={styles.field}>Name:</Text>
        <Text style={styles.title}>{user.name}</Text>
        <TouchableOpacity style={[styles.button, {backgroundColor:colors.primary}]} onPress={() => navigation.navigate('Edit')}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, {backgroundColor:colors.secondary}]} onPress={() => signOut()}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    alignSelf: 'center'
  },
  field: {
    fontSize: 15,
    textAlign: 'center',
  },
  container: {
    width: '100%',
    flex: 1
  },
  button: {
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20,
    height: 48,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16
  },
  avatar: {
    margin: 30,
    alignSelf: "center",
  },
})