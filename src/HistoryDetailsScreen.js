import { useNavigation } from '@react-navigation/native';
import { Button } from '@rneui/themed';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('historydb.db');

export default function HistoryDetailsScreen({ route }) {
  const { workout } = route.params;
  const [isDeleting, setIsDeleting] = useState(false);
  const navigation = useNavigation();

  const deleteItem = () => {
  Alert.alert(
    "Confirm Delete",
    "Are you sure you want to delete this workout?",
    [{
      text: "Cancel",
      onPress: () => setIsDeleting(false),
    },
    {
      text: "Delete",
      onPress: () => {
        db.transaction(tx => {
          tx.executeSql('DELETE FROM workout_history where id = ?;', [workout.id],
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
      <Text>{workout.date} </Text>
      <Text>{`${Math.floor(workout.elapsed_time / 60)
          .toString()
          .padStart(2, '0')}:${(workout.elapsed_time % 60).toString().padStart(2, '0')}`}</Text>
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