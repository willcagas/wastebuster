import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform, StatusBar, TextInput } from 'react-native'
import React, { useRef, useState } from 'react'
import { Ionicons, MaterialIcons, MaterialCommunityIcons, FontAwesome5, FontAwesome6, Entypo, FontAwesome, Octicons } from '@expo/vector-icons'
import { Colours } from '@/constants/Colours'
import * as Haptics from 'expo-haptics'
import { SafeAreaView } from 'react-native-safe-area-context'

type IconLibrary = typeof Ionicons | typeof Entypo | typeof MaterialIcons | typeof MaterialCommunityIcons | typeof FontAwesome5 | typeof FontAwesome6;

interface Category {
  name: string;
  icon: string;
  library: keyof typeof iconLibraries;
}

const iconLibraries = {
  Ionicons,
  Entypo,
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome5,
  FontAwesome6,
}

const categories: Category[] = [
  {
    name: 'Saved',
    icon: 'star-outline',
    library: 'Ionicons',
  },
  {
    name: 'All',
    icon: 'design-services',
    library: 'MaterialIcons',
  },
  {
    name: 'Videos',
    icon: 'video',
    library: 'Entypo',
  },
  {
    name: 'Articles',
    icon: 'article',
    library: 'MaterialIcons',
  }
]

interface Props {
  onCategoryChanged: (category: string) => void
  onTextChanged : (text: string) => void
}

const SearchHeader = ({ onCategoryChanged, onTextChanged  }: Props) => {
  const [isFocused, setIsFocused] = useState(false);
  const scrollRef = useRef<ScrollView>(null)
  const itemsRef = useRef<Array<TouchableOpacity | null >>([])
  const[activeIndex, setActiveIndex] = useState(1)
  const [text, setText] = useState('')

  const handleTextChange = (value: string) => {
    setText(value)
    onTextChanged(value)
  }

  const selectCategory = (index: number) => {
    const selected = itemsRef.current[index]
    setActiveIndex(index)

    onCategoryChanged(categories[index].name)
  }

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{backgroundColor: '#fff'}}>
      <View style={styles.container}>
        <View>
          <Text style={styles.header}>Redesign</Text>
        </View>
        
        <View style={styles.actionRow}>
          <View style={styles.searchBtn}>
            <FontAwesome name='search' size={20} color={Colours.primary} style={{paddingBottom: 1}}/>

            <TextInput
              placeholder='Search for ideas...'
              placeholderTextColor={Colours.grey}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onChangeText={handleTextChange}
              value={text}
              style={{fontSize: 15, width: '82.5%'}}
            />
            <TouchableOpacity 
              onPress={() => {
                setText('');
                onTextChanged('');
                Haptics.selectionAsync();
              }} 
              disabled={!isFocused || text === ''}
              style={!isFocused || text === '' ? {display: 'none'} : {opacity: 100}}
            >
              <Octicons name='x-circle-fill' size={19} style={{color: Colours.grey}}/>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView 
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: 'center',
          gap: 12.5,
          paddingHorizontal: 15,
          paddingTop: 5,
          paddingBottom: 5,
          height: '85%',
        }}>
          {categories.map((item, index) => {
            const IconComponent: IconLibrary = iconLibraries[item.library];

            return (
              <View key={index} style={{flex: 1}}>
                <TouchableOpacity 
                onPress={() => {selectCategory(index), Haptics.impactAsync()}}
                ref={(el) => itemsRef.current[index] = el}
                style={[activeIndex === index ? styles.categoriesBtnActive : styles.categoriesBtn, { paddingHorizontal: 7.5 }]}
                >
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', gap: 5}}>
                    <IconComponent name={item.icon} size={17} color={activeIndex === index ? '#fff' : Colours.grey}/>
                    <Text style={activeIndex === index ? styles.categoryTextActive : styles.categoryText}>{item.name}</Text>
                  </View>
  
                </TouchableOpacity>
              </View> 
            )
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    height: 145,
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
    backgroundColor: '#F0F0F0',
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