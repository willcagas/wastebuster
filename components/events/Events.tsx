import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import UpcomingEvents from '@/components/events/UpcomingEvents'
import OtherEvents from '@/components/events/OtherEvents'
import { SafeAreaView } from 'react-native-safe-area-context'

const Events = () => {
  return (
    <SafeAreaView edges={['bottom']} style={{ flex: 1, paddingBottom: 50, backgroundColor: '#fff' }}>
      <Text style={styles.header}>Events</Text>
      <UpcomingEvents />
      <OtherEvents />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#fff'
  },
  header: {
    fontFamily: 'mon-b',
    fontSize: 24,
    paddingHorizontal: 10,
  },
})

export default Events