import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

export default function HomeScreen({ navigation }) {
  const [timers, setTimers] = useState([]);

  const loadTimers = async () => {
    const storedTimers = await AsyncStorage.getItem("timers");
    setTimers(storedTimers ? JSON.parse(storedTimers) : []);
  };

  useFocusEffect(
    React.useCallback(() => {
      loadTimers();
    }, [])
  );

  const groupedTimers = timers.reduce((acc, timer) => {
    if (!acc[timer.category]) acc[timer.category] = [];
    acc[timer.category].push(timer);
    return acc;
  }, {});

  const sections = Object.keys(groupedTimers).map((category) => ({
    title: category,
    data: groupedTimers[category],
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Timers</Text>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.timerCard}>
            <Text style={styles.timerName}>{item.name}</Text>
            <Text style={styles.timerInfo}>
              Remaining Time: {item.remainingTime}s
            </Text>
            <Text style={styles.timerInfo}>
              Status: {item.status || "Paused"}
            </Text>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Start</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Pause</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Reset</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
      />

      <Button
        title="Go to Add Timer"
        onPress={() => navigation.navigate("AddTimer")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
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
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    paddingVertical: 10,
    marginBottom: 5,
    borderRadius: 5,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    padding: 10,
    backgroundColor: "#000",
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});
