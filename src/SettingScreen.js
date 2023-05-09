import { Alert, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import * as SQLite from 'expo-sqlite';
import { Button } from '@rneui/themed';

const db = SQLite.openDatabase('workout_templates.db');
const historydb = SQLite.openDatabase('historydb.db');

export default function SettingScreen() {
  const clearTemplates = () => {
    db.transaction((tx) => {
      tx.executeSql("DROP TABLE workout_templates;")
    }),
    db.transaction((tx) => {
      tx.executeSql("CREATE TABLE IF NOT EXISTS workout_templates (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, exercises TEXT);");
    });

    Alert.alert(
      "Success",
      "Workout templates cleared.",
      [{
        text: "Ok"
      }]
    )
  }

  const templateConfirm = () => {
    Alert.alert(
      "Confirm your choise",
      "Are you sure you want to clear your workout templates?",
      [{
        text: "Cancel",
       style: "cancel"
        
      },
      {
        text: "Clear",
        onPress: () => {
          clearTemplates();
        },
        style: "destructive"
      }]
    )
  }

  const clearHistory = () => {
    const clearTemplates = () => {
      historydb.transaction((tx) => {
        tx.executeSql("DROP TABLE workout_history;")
      }),
      historydb.transaction((tx) => {
        tx.executeSql("CREATE TABLE IF NOT EXISTS workout_history (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, exercises TEXT);");
      });
  
      Alert.alert(
        "Success",
        "Workout history cleared.",
        [{
          text: "Ok"
        }]
      )
    }
  }

  const historyConfirm = () => {
    Alert.alert(
      "Confirm your choise",
      "Are you sure you want to clear your workout history?",
      [{
        text: "Cancel",
       style: "cancel"
        
      },
      {
        text: "Clear",
        onPress: () => {
          clearHistory();
        },
        style: "destructive"
      }]
    )
  }


  return (
    <View style={styles.container}>
      <Text style={styles.title} >Clearing data:</Text>
      <View style={styles.button}>
        <Button title="Workout templates" onPress={templateConfirm} />
        <Button title="Workout history" onPress={historyConfirm} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    marginBottom: 5,
  },
  button: {
    justifyContent: "space-around"
  },
});
