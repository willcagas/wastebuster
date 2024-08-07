import { View, Text, StyleSheet, ScrollView, Linking,TouchableOpacity, Image, Dimensions } from 'react-native'
import React, { useRef, useState } from 'react'
import { AntDesign, Feather, FontAwesome, FontAwesome5, Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colours } from '@/constants/Colours'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

const { height, width } = Dimensions.get('window')

const About = () => {
  const [expandedGreenVenture, setExpandedGreenVenture] = useState<boolean>(false)
  const [expandedWasteBuster, setExpandedWasteBuster] = useState<boolean>(false)

  const heightGreenVenture = useSharedValue<number>(0)
  const heightWasteBuster = useSharedValue<number>(0)

  const toggleExpandGreenVenture = () => {
    if (expandedGreenVenture) {
      heightGreenVenture.value = withTiming(0, { duration: 300 });
    } else {
      heightGreenVenture.value = withTiming(150, { duration: 300 }); 
      
      if (expandedWasteBuster) {
        setExpandedWasteBuster(!expandedWasteBuster)
        heightWasteBuster.value = withTiming(0, { duration: 300 });
      }   
    }

    setExpandedGreenVenture(!expandedGreenVenture);
  }

  const toggleExpandWasteBuster = () => {
    if (expandedWasteBuster) {
      heightWasteBuster.value = withTiming(0, { duration: 300 });
    } else {
      heightWasteBuster.value = withTiming(275, { duration: 300 }); 

      if (expandedGreenVenture) {
        setExpandedGreenVenture(!expandedGreenVenture)
        heightGreenVenture.value = withTiming(0, { duration: 300 })
      }
    }
    setExpandedWasteBuster(!expandedWasteBuster);
  }

  const animatedStyleGreenVenture = useAnimatedStyle(() => ({
    height: heightGreenVenture.value,
  }))

  const animatedStyleWasteBuster = useAnimatedStyle(() => ({
    height: heightWasteBuster.value,
  }))

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.container}>
        <View style={{ gap: 20 }}>
          <View style={{ marginTop: 5 }}>
            <TouchableOpacity style={styles.button} onPress={toggleExpandWasteBuster}>
              <View style={styles.innerButton}>
                <FontAwesome name="question-circle-o" size={24} color={Colours.primary} />
                <Text style={styles.subheader}>About WasteBuster</Text>
              </View>
              
              <Feather name={expandedWasteBuster ? "arrow-up" : "arrow-right"} size={20} color='black'/>
            </TouchableOpacity>

            <ScrollView >
              <Animated.View style={[styles.animatedContainer, animatedStyleWasteBuster]}>
                <Text style={[styles.description, {marginTop: 15}]}>
                  WasteBuster was first made by coop students Kevin and Afra,
                  with the solution database made by grade 7/8 students from Spring Valley Elementary School.
                  It has now been fully redeveloped & redesigned by William.
                </Text>

                <Text style={styles.description}>
                  It aims to address the worsening issue of overconsumption by helping people in the Hamilton 
                  region find accessible circular solutions for their unwanted items, creating a circular economy.
                </Text>

                <Text style={styles.description}>
                  Please use it often and share the message about circular economy and why it matters. 
                  We all need to contribute to keep our planet healthy and sustainable. Thank you!
                </Text>
              </Animated.View>
              
            </ScrollView>
          </View>

          <View style={styles.separator} />

          <View>
            <TouchableOpacity style={styles.button} onPress={toggleExpandGreenVenture}>
              <View style={styles.innerButton}>
                <FontAwesome name="question-circle-o" size={24} color={Colours.primary} />
                <Text style={styles.subheader}>About Green Venture</Text>
              </View>
              
              <Feather name={expandedGreenVenture ? "arrow-up" : "arrow-right"} size={20} color='black'/>
            </TouchableOpacity>

            <ScrollView >
              <Animated.View style={[styles.animatedContainer, animatedStyleGreenVenture]}>
                <Text style={[styles.description, {marginTop: 15}]}>
                  Green Venture is Hamilton, Ontario's environmental nonprofit dedicated to helping residents 
                  live more sustainably at home, at work, and in their daily lives.
                </Text>

                <Text style={styles.description}>
                  Our mandate is to empower Hamiltonians to implement greener practices in their homes and communities
                  to make our city a climate champ.
                </Text>
              </Animated.View>
            </ScrollView>
            
          </View>

          <View style={styles.separator} />

          <TouchableOpacity style={styles.button} onPress={() => Linking.openURL(`tel:9055408787`)}>
            <View style={[styles.innerButton, {gap: 10.5}]}>
              <FontAwesome5 name="phone-alt" size={20} color={Colours.primary} />
              <Text style={styles.subheader}>
                Contact us <Text style={{color: Colours.primary}}>(905) 540-8787</Text>
              </Text>
            </View>
            
            <Feather name="arrow-right" size={20} color="black"/>
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity style={styles.button} onPress={() => Linking.openURL('https://greenventure.ca/')}>
            <View style={[styles.innerButton, {gap: 8}]}>
              <Ionicons name="globe-outline" size={24} color={Colours.primary} />
              <Text style={styles.subheader}>Check us out <Text style={{color: Colours.primary}}>greenventure.ca</Text></Text>
            </View>
            
            <Feather name="arrow-right" size={20} color='black'/>
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity style={styles.button} onPress={() => Linking.openURL('https://www.instagram.com/green_venture/')}>
            <View style={styles.innerButton}>
              <AntDesign name="instagram" size={23.5} color={Colours.primary} />
              <Text style={styles.subheader}>Follow our IG <Text style={{color: Colours.primary}}>@green_venture</Text></Text>
            </View>
            
            <Feather name="arrow-right" size={20} color='black'/>
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity style={styles.button} onPress={() => Linking.openURL('https://www.tiktok.com/@green_venture')}>
            <View style={[styles.innerButton, {gap: 12.5}]}>
              <FontAwesome5 name="tiktok" size={22} color={Colours.primary} />
              <Text style={styles.subheader}>See our TikTok <Text style={{color: Colours.primary}}>@green_venture</Text></Text>
            </View>
            
            <Feather name="arrow-right" size={20} color='black'/>
          </TouchableOpacity>

          <View style={styles.separator} />
        </View>

        <View style={{ alignItems: 'center', marginBottom: 10}}>
          <Text style={styles.creditText}>
            Made with ❤ by William Cagas
          </Text>
        </View>
      </View>
    </View>
    
  )
}

const styles = StyleSheet.create({
  creditText: {
    fontFamily: 'mon-sb', 
    fontSize: 13,
    color: Colours.grey,
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: 'space-between'
  },
  header: {
    fontFamily: 'mon-b',
    fontSize: 24
  },
  subheader: {
    fontFamily: 'mon-sb',
    fontSize: 15
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E0E0E0', 
    right: 0, 
    width: '100%', 
    alignSelf: 'center'
  },
  animatedContainer: {
    gap: 10,
  },
  description: {
    fontFamily: 'mon',
    fontSize: 14
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    alignItems: 'center'
  },
  innerButton: {
    gap: 10,
    flexDirection: 'row',
    alignItems: 'center'
  }
})

export default About