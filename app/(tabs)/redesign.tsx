import { View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import Ideas from '@/components/redesign/Ideas'
import { useState, useMemo } from 'react'
import ideasData from '@/assets/data/ideas.json'
import SearchHeader from '@/components/redesign/SearchHeader'

const Page = () => {
  const [category, setCategory] = useState('All')
  const items = useMemo(() => ideasData as any, [])

  const onDataChanged = (category: string) => {
    setCategory(category)
  }

  return (
    <View style={{ flex: 1 }}> 
        <Stack.Screen 
          options={{
              header: () => <SearchHeader onCategoryChanged={onDataChanged}/>,
          }}
        />
        <Ideas ideas={items} category={category}/>
    </View>
  )
}

export default Page