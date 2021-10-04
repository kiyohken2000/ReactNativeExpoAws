import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, StatusBar } from 'react-native'
import { colors } from 'theme'
import { useSelector } from "react-redux"
import { API, graphqlOperation } from "aws-amplify"
import { GiftedChat, Send, Bubble } from "react-native-gifted-chat"
import { IconButton } from 'react-native-paper'
import * as mutations from "../../graphql/mutations"
import * as queries from "../../graphql/queries"
import * as subscriptions from "../../graphql/subscriptions"

export default function Chat() {
  const user = useSelector((state) => state.app.me)
  const userData = useSelector((state) => state.app.profile)
  const [messages, setMessages] = useState([])
  const roomId = 'chatRoom'

  useEffect(() => {
    // console.log('userData:', user)
  }, [])

  useEffect(() => {
    fetchMessages();
    const subscription = (API.graphql(
      graphqlOperation(subscriptions.onCreateMessage)
    )).subscribe({
      next: ({ value: { data } }) => {
        const m = data.onCreateMessage;
        const message = {
          _id: m.id,
          createdAt: m.createdAt,
          text: m.content,
          user: { _id: m.owner, name: m.name, avatar:m.avatar },
        };
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, [message])
        );
      },
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchMessages = async() => {
    const variables = {
      id: roomId,
      type: "message",
      sortDirection: "DESC"
    };
    const res = await API.graphql({
      query: queries.byTimestamp,
      variables: variables
    })
    const messages = res.data.byTimestamp
      if (messages.items) {
        setMessages(
          messages.items.map((m) => ({
            _id: m.id,
            text: m.content,
            createdAt: new Date(m.when),
            user: {
              _id: m.owner,
              name: m.name,
              avatar: m.avatar
            },
          }))
        )
      }
    }

  const onSend = async(messages) => {
    var date = new Date()
    const variables = {
      input: {
        type: 'message',
        content: messages[0].text,
        roomId: roomId,
        when: String(new Date()),
        timestamp: date.getTime(),
        name: userData.name,
        avatar: userData.avatar
      },
    };
    await API.graphql(graphqlOperation(mutations.createMessage, variables));
  }

  const renderSend = (props) => {
    return (
      <Send {...props}>
        <View style={styles.sendingContainer}>
          <IconButton icon='send-circle' size={32} color='#6646ee' />
        </View>
      </Send>
    );
  }

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#6646ee'
          },
          left: {
            backgroundColor: '#e6e6fa'
          }
        }}
        textStyle={{
          left: {
            color: '#000000'
          },
          right: {
            color: 'white'
          },
        }}
      />
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <GiftedChat
        messages={messages}
        placeholder="Type your message here"
        onSend={messages => onSend(messages)}
        renderUsernameOnMessage={true}
        user={{
          _id: user.username,
          name: user.username
        }}
        renderSend={renderSend}
        renderBubble={renderBubble}
        alwaysShowSend={true}
        textInputStyle={{
          borderColor: "white",
          borderWidth: 1,
          borderRadius: 10,
          paddingLeft: 5,
          paddingTop: 7,
          backgroundColor: "white"
        }}
        containerStyle={{backgroundColor: 'hsl(0, 0%, 90%)'}}
        textStyle={{color: "black"}}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  sendingContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
})
