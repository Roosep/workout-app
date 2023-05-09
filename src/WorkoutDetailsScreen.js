import { useNavigation } from '@react-navigation/native';
import { Button } from '@rneui/themed';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('workout_templates.db');

export default function WorkoutDetailsScreen({ route }) {
  const { workout } = route.params;
  const [isDeleting, setIsDeleting] = useState(false);
  const navigation = useNavigation();

  const deleteItem = () => {
  Alert.alert(
    "Confirm Delete",
    "Are you sure you want to delete " + workout.name +"?",
    [{
      text: "Cancel",
      onPress: () => setIsDeleting(false),
    },
    {
      text: "Delete",
      onPress: () => {
        db.transaction(tx => {
          tx.executeSql('delete from workout_templates where id = ?;', [workout.id],
          () => {
            setIsDeleting(false);
            navigation.goBack();
          });
        });
      },
    }]
  );
  }

  const startWorkout = () => {
    navigation.navigate("Active Workout", { workout });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{workout.name}</Text>
      <Text style={styles.subtitle}>Exercises:</Text>
      {JSON.parse(workout.exercises).map((exercise) => (
        <View key={exercise.id}>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          {exercise.sets.map((set) => (
            <Text key={set.id} style={styles.setText}>    {`${set.weight} kg x ${set.reps} reps`}</Text>
          ))}
        </View>
      ))}
      <View style={styles.Button}>
        <Button 
          title="Start Workout" 
          containerStyle={{marginVertical: 5}}
          onPress={startWorkout}
        />
        <Button 
          color="error" 
          title="Delete Workout" 
          onPress={deleteItem}
          containerStyle={{marginVertical: 5}}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 24,
    marginBottom: 10,
  },
  exerciseName: {
    fontSize: 20,
    marginBottom: 5,
  },
  setText: {
    fontSize: 16,
    marginBottom: 5,
  }, 
  Button: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 5
  }
});