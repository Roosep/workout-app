import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, ScrollView, Alert} from 'react-native';
import { Input } from '@rneui/themed';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('workout_templates.db');

export default function AddWorkoutScreen() {
  const [workoutName, setWorkoutName] = useState('');
  const [exercises, setExercises] = useState([
    { name: '', sets: [{ weight: '', reps: '' }]}]
    );

  const addExercise = () => {
    setExercises([...exercises, { name: '', sets: [{ weight: '', reps: '' }] }]);
  };

  const addSet = (exerciseIndex) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].sets.push({ weight: '', reps: '' });
    setExercises(newExercises);
  };

  const updateExerciseName = (exerciseIndex, newName) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].name = newName;
    setExercises(newExercises);
  };

  const updateSet = (exerciseIndex, setIndex, weight, reps) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].sets[setIndex] = { weight, reps };
    setExercises(newExercises);
  };

  const savingError = () => {
    Alert.alert(
      "Error saving the template",
      "Check the input fields and try again.",
      [{
        text: "OK"
      }]
    )
  }

  const savingSuccess = () => {
    setWorkoutName("");
    setExercises([{ name: '', sets: [{ weight: '', reps: '' }]}])
    Alert.alert(
      "Workout Saved",
      "Successfully saved " + workoutName + ".",
      [{
        text: "OK"
      }]
    )
  }

  const saveWorkoutTemplate = () => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          'INSERT INTO workout_templates (name, exercises) VALUES (?, ?);',
          [workoutName, JSON.stringify(exercises)],
        );
      }, savingError, 
      savingSuccess(workoutName)
    );
  };

  return (
    <ScrollView>
     <View style={styles.container}>
      <Text style={styles.label}>Workout Name</Text>
      <Input
        style={styles.input}
        value={workoutName}
        onChangeText={setWorkoutName}
      />
      {exercises.map((exercise, exerciseIndex) => (
        <View key={exerciseIndex}>
          <Text style={styles.label}>Exercise Name</Text>
          <Input
            style={styles.input}
            value={exercise.name}
            onChangeText={(newName) =>
              updateExerciseName(exerciseIndex, newName)
            }
          />
          {exercise.sets.map((set, setIndex) => (
            <View key={setIndex} style={styles.sets}>
              <Text style={styles.setLabel}>Set {setIndex + 1}</Text>
              <Input
                style={styles.input}
                containerStyle={{width: 150}}
                label="Weight (kg)"
                placeholder="0"
                keyboardType="numeric"
                value={set.weight}
                onChangeText={(weight) =>
                  updateSet(exerciseIndex, setIndex, weight, set.reps)
                }
              />
              <Input
                style={styles.input}
                containerStyle={{width: 150}}
                label="Reps"
                placeholder="0"
                keyboardType="numeric"
                value={set.reps}
                onChangeText={(reps) =>
                  updateSet(exerciseIndex, setIndex, set.weight, reps)
                }
              />
            </View>
          ))}
          <Button title="Add Set" onPress={() => addSet(exerciseIndex)} containerStyle={{marginVertical: 5}} />
        </View>
        ))}
        <Button title="Add Exercise" onPress={addExercise} containerStyle={{marginVertical: 5}} />
        <Button title="Save Template" onPress={saveWorkoutTemplate} containerStyle={{marginVertical: 5}} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
  },
  sets: {
    flexDirection: "row",
  },
  setLabel: {
    fontSize: 18,
    marginTop: 32,
  },
});