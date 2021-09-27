import React, { useState, useEffect } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity, Text, View, StatusBar, TextInput, Touchable } from 'react-native'
import { colors } from 'theme'
import Amplify, { API, graphqlOperation } from "aws-amplify"
import { createTodo, deleteTodo } from '../../graphql/mutations'
import { listTodos } from '../../graphql/queries'
import { onCreateTodo, onDeleteTodo } from '../../graphql/subscriptions'

export default function Config() {
  const [name, setName] = useState('')
  const [todos, setTodos] = useState([])
  const [post, setPost] = useState('')
  const [del, setDel] = useState('')
  
  useEffect(() => {
    fetchData()
    const subscription = API.graphql(graphqlOperation(onCreateTodo)).subscribe({
      next: (eventData) => {
        const post = eventData.value.data.onCreateTodo
        setPost(post)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const subscription = API.graphql(graphqlOperation(onDeleteTodo)).subscribe({
      next: (eventData) => {
        setDel(eventData.value.data.onDeleteTodo)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const arr = [...todos, post]
    setTodos(arr)
  }, [post])

  useEffect(() => {
    const arr = todos.filter(item => item.id !== del.id)
    setTodos(arr)
  }, [del])

  const fetchData = async() => {
    try {
      const todos = await API.graphql(graphqlOperation(listTodos))
      setTodos(todos.data.listTodos.items)
    } catch (error) {
      console.log('error: ', error)
    }
  }

  const addTodo = async() => {
    if (name) {
      const input = { name }
      await API.graphql(graphqlOperation(createTodo, { input }))
      setName('')
    } else {
      console.log('空です')
    }
  }

  const delTodo = async(id) => {
    const input = { id }
    await API.graphql(graphqlOperation(deleteTodo, { input }))
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <View style={{width: '100%'}}>
        <TextInput
          style={styles.input}
          placeholder='name'
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setName(text)}
          value={name}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.button} onPress={() => addTodo()}>
          <Text style={styles.buttonText}>Add todo</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.container}>
        {todos.map((item, i) => {
          return (
            <View key={i} style={{flexDirection: 'row', justifyContent:'space-around', padding:10}}>
              <Text style={styles.title}>{item.name}</Text>
              <TouchableOpacity style={{backgroundColor:'gray', padding:10, borderRadius:5}} onPress={() => {
                delTodo(item.id)
              }}>
                <Text>del</Text>
              </TouchableOpacity>
            </View>
          )
        })}
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
    backgroundColor: colors.lightGrayPurple,
  },
  container: {
    flex: 1,
    width: '100%',
  },
  button: {
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20,
    height: 48,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: 'center',
    backgroundColor: 'skyblue'
  },
  buttonText: {
    color: 'white'
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 48,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: 'white',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 30,
    marginRight: 30,
    paddingLeft: 16
  },
})
