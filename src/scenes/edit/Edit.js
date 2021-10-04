import React, { useState } from 'react'
import { StyleSheet, Text, View, StatusBar, TextInput, TouchableOpacity } from 'react-native'
import { colors } from 'theme'
import { useSelector, useDispatch } from "react-redux"
import { useNavigation } from '@react-navigation/native'
import { Avatar } from 'react-native-elements'
import { API, graphqlOperation, Storage } from "aws-amplify"
import { updateProfile } from '../../graphql/mutations'
import { getProfile } from '../../graphql/queries'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator'
import Constants from 'expo-constants'
import { userProfile } from '../../slices/app.slice'
import { bucketUrl } from '../../key/key'

export default function Edit() {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const userData = useSelector((state) => state.app.profile)
  const me = useSelector((state) => state.app.me)
  const [fullName, setFullName] = useState(userData.name)
  const [avatar, setAvatar] = useState(userData.avatar)

  const onUpdatePress = async() => {
    const input = {
      id: me.id,
      name: fullName,
      avatar: avatar,
      description: userData.description
    }
    await API.graphql(graphqlOperation(updateProfile, { input }))
    const variables = { id: me.id }
    const profile = await API.graphql({
      query: getProfile,
      variables: variables
    })
    dispatch(userProfile({ profile: profile.data.getProfile }))
    navigation.goBack()
  }

  const ImageChoiceAndUpload = async () => {
    try {
      if (Constants.platform.ios) {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted') {
          alert("Permission is required for use.");
          return;
        }
      }
      const result = await ImagePicker.launchImageLibraryAsync();
        if (!result.cancelled) {
          const actions = [];
          actions.push({ resize: { width: 300 } });
          const manipulatorResult = await ImageManipulator.manipulateAsync(
            result.uri,
            actions,
            { compress: 0.4, },
          );
          const localUri = await fetch(manipulatorResult.uri);
          const localBlob = await localUri.blob();
          const filename = me.attributes.sub + new Date().getTime()
          const uploadResult = await Storage.put(
            `${filename}.jpg`,
            localBlob
          )
          const avatarUrl = bucketUrl + uploadResult.key
          setAvatar(avatarUrl)
        }
    } catch (e) {
        console.log('error',e.message);
        alert("The size may be too much.");
    }
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <KeyboardAwareScrollView style={styles.container}>
        <View style={styles.avatar}>
          <Avatar
            size="xlarge"
            rounded
            title="NI"
            source={{ uri: avatar }}
            onPress={() =>  ImageChoiceAndUpload()}
          />
        </View>
        <View style={styles.dataContainer}>
          <Text style={styles.field}>Name:</Text>
          <TextInput
            style={styles.input}
            placeholder={fullName}
            placeholderTextColor="#aaaaaa"
            onChangeText={(text) => setFullName(text)}
            value={fullName}
            textAlign={'center'}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={() => onUpdatePress()}>
          <Text style={styles.buttonText}>Done</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
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
  },
  field: {
    fontSize: 15,
    textAlign: 'center',
  },
  container: {
    width: '100%',
    flex: 1,
    alignContent: 'center'
  },
  button: {
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20,
    height: 48,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: 'center',
    backgroundColor:colors.primary
  },
  buttonText: {
    color: 'white',
    fontSize: 16
  },
  avatar: {
    margin: 30,
    alignSelf: "center",
  },
  dataContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 30
  },
  input: {
    height: 48,
    fontSize: 24,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: 'white',
    marginVertical: 10,
    width: '100%',
    backgroundColor: colors.white,
    color: colors.primaryText
  },
})