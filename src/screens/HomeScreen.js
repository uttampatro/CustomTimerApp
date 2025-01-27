import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  Alert,
  Button,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

export default function HomeScreen({ navigation }) {
  const [timers, setTimers] = useState([]);
  const timerRefs = useRef({});
  const [selectedCategory, setSelectedCategory] = useState("All");

  const loadTimers = async () => {
    const storedTimers = await AsyncStorage.getItem("timers");
    setTimers(storedTimers ? JSON.parse(storedTimers) : []);
  };

  useFocusEffect(
    React.useCallback(() => {
      loadTimers();
    }, [])
  );

  const saveTimersToStorage = async (updatedTimers) => {
    setTimers(updatedTimers);
    await AsyncStorage.setItem("timers", JSON.stringify(updatedTimers));
  };


  const saveCompletedTimer = async (timer) => {
    const history = await AsyncStorage.getItem("history");
    const historyData = history ? JSON.parse(history) : [];
    const completionTime = new Date().toISOString(); 

    historyData.push({ ...timer, completionTime });
    await AsyncStorage.setItem("history", JSON.stringify(historyData));
  };

  const startTimer = (id) => {
    const updatedTimers = timers.map((timer) => {
      if (timer.id === id && timer.status !== "Running") {
        timer.status = "Running";
        timerRefs.current[id] = setInterval(() => {
          updateTimer(id);
        }, 1000);
      }
      return timer;
    });
    saveTimersToStorage(updatedTimers);
  };

  const pauseTimer = (id) => {
    if (timerRefs.current[id]) {
      clearInterval(timerRefs.current[id]);
      delete timerRefs.current[id];
    }
    const updatedTimers = timers.map((timer) => {
      if (timer.id === id) {
        timer.status = "Paused";
      }
      return timer;
    });
    saveTimersToStorage(updatedTimers);
  };

  const resetTimer = (id) => {
    if (timerRefs.current[id]) {
      clearInterval(timerRefs.current[id]);
      delete timerRefs.current[id];
    }
    const updatedTimers = timers.map((timer) => {
      if (timer.id === id) {
        timer.status = "Paused";
        timer.remainingTime = timer.duration;
      }
      return timer;
    });
    saveTimersToStorage(updatedTimers);
  };

  const updateTimer = (id) => {
    setTimers((prevTimers) =>
      prevTimers.map((timer) => {
        if (timer.id === id && timer.remainingTime > 0) {
          timer.remainingTime -= 1;
          if (timer.remainingTime === 0) {
            timer.status = "Completed";
            clearInterval(timerRefs.current[id]);
            delete timerRefs.current[id];
            saveCompletedTimer(timer); // Save completed timer to history
            Alert.alert("Timer Completed", `Timer "${timer.name}" is done!`);
          }
        }
        return timer;
      })
    );
  };

  const groupedTimers = timers.reduce((acc, timer) => {
    if (!acc[timer.category]) acc[timer.category] = [];
    acc[timer.category].push(timer);
    return acc;
  }, {});

  const filteredTimers = selectedCategory === "All" ? timers : groupedTimers[selectedCategory] || [];

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Button
          title="Add Timer"
          onPress={() => navigation.navigate("AddTimer")}
        />
        <Text style={styles.title}>Timers</Text>
        <Button
          title="History"
          onPress={() => navigation.navigate("History")}
        />
      </View>
      <View style={styles.categoryContainer}>
        {["All", "Workout", "Study", "Break"].map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.selectedCategory,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.selectedCategoryText,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <SectionList
        sections={[
          {
            title: selectedCategory,
            data: filteredTimers,
          },
        ]}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const progress =
            item.duration > 0 ? (item.remainingTime / item.duration) * 100 : 0;

          return (
            <View style={styles.timerCard}>
              <Text style={styles.timerName}>{item.name}</Text>
              <Text style={styles.timerInfo}>
                Remaining Time: {item.remainingTime}s
              </Text>
              <Text style={styles.timerInfo}>
                Status: {item.status || "Paused"}
              </Text>

              <View style={styles.progressBar}>
                <View style={[styles.progress, { width: `${progress}%` }]} />
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => startTimer(item.id)}
                >
                  <Text style={styles.buttonText}>Start</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => pauseTimer(item.id)}
                >
                  <Text style={styles.buttonText}>Pause</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => resetTimer(item.id)}
                >
                  <Text style={styles.buttonText}>Reset</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
      />
    
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  categoryButton: {
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    alignItems: "center",
    width: "20%",
  },
  selectedCategory: {
    backgroundColor: "#000",
  },
  categoryText: {
    fontSize: 14,
    color: "#333",
  },
  selectedCategoryText: {
    color: "#fff",
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    paddingVertical: 10,
    marginBottom: 5,
    borderRadius: 5,
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
  progressBar: {
    height: 6,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    overflow: "hidden",
    marginVertical: 5,
  },
  progress: {
    height: "100%",
    backgroundColor: "#4CAF50",
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
