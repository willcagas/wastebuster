import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const About = () => {
  return (
    <View style={styles.container}>
      <Text>About</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 17.5, 
    paddingTop: 20,
    borderRadius: 25,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: {
        width: 1,
        height: 1
    }
  }
})

export default About