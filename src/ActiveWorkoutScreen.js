import React, { useEffect, useRef, useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CheckBox } from '@rneui/themed';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';

const historydb = SQLite.openDatabase('historydb.db');

export default function ActiveWorkoutScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [workout, setWorkout] = useState(route.params.workout);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [completedSets, setCompletedSets] = useState([]);
  const intervalRef = useRef(null);

  const handleStart = () => {
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleReset = () => {
    setElapsedTime(0);
    setCompletedSets([]);
  };

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setElapsedTime((prevElapsedTime) => prevElapsedTime + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [isPaused]);

  const handleSetComplete = (setIndex) => {
    const updatedCompletedSets = [...completedSets];
    updatedCompletedSets[setIndex] = true;
    setCompletedSets(updatedCompletedSets);
  };

  const saveAndQuit = () => {
    const workoutName = workout.name;
    const exercises = JSON.parse(workout.exercises)
    const elapsedTimeInSeconds = elapsedTime;
    const day = (new Date().getDate()).toString();
    const month = (new Date().getMonth() + 1).toString();
    const year = (new Date().getFullYear()).toString();
    const date = day + "." + month + "." + year

    historydb.transaction((tx) => {
      tx.executeSql('INSERT INTO workout_history (name, exercises, elapsed_time, date) VALUES (?, ?, ?, ?);',
      [workoutName, JSON.stringify(exercises), elapsedTimeInSeconds, date]);
    });

    navigation.goBack();
  }

  const savingError = () => {
    Alert.alert(
      "Error saving the workout",
      "Clear the memory and try again.",
      [{
        text: "OK"
      }]
    )
  }

  const handleFinishWorkout = () => {
    Alert.alert(
      'Confirm Finish',
      'Are you sure you want to finish the workout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Finish',
          onPress: () => {
            saveAndQuit();
          },
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>{workout.name}</Text>
        <Text style={{fontSize: 20, marginBottom: 5, color: "#808080"}}>{`${Math.floor(elapsedTime / 60)
          .toString()
          .padStart(2, '0')}:${(elapsedTime % 60).toString().padStart(2, '0')}`}</Text>
        {JSON.parse(workout.exercises).map((exercise, exerciseIndex) => (
          <View key={exercise.id}>
            <Text style={styles.subtitle}>{exercise.name}</Text>
            <Text style={styles.setInfo}>Sets    Kg    Reps</Text>
            {exercise.sets.map((set, setIndex) => (
              <View key={setIndex} style={styles.sets}>
                <Text style={styles.setNumber}>  {setIndex+1}       </Text>
                <Text style={styles.setInfo}>{`${set.weight}  x   ${set.reps}`}</Text>
                <CheckBox
                  checked={completedSets[exerciseIndex * exercise.sets.length + setIndex]}
                  onPress={() => handleSetComplete(exerciseIndex * exercise.sets.length + setIndex)}
                />
              </View>
            ))}
          </View>
        ))}
        <View>
          <View>
            <Button title={isPaused ? 'Resume' : 'Start'} onPress={handleStart} disabled={elapsedTime > 0} />
            <Button title={isPaused ? 'Pause' : 'Stop'} onPress={handlePause} />
            <Button title="Reset" onPress={handleReset} />
          </View>
          <Button title="Finish Workout" onPress={handleFinishWorkout} />
        </View>
      </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  list: {
    flex: 1,
    width: 300,
  },
  title: {
    fontSize: 32,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 24,
    marginBottom: 5,
  },
  sets: {
    flexDirection: "row",
  },
  setNumber: {
    fontSize: 18,
    marginTop: 5
  },
  setInfo: {
    marginTop: 5,
    fontSize: 18,
    marginBottom: 8
  }
});
