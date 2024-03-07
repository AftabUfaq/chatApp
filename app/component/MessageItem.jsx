import { View, Text } from 'react-native'
import React from 'react'

const MessageItem = ({ item, sender }) => {
  
  console.log("item:", item , "sender:" ,sender);
  return (
    <View className={flex-1}>
      <View>
        <Text>{item.sender}</Text>
        <Text>{item.message}</Text>
      </View>
    </View>
  );
}

export default MessageItem