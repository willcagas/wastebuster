import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Linking, ImageBackground, RefreshControl } from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInRight, FadeOutRight, FadeIn, FadeOut } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colours } from '@/constants/Colours';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { FlashList } from '@shopify/flash-list';
import ReadMore from '@fawazahmed/react-native-read-more';

interface Props {
  ideas: any[];
  category: string;
  search: string;
}

type ItemId = string | number;

const SAVED_ITEM_IDS_KEY = '@MyApp:savedItemIds';

async function getSavedItemIds(): Promise<ItemId[]> {
  try {
    const savedIdsJson = await AsyncStorage.getItem(SAVED_ITEM_IDS_KEY);
    return savedIdsJson ? JSON.parse(savedIdsJson) : [];
  } catch (error) {
    console.error('Error getting saved item IDs:', error);
    return [];
  }
}

async function saveItemId(id: ItemId): Promise<void> {
  try {
    const savedIds = await getSavedItemIds();
    if (!savedIds.includes(id)) {
      savedIds.push(id);
      await AsyncStorage.setItem(SAVED_ITEM_IDS_KEY, JSON.stringify(savedIds));
    }
  } catch (error) {
    console.error('Error saving item ID:', error);
  }
}

async function removeItemId(id: ItemId): Promise<void> {
  try {
    const savedIds = await getSavedItemIds();
    const updatedIds = savedIds.filter(savedId => savedId !== id);
    await AsyncStorage.setItem(SAVED_ITEM_IDS_KEY, JSON.stringify(updatedIds));
  } catch (error) {
    console.error('Error removing item ID:', error);
  }
}

const Ideas = ({ ideas: items, category, search }: Props) => {
  const [loading, setLoading] = useState(false);
  const [savedItems, setSavedItems] = useState<ItemId[]>([])
  const [refreshing, setRefreshing] = useState<boolean>(false)

  useEffect(() => {
    const loadSavedItems = async () => {
      setLoading(true);
      try {
        const ids = await getSavedItemIds();
        setSavedItems(ids);
      } catch (error) {
        console.error('Error loading saved items:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSavedItems();
  }, [category]);

  const filteredItems = useMemo(() => 
    items.filter(item => {
      const nameMatch = item.name?.toLowerCase().includes(search?.toLowerCase() ?? '') ?? false;
      const descriptionMatch = item.description?.toLowerCase().includes(search?.toLowerCase() ?? '') ?? false;
      const categoryMatch = category === 'All' || item.category === category;
      const isSaved = savedItems.includes(item.id);
  
      return (nameMatch || descriptionMatch) && (categoryMatch || isSaved);
    }),
    [items, category, savedItems, search]
  )

  const toggleSaved = async (id: ItemId) => {
    savedItems.includes(id)
    ? (await removeItemId(id), setSavedItems(prevItems => prevItems.filter(itemId => itemId !== id)))
    : (await saveItemId(id), setSavedItems(prevItems => [...prevItems, id]));
  }

  const renderRow = ({ item }: { item: any }) => (
    <View>
      <TouchableOpacity activeOpacity={0.7} onPress={() => Linking.openURL(item?.url)}>
        <Animated.View style={styles.idea} entering={FadeIn.delay(150).duration(100)} exiting={FadeOut.duration(100)}>
          <View style={styles.island}>
            <View>
              <Animated.Image
                entering={FadeIn.delay(300).duration(100)} exiting={FadeOut.duration(100)}
                source={item.category === "Videos"
                  ? { uri: `https://img.youtube.com/vi/${item.url.split("v=")[1]}/0.jpg` }
                  : item.image
                    ? { uri: item.image }
                    : require('@/assets/images/miscellaneous/placeholder.png')
                }
                style={styles.image}
                resizeMode="cover"
              />

              <TouchableOpacity
                style={styles.roundBtn}
                onPress={async () => {
                  await toggleSaved(item.id);
                  await Haptics.selectionAsync();
                }}
              >
                <Ionicons
                  name={savedItems.includes(item.id) ? 'star' : 'star-outline'}
                  size={28}
                  color={savedItems.includes(item.id) ? '#FFDF00' : '#000'}
                />
              </TouchableOpacity>

              {item.category === "Videos" && (
                <Animated.Image
                  entering={FadeIn.delay(300).duration(100)}
                  exiting={FadeOut.duration(100)}
                  source={require('@/assets/images/miscellaneous/play.png')}
                  style={styles.youtube_ico}
                />
              )}
            </View>

            <View>
              <Animated.Text style={styles.textHeader}>Name</Animated.Text>
              <Animated.Text style={styles.textSubHeader}>{item.name}</Animated.Text>
              
              <Animated.Text style={styles.textHeader}>Description on Site</Animated.Text>
              <ReadMore numberOfLines={3} seeMoreStyle={styles.seeText} seeLessStyle={styles.seeText} style={styles.textDesc}>
                "{item.description}"
              </ReadMore>
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </View>
  )

  //REFRESH
  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
  }, []);

  return (
    <SafeAreaView edges={['bottom']} style={{ flex: 1, paddingBottom: 50, backgroundColor: '#fff' }}>
      {filteredItems.length === 0 ? (
        <View style={styles.emptyContainer}>
         <Image style={{height: '35%', width: '50%'}} source={require('@/assets/images/miscellaneous/empty_image.png')} />

         <Text style={{ fontFamily: 'mon-b', fontSize: 17.5, color: Colours.grey}}>
           Nothing here to show...
         </Text>
       </View>
     
      ) : (
        <FlashList
          data={filteredItems}
          renderItem={renderRow}
          estimatedItemSize={200}
          showsVerticalScrollIndicator={true}
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
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E0E0E0', 
    right: 0,
    width: '100%', 
    alignSelf: 'center',
    marginVertical: 10,
  },
  idea: {
    padding: 16,
  },
  island: {
    padding: 17.5,
    paddingTop: 20,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderColor: '#e2e2e2',
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
  image: {
    width: '100%',
    height: 250,
    borderRadius: 15,
    borderColor: '#fff',
    borderWidth: 5,
  },
  roundBtn: {
    width: 42.5,
    height: 42.5,
    position: 'absolute',
    top: '5%',
    right: '4%',
    borderRadius: 50,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    color: Colours.primary,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colours.grey,
  },
  name: {
    fontFamily: 'mon-b',
    fontSize: 18,
    paddingTop: 10,
    color: '#000',
  },
  youtube_ico: {
    flex: 1,
    alignSelf: 'center',
    position: 'absolute',
    top: '20%',
    height: 150,
    width: 150,
  },
  textSubHeader: {
    fontFamily: 'mon-b',
    paddingTop: 2,
    color: '#000',
    fontSize: 17.5
  },
  textDesc: {
    fontFamily: 'mon',
    paddingTop: 2,
    color: '#000',
    fontSize: 14,
  },
  textHeader: {
    fontFamily: 'mon-sb',
    paddingTop: 10,
    fontSize: 13,
    color: Colours.grey
  },
  seeText: {
    fontFamily: 'mon-sb',
    color: Colours.primary,
  },
  emptyContainer: { 
    flex: 1, 
    alignItems: 'center', 
    paddingTop: 100,
    gap: 12.5
  },
});

export default Ideas;
