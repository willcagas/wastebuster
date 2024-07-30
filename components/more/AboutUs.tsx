import { View, Text, StyleSheet, ScrollView, Linking,TouchableOpacity } from 'react-native'
import React from 'react'
import { AntDesign, Feather, FontAwesome5, Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'

const About = () => {
  return (
    <SafeAreaView edges={['bottom']} style={{ paddingBottom: 50 }}>
      <ScrollView style={styles.container}>
        <View style={{gap: 20}}>
          <Text style={styles.header}>About Us</Text>

          <Text style={styles.description}>
          We are Green Venture, an environmental non-profit based in Hamilton, Ontario. 
          Originally developed by a team of youth in the York Region, this app was first emulated 
          for Hamilton by Kevin and Afra, 2 high school co-op students. The database was 
          compiled by a class of Grade 7/8 students at Spring Valley Elementary, who we would 
          like to thank for their contribution and interest.
          </Text>

          <Text style={styles.description}>
            As of August 2024, the app has been fully redeveloped and modernized by new coop students, William and Phoenix.
            William worked on implementing front-end technologies such as React Native and Expo.
            Phoenix used his skills in UI/UX to come up with prototypes and design components 
            within the app using Figma.
          </Text>

          <View style={styles.separator} />

          <Text style={styles.description}>
          Our goal is to address the worsening issue of overconsumption. 
          The current model of our economy often creates and promotes short-lasting and 
          single use items. But we want to help encourage a circular economy, where one item 
          can be reused, repurposed and recycled several time to reduce the amount of waste we produce.
          </Text>
          
          <Text style={styles.description}>
          We brought this app to Hamilton Region to help people to find circular 
          solutions for their unwanted items that are accessible and sustainable. 
          </Text>

          <Text style={styles.description}>
            Please use it often, and share the message about circular economy and why it matters. 
            We all need to contribute to keep our planet healthy and prospering. Thank you!
          </Text>

          <View style={styles.separator} />

          <TouchableOpacity style={styles.button} onPress={() => Linking.openURL(`tel:9055408787`)}>
            <View style={styles.innerButton}>
              <FontAwesome5 name="phone-alt" size={22} color="black" />
              <Text style={styles.link}>Contact us at (905) 540-8787</Text>
            </View>
            
            <Feather name="arrow-up-right" size={20} color="black"/>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => Linking.openURL('https://www.instagram.com/green_venture/')}>
            <View style={styles.innerButton}>
              <AntDesign name="instagram" size={24} color="black" />
              <Text style={styles.link}>Follow us at @green_venture</Text>
            </View>
            
            <Feather name="arrow-up-right" size={20} color="black"/>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => Linking.openURL('https://greenventure.ca/')}>
            <View style={styles.innerButton}>
              <Ionicons name="globe-outline" size={25} color="black" />
              <Text style={styles.link}>Check us out at greenventure.ca</Text>
            </View>
            
            <Feather name="arrow-up-right" size={20} color="black"/>
          </TouchableOpacity>

          <View style={styles.separator} />

          <Text style={[styles.link, {alignSelf: 'center'}]}>
            Made with ❤ by William Cagas
          </Text>
          
        </View>
      </ScrollView>
    </SafeAreaView>
    
  )
}

const styles = StyleSheet.create({
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
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0', 
    right: 0, 
    width: '95%', 
    alignSelf: 'center'
  },
  description: {
    fontFamily: 'mon'
  },
  link: {
    fontFamily: 'mon-sb'
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