import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Text,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AddTimerScreen({ navigation }) {
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [category, setCategory] = useState("Workout");

  const categories = ["Workout", "Study", "Break"]; 

  const saveTimer = async () => {
    if (!name || !duration) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
  
    const newTimer = {
      id: Math.random().toString(),
      name,
      duration: parseInt(duration),
      category,
      remainingTime: parseInt(duration),
      status: "Paused",
    };
  
    let timers = await AsyncStorage.getItem("timers");
    timers = timers ? JSON.parse(timers) : [];
  
    timers.push(newTimer);
  
    await AsyncStorage.setItem("timers", JSON.stringify(timers));
  
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Timer Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Duration (seconds)"
        keyboardType="numeric"
        value={duration}
        onChangeText={setDuration}
        style={styles.input}
      />

      <View style={styles.categoryContainer}>
        {categories.map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.categoryButton,
              category === item && styles.selectedCategory,
            ]}
            onPress={() => setCategory(item)}
          >
            <Text
              style={[
                styles.categoryText,
                category === item && styles.selectedCategoryText,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={saveTimer}>
        <Text style={styles.saveButtonText}>Save Timer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 15,
    marginVertical: 15,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  categoryButton: {
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    alignItems: "center",
    width: "25%",
  },
  selectedCategory: {
    backgroundColor: "#000",
  },
  categoryText: {
    fontSize: 16,
    color: "#333",
  },
  selectedCategoryText: {
    color: "#fff",
  },
  saveButton: {
    backgroundColor: "#000",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
});
