import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function HistoryScreen() {
  const historyData = [
    { id: "1", name: "Workout Timer", completionTime: "2023-08-25 10:30:00" },
    { id: "2", name: "Study Timer", completionTime: "2023-08-25 11:00:00" },
    { id: "3", name: "Break Timer", completionTime: "2023-08-25 12:30:00" },
    { id: "4", name: "Workout Timer", completionTime: "2023-08-25 14:00:00" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Timer History</Text>

      <FlatList
        data={historyData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.timerCard}>
            <Text style={styles.timerName}>{item.name}</Text>
            <Text style={styles.timerInfo}>
              Completion Time: {item.completionTime}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  timerCard: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  timerName: { fontSize: 18, fontWeight: "bold", color: "#333" },
  timerInfo: { fontSize: 14, color: "#666", marginTop: 5 },
});
