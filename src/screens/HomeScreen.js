import React, { useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {

  const [timers, setTimers] = useState([
    { id: '1', name: 'Workout Timer', duration: '30s', category: 'Workout' },
    { id: '2', name: 'Study Timer', duration: '60s', category: 'Study' },
    { id: '3', name: 'Break Timer', duration: '15s', category: 'Break' },
  ]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Timers</Text>

      <FlatList
        data={timers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.timerCard}>
            <Text style={styles.timerName}>{item.name}</Text>
            <Text style={styles.timerInfo}>Duration: {item.duration}</Text>
            <Text style={styles.timerInfo}>Category: {item.category}</Text>
          </View>
        )}
      />

      <Button title="Go to Add Timer" onPress={() => navigation.navigate('AddTimer')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  timerCard: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  timerName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  timerInfo: { fontSize: 14, color: '#666', marginTop: 5 },
});
