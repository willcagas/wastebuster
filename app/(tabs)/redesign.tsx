import { StatusBar, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import Ideas from '@/components/redesign/Ideas'
import { useState, useMemo } from 'react'
import ideasData from '@/assets/data/ideas.json'
import SearchHeader from '@/components/redesign/SearchHeader'

const Page = () => {
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const items = useMemo(() => ideasData as any, [])

  const onDataChanged = (category: string) => {
    setCategory(category)
  }

  const onSearchChanged = (text: string) => {
    setSearch(text)
  }

  return (
    <View style={{ flex: 1 }}> 
        <StatusBar barStyle={"dark-content"}/>
        <Stack.Screen 
          options={{
              header: () => <SearchHeader onCategoryChanged={onDataChanged} onTextChanged={onSearchChanged}/>,
          }}
        />
        <Ideas ideas={items} category={category} search={search}/>
    </View>
  )
}

export default Page