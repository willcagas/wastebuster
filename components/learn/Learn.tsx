import { Colours } from '@/constants/Colours';
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl, Linking } from 'react-native';

interface EcoProduct {
  name: string;
  description: string;
}

interface Guide {
  title: string;
  snippet: string;
  link: string;
}

interface Quiz {
  title: string;
  questions: number;
}

const ecoFacts: string[] = [
  "Recycling one aluminum can saves enough energy to run a TV for three hours.",
  "A single tree can absorb 10 pounds of air pollutants a year.",
]

const guides: Guide[] = [
  { title: "A Beginner’s Guide to Zero Waste in Hamilton", snippet: "The term ‘zero waste’ is frequently thrown around as a buzzword online but what does it actually mean?", link: "https://greenventure.ca/a-beginners-guide-to-zero-waste-in-hamilton/" },
  { title: "All About Waste in the Fashion Industry", snippet: "Explore fast fashion and it's effects", link: "https://greenventure.ca/all-about-waste-in-the-fashion-industry/"},
];

const plans: Guide[] = [
  { title: "A Beginner’s Guide to Zero Waste in Hamilton", snippet: "The term ‘zero waste’ is frequently thrown around as a buzzword online but what does it actually mean?", link: "https://greenventure.ca/a-beginners-guide-to-zero-waste-in-hamilton/" },
  { title: "All About Waste in the Fashion Industry", snippet: "Explore fast fashion and it's effects", link: "https://greenventure.ca/all-about-waste-in-the-fashion-industry/"},
];

const quizzes: Quiz[] = [
  { title: "Recycling Basics", questions: 10 },
  { title: "Climate Change Facts", questions: 15 },
];

const LearnTab: React.FC = () => {
  const [fact, setFact] = useState<string>('');
  const [product, setProduct] = useState<EcoProduct | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false)

  // REFRESH
  const onRefresh = useCallback(async () => {
    setRefreshing(true)

    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false)
  }, [])

  useEffect(() => {
    
    setFact(ecoFacts[Math.floor(Math.random() * ecoFacts.length)]);
  }, []);

  return (
    <ScrollView 
        style={styles.container}
        refreshControl={
            <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colours.secondary}
            colors={[Colours.primary]} 
            progressBackgroundColor="#fff"
            />
        }
    >
      <View style={[styles.separator, {marginTop: 0}]} />

      <Text style={styles.sectionTitle}>Eco-Fact of the Day</Text>
      <Text style={styles.factText}>{fact}</Text>

      <View style={styles.separator} />

      <Text style={styles.sectionTitle}>Sustainability Guides</Text>
      {guides.map((guide, index) => (
        <TouchableOpacity key={index} style={styles.guideItem} onPress={() => Linking.openURL(guide.link)}> 
          <Text style={styles.guideTitle}>{guide.title}</Text>
          <Text style={styles.guideSnippet}>{guide.snippet}</Text>
        </TouchableOpacity>
      ))}

      <View style={styles.separator} />

      <Text style={styles.sectionTitle}>Environmental Plans & Strategies</Text>
      {plans.map((plan, index) => (
        <TouchableOpacity key={index} style={styles.guideItem} onPress={() => Linking.openURL(plan.link)}> 
          <Text style={styles.guideTitle}>{plan.title}</Text>
          <Text style={styles.guideSnippet}>{plan.snippet}</Text>
        </TouchableOpacity>
      ))}

      <View style={styles.separator} />


      <Text style={styles.sectionTitle}>Eco-Quizzes</Text>
      {quizzes.map((quiz, index) => (
        <TouchableOpacity key={index} style={styles.quizItem}>
          <Text style={styles.quizTitle}>{quiz.title}</Text>
          <Text style={styles.quizQuestions}>{quiz.questions} questions</Text>
        </TouchableOpacity>
      ))}

      <View style={styles.separator} />

      <Text style={styles.sectionTitle}>Additional Resources</Text>
      <TouchableOpacity style={styles.resourceButton}>
        <Text style={styles.resourceButtonText}>Explore More</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff'
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E0E0E0', 
    right: 0,
    width: '100%', 
    alignSelf: 'center',
    marginTop: 30,
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  factText: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  productCard: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productDesc: {
    fontSize: 14,
  },
  guideItem: {
    marginBottom: 20,
  },
  guideTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  guideSnippet: {
    fontSize: 14,
  },
  quizItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  quizTitle: {
    fontSize: 16,
  },
  quizQuestions: {
    fontSize: 14,
    color: 'gray',
  },
  resourceButton: {
    backgroundColor: Colours.primary,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  resourceButtonText: {
    color: 'white',
    fontSize: 16,
  },
})

export default LearnTab
