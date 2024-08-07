import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform, StatusBar, TextInput, Image } from 'react-native'
import React, { useRef, useState } from 'react'
import { Ionicons, MaterialIcons, MaterialCommunityIcons, FontAwesome5, FontAwesome6, Entypo, FontAwesome, Octicons } from '@expo/vector-icons'
import { Colours } from '@/constants/Colours'
import * as Haptics from 'expo-haptics'
import { SafeAreaView } from 'react-native-safe-area-context'


interface Props {
  onCategoryChanged: (category: string) => void
  onTextChanged : (text: string) => void
}

const SearchHeader = ({ onCategoryChanged, onTextChanged  }: Props) => {
  const [isFocused, setIsFocused] = useState(false);
  const [text, setText] = useState('')

  const handleTextChange = (value: string) => {
    setText(value)
    onTextChanged(value)
  }

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{backgroundColor: '#fff'}}>
      <View style={styles.container}>
        <Text style={styles.header}>Discover</Text>
        
        <View style={styles.actionRow}>
          <View style={styles.searchBtn}>
            <FontAwesome name='search' size={20} color={Colours.primary} style={{paddingBottom: 1}}/>

            <TextInput
              placeholder='Search for a circular solution...'
              placeholderTextColor={Colours.grey}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onChangeText={handleTextChange}
              value={text}
              style={{fontSize: 15, width: '82.5%'}}
            />
            <TouchableOpacity 
              onPress={() => {
                setText('')
                onTextChanged('')
                Haptics.selectionAsync()
              }}
              disabled={!isFocused || text === ''}
              style={!isFocused || text === '' ? {display: 'none'} : {opacity: 100}}
            >
              <Octicons name='x-circle-fill' size={19} style={{color: Colours.grey}}/>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    height: 105,
  },
  header: {
    fontFamily: 'mon-b',
    fontSize: 30,
    paddingLeft: 15,
    paddingTop: 2,
    paddingBottom: 7.5
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingBottom: 5,
    gap: 10,
  },
  searchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    width: 280,
    padding: 12,
    borderRadius: 30,
    backgroundColor: '#F5F5F5',
  
  },
  categoryText: {
    fontSize: 13,
    fontFamily: 'mon-sb',
    color: Colours.grey,
  },
  categoryTextActive: {
    fontSize: 13,
    fontFamily: 'mon-sb',
    color: '#fff',
  },
  categoriesBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    
    borderWidth: 1,
    borderColor: Colours.grey,
    borderRadius: 25,
    backgroundColor: '#fff'
  },
  categoriesBtnActive: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    backgroundColor: Colours.primary
  }
})

export default SearchHeader