import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useGetSheduleQuery } from '../store/slices/stationsAPI'
import { Socket, io } from "socket.io-client";
type Props = {}

const BusShedule: React.FC<Props> = (props: Props) => {
  // const {data: sheduleData, error: sheduleError, isLoading: sheduleIsLoading} = useGetSheduleQuery(22)
  const [socket, setSocket] = useState<Socket| null>(null)
  useEffect(() => {
    let newSocket: Socket = io("http://192.168.0.108:3000")
    setSocket(newSocket)
    return () => {
      newSocket.close()
    }
  }, [])

  socket?.on('newMessage', (...arg) => {
    console.log('args', arg)
  })

  const sendMessage = async () => {
    if(socket){
      //@ts-ignore
      socket.emit('newMessage', 'hey', (res) => {
      })
    }
  }

  return (
    <View>
      <Text>1231231</Text>
      <TouchableOpacity style={{width: 300, height: 300, backgroundColor: "red"}} onPress={sendMessage}><Text>send</Text></TouchableOpacity>
    </View>
  )
}

export default BusShedule