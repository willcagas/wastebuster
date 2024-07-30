import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Linking, ImageBackground } from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInRight, FadeOutRight, FadeIn, FadeOut } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colours } from '@/constants/Colours';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { FlashList } from '@shopify/flash-list';

interface Props {
  ideas: any[];
  category: string;
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

const Ideas = ({ ideas: items, category }: Props) => {
  const [loading, setLoading] = useState(false);
  const [savedItems, setSavedItems] = useState<ItemId[]>([]);

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

  // Fix category 
  const filteredItems = useMemo(() =>
    items.filter(item => category === 'All' || item.category === category || savedItems.includes(item.id)),
    [items, category, savedItems]
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
                    : require('@/assets/images/placeholder.png')
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
                  source={require('@/assets/images/play.png')}
                  style={styles.youtube_ico}
                />
              )}
            </View>

            <View>
              <Animated.Text style={styles.textHeader}>Name</Animated.Text>
              <Animated.Text style={styles.textSubHeader}>{item.name}</Animated.Text>
              
              <Animated.Text style={styles.textHeader}>Description on Site</Animated.Text>
              <Animated.Text style={styles.textDesc}>"{item.description}"</Animated.Text>
    
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </View>
  )

  return (
    <SafeAreaView edges={['bottom']} style={{ flex: 1, paddingBottom: 50, backgroundColor: '#fff' }}>
      {filteredItems.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', paddingTop: 35 }}>
          <Text style={{ fontFamily: 'mon-b', fontSize: 17.5, color: Colours.grey }}>
            Nothing here to show...
          </Text>
        </View>
      ) : (
        <FlashList
          data={filteredItems}
          renderItem={renderRow}
          estimatedItemSize={200}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  idea: {
    padding: 16,
  },
  island: {
    padding: 17.5,
    paddingTop: 20,
    borderRadius: 20,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: {
      width: 1,
      height: 1,
    },
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
  }
});

export default Ideas;
