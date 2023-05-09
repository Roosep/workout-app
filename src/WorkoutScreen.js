import { StyleSheet, View } from 'react-native';
import React, { useCallback, useEffect, useState, } from 'react';
import * as SQLite from 'expo-sqlite';
import { ListItem } from '@rneui/themed';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

const db = SQLite.openDatabase("workout_templates.db");

export default function WorkoutScreen() {
  const [workouts, setWorkouts] = useState([]);
  const navigation = useNavigation();

  const fetchWorkouts = useCallback(() => {
    db.transaction(tx => {
      tx.executeSql("select * from workout_templates;", [], (_, {rows}) => 
        setWorkouts(rows._array)
      );
    });
  }, []);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  useFocusEffect(
    useCallback(() => {
      fetchWorkouts();
    }, [fetchWorkouts]),
  );

  return (
    <View>
      {workouts.map((workout) => (
        <ListItem
          key={workout.id}
          bottomDivider
        >
          <ListItem.Content>
            <ListItem.Title>{workout.name}</ListItem.Title>
            {JSON.parse(workout.exercises).map((exercise) => (
              <View key={exercise.id}>
                <ListItem.Subtitle>{exercise.sets.length} x {exercise.name}</ListItem.Subtitle>
              </View>
            ))}
          </ListItem.Content>
          <ListItem.Chevron 
            size={30}
            onPress={() => navigation.navigate("Workout Details", {workout: workout})} />
        </ListItem>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  list: {
    flex: 1,
    width: 300,
  },
});
