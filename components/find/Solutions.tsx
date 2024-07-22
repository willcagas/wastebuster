import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import axios from 'axios';
import { Link } from 'expo-router';
import categoryData from '@/assets/data/categories.json'
import Animated, { FadeInLeft, FadeOutRight } from 'react-native-reanimated';
import { Ionicons, MaterialIcons, SimpleLineIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colours } from '@/constants/Colours';

interface DataItem {
  [key: string]: string;
}

interface CategoryProps {
  id: number, 
  name: string, 
  image: string
}

const DataScreen = () => {
  const [data, setData] = useState<DataItem[]>([])

  const fetchData = async () => {
    try {
      const response = await axios.get<DataItem[]>('https://raw.githubusercontent.com/willcagas/wastebuster-public-database/main/wastebuster-database.json');
      setData(response.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const renderItem = ({ item }: { item:CategoryProps }) => (
    <View style={styles.container}>
      <Link href={`/category/${item.id}`} asChild>
        <TouchableOpacity activeOpacity={0.7} delayPressIn={0} >
          <View style={styles.category}>
            {/* <Image source={require('@/assets/images/placeholder.png')} style={styles.image} /> */}
            <View style={styles.coloredSide}>
              <MaterialIcons name='keyboard-arrow-right' size={60} color='#fff'/>
            </View>

            <View style={styles.description}>
              <Text style={styles.name}>{item.name}</Text>
              <View>
                
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Link>
    </View>
  )

  return (
    <SafeAreaView edges={['bottom']} style={{paddingBottom: 50}}>
       <FlatList
          data={categoryData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  category: {
    flex: 1,
    height: 125,
    backgroundColor: '#fff',
    borderRadius: 25,
    justifyContent: 'center',
    borderColor: '#c2c2c2',
    borderWidth: StyleSheet.hairlineWidth,

    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: {
      width: 1,
      height: 1
    }
  },
  coloredSide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    width: '25%',
    height: '100%',
    backgroundColor: Colours.primary, 
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 10,
  },
  name: {
    fontFamily: 'mon-b', 
    fontSize: 18,
    paddingTop: 10,
  },
  description: {
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    alignContent: 'center',
    paddingLeft: 20,
    
  }
})

export default DataScreen