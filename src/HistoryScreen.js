import { StyleSheet, View } from 'react-native';
import React, { useCallback, useEffect, useState, } from 'react';
import * as SQLite from 'expo-sqlite';
import { ListItem } from '@rneui/themed';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Button } from '@rneui/base';

const db = SQLite.openDatabase("historydb.db");

export default function HistoryScreen() {
  const [workouts, setWorkouts] = useState([]);
  const navigation = useNavigation();

  const fetchWorkouts = useCallback(() => {
    db.transaction((tx) => {
      tx.executeSql("SELECT * from workout_history;", [], (_, {rows}) => 
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
            <ListItem.Subtitle>{workout.date}</ListItem.Subtitle>
            <ListItem.Subtitle>{`${Math.floor(workout.elapsed_time / 60)
          .toString()
          .padStart(2, '0')}:${(workout.elapsed_time % 60).toString().padStart(2, '0')}`}</ListItem.Subtitle>
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
