import { View, Text } from 'react-native'
import React,{memo} from 'react'

const MessageItem = memo(({ item, sender }) => {
  
  
  return (
    <View
      className={`flex-row ${item.sender === sender ? "justify-center" : "justify-start"
        } p-[10px]`}>
      <View
        className={`${item.sender === sender ? "bg-[#dcf8c6]" : "bg-white"
          } p-[10px] rounded-xl max-w-[80%] mx-[10px]`}>
        <Text className="text-gray-400">{item.sender}</Text>
        <Text>{item.message}</Text>
      </View>
    </View>
  );
});

export default MessageItem