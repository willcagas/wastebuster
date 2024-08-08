import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native'
import React, { useCallback, useState } from 'react'
import UpcomingEvents from '@/components/events/UpcomingEvents'
import OtherEvents from '@/components/events/OtherEvents'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colours } from '@/constants/Colours'

const Events = ( ) => {
  const [refreshing, setRefreshing] = useState<boolean>(false)

  // REFRESH
  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false)
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <ScrollView 
        style={styles.container}
        indicatorStyle="black"  
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colours.secondary}
            colors={[Colours.primary]} 
            progressBackgroundColor="#fff"
          />
        }
      >
        <UpcomingEvents refresh={refreshing}/>
        <OtherEvents refresh={refreshing}/>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#fff',
  },
  header: {
    fontFamily: 'mon-b',
    fontSize: 24,
    paddingHorizontal: 10,
  },
})

export default Events