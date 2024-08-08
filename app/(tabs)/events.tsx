import { View, Text, StatusBar } from 'react-native'
import React from 'react'
import Events from '@/components/events/Events'

//thistimeitworks.wastebuster

const Page = () => {
  return (
    <View style={{flex: 1}}>
      <StatusBar barStyle={"dark-content"}/>
      <Events />
      
    </View>
  )
}

export default Page