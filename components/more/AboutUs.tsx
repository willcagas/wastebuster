import { View, Text, StyleSheet, ScrollView, Linking,TouchableOpacity, Image } from 'react-native'
import React, { useRef, useState } from 'react'
import { AntDesign, Feather, FontAwesome, FontAwesome5, Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colours } from '@/constants/Colours'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

const About = () => {
  const [expandedGreenVenture, setExpandedGreenVenture] = useState<boolean>(false)
  const [expandedWasteBuster, setExpandedWasteBuster] = useState<boolean>(false)

  const heightGreenVenture = useSharedValue<number>(0)
  const heightWasteBuster = useSharedValue<number>(0)

  const toggleExpandGreenVenture = () => {
    if (expandedGreenVenture) {
      heightGreenVenture.value = withTiming(0, { duration: 300 });
    } else {
      heightGreenVenture.value = withTiming(162.5, { duration: 300 }); 
      
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
    <SafeAreaView edges={['bottom']} style={{ paddingBottom: 49 }}>
      <View style={styles.container}>
        <View style={{gap: 20}}>

          <View style={[styles.separator, {marginTop: 15}]} />


          <View >
            <TouchableOpacity style={styles.button} onPress={toggleExpandWasteBuster}>
              <View style={styles.innerButton}>
                <FontAwesome name="question-circle-o" size={26} color={Colours.primary} />
                <Text style={styles.subheader}>About WasteBuster</Text>
              </View>
              
              <Feather name={expandedWasteBuster ? "arrow-up" : "arrow-right"} size={20} color='black'/>
            </TouchableOpacity>

            <Animated.View style={[styles.animatedContainer, animatedStyleWasteBuster]}>
              <Text style={[styles.description, {marginTop: 15}]}>
                Wastebuster was created to address the worsening issue of overconsumption and how our modern economy 
                often creates and promotes short-lasting, single-use items.
              </Text>

              <Text style={styles.description}>
                It aims to help people in the Hamilton region find circular solutions for 
                their unwanted items that are accessible and sustainable in 
                order to create a circular economy.
              </Text>

              <Text style={styles.description}>
                Please use it often, and share the message about circular economy and why it matters. 
                We all need to contribute to keep our planet healthy and sustainable. Thank you!
              </Text>
            </Animated.View>
          </View>

          <View style={styles.separator} />
          
          <View>
            <TouchableOpacity style={styles.button} onPress={toggleExpandGreenVenture}>
              <View style={styles.innerButton}>
                <FontAwesome name="question-circle-o" size={26} color={Colours.primary} />
                <Text style={styles.subheader}>About Green Venture</Text>
              </View>
              
              <Feather name={expandedGreenVenture ? "arrow-up" : "arrow-right"} size={20} color='black'/>
            </TouchableOpacity>

            <Animated.View style={[styles.animatedContainer, animatedStyleGreenVenture]}>
              <Text style={[styles.description, {marginTop: 15}]}>
                Green Venture is Hamilton, Ontario's environmental nonprofit dedicated to helping residents 
                live more sustainably at home, at work, and in their daily lives.
              </Text>

              <Text style={styles.description}>
                Our mandate is to empower Hamiltonians to implement greener practices in their homes and communities
                to make our city a climate champion.
              </Text>
            </Animated.View>
          </View>
    
          <View style={styles.separator} />
          
          <TouchableOpacity style={styles.button} onPress={() => Linking.openURL(`tel:9055408787`)}>
            <View style={styles.innerButton}>
              <FontAwesome5 name="phone-alt" size={22} color={Colours.primary} />
              <Text style={styles.subheader}>
                Contact us <Text style={{color: Colours.primary}}>(905) 540-8787</Text>
              </Text>
            </View>
            
            <Feather name="arrow-right" size={20} color="black"/>
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity style={styles.button} onPress={() => Linking.openURL('https://greenventure.ca/')}>
            <View style={styles.innerButton}>
              <Ionicons name="globe-outline" size={25} color={Colours.primary} />
              <Text style={styles.subheader}>Check us out <Text style={{color: Colours.primary}}>greenventure.ca</Text></Text>
            </View>
            
            <Feather name="arrow-right" size={20} color='black'/>
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity style={styles.button} onPress={() => Linking.openURL('https://www.instagram.com/green_venture/')}>
            <View style={styles.innerButton}>
              <AntDesign name="instagram" size={24} color={Colours.primary} />
              <Text style={styles.subheader}>Follow our IG <Text style={{color: Colours.primary}}>@green_venture</Text></Text>
            </View>
            
            <Feather name="arrow-right" size={20} color='black'/>
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity style={styles.button} onPress={() => Linking.openURL('https://www.tiktok.com/@green_venture')}>
            <View style={[styles.innerButton, {gap: 12.5}]}>
              <FontAwesome5 name="tiktok" size={24} color={Colours.primary} />
              <Text style={styles.subheader}>See our TikTok <Text style={{color: Colours.primary}}>@green_venture</Text></Text>
            </View>
            
            <Feather name="arrow-right" size={20} color='black'/>
          </TouchableOpacity>

          <View style={styles.separator} />

          <Image source={require('@/assets/images/miscellaneous/header.png')} style={styles.image}/>

          <Text style={styles.creditText}>
            Made with ❤ by William Cagas
          </Text>
        </View>

        
      </View>

      
    </SafeAreaView>
    
  )
}

const styles = StyleSheet.create({
  creditText: {
    fontFamily: 'mon-sb', 
    fontSize: 13,
    alignSelf: 'center',
    color: Colours.grey,
  },
  image: {
    width: 175,
    height: 40,
    marginTop: 175,
    alignSelf: 'center',
    marginRight: 7.5
  },
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: '#fff',
    paddingHorizontal: 15
  },
  header: {
    fontFamily: 'mon-b',
    fontSize: 24
  },
  subheader: {
    fontFamily: 'mon-sb',
    fontSize: 16
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E0E0E0', 
    right: 0, 
    width: '100%', 
    alignSelf: 'center'
  },
  animatedContainer: {
    overflow: 'hidden',
    gap: 15
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