import { View, Text, StatusBar } from 'react-native'
import React from 'react'
import AboutUsPage from '@/components/more/AboutUs'

const Page = () => {
  return (
    <View style={{flex: 1}}>
      <StatusBar barStyle={"dark-content"}/>

      <AboutUsPage/>
    </View>
  )
}

export default Page