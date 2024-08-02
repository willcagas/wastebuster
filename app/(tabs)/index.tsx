import { View, Text } from 'react-native'
import React, { useMemo, useState } from 'react'
import Solutions from '@/components/discover/Solutions'
import { Stack } from 'expo-router'
import SearchCategory from '@/components/discover/SearchCategory'

const Page = () => {
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')

  const onDataChanged = (category: string) => {
    setCategory(category)
  }

  const onSearchChanged = (text: string) => {
    setSearch(text)
  }

  return (
    <View style={{ flex: 1 }}> 
        <Stack.Screen 
          options={{
              header: () => <SearchCategory onCategoryChanged={onDataChanged} onTextChanged={onSearchChanged} />,
          }}
        />

        <Solutions search={search} />
    </View>
  )
}

export default Page