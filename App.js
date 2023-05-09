import { Alert, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProfileScreen from './src/ProfileScreen';
import HistoryScreen from './src/HistoryScreen';
import AddWorkoutScreen from './src/AddWorkoutScreen';
import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import * as SQLite from 'expo-sqlite';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WorkoutScreen from './src/WorkoutScreen';
import WorkoutDetailsScreen from './src/WorkoutDetailsScreen';
import ActiveWorkoutScreen from './src/ActiveWorkoutScreen';
import HistoryDetailsScreen from './src/HistoryDetailsScreen';
import SettingScreen from './src/SettingScreen';
import { Button } from '@rneui/themed';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const db = SQLite.openDatabase('workout_templates.db');
const historydb = SQLite.openDatabase('historydb.db');

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({color, size}) => {
            if (route.name === "Profile") {
                return <Ionicons name={"md-person"} size={size} color={color}/>;
            } else if (route.name === "Workouts") {
                return <MaterialCommunityIcons name="arm-flex" size={size} color={color} />;
            } else if (route.name === "History") {
                return <MaterialCommunityIcons name="clock" size={size} color={color} />;
            } else if (route.name === "Add Workout") {
              return <Ionicons name="add" size={size} color={color} />
            }
        }
      })}
    >
      <Tab.Screen name="Profile" component={ProfileNavigation} options={{ headerShown:false}}/>
      <Tab.Screen name="Workouts" component={WorkoutNavigation} options={{ headerShown:false}}/>
      <Tab.Screen name="History" component={HistoryNavigation} options={{ headerShown:false}}/>
      <Tab.Screen name="Add Workout" component={AddWorkoutScreen} />
    </Tab.Navigator>
  )
}

function ProfileNavigation() {
  const navigation = useNavigation();

  return(
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={ProfileScreen} options={{headerRight: () => (
        <Button type='clear' onPress={() =>  navigation.navigate("Settings")}><Ionicons name="md-settings" size={24} color="dodgerblue" /></Button>
      )}}/>
      <Stack.Screen name="Settings" component={SettingScreen} />
    </Stack.Navigator>
  )
}

function HistoryNavigation() {
  return(
    <Stack.Navigator>
      <Stack.Screen name="History" component={HistoryScreen} />
      <Stack.Screen name="Workout Details" component={HistoryDetailsScreen} />
    </Stack.Navigator>
  )
}

function WorkoutNavigation() {
  return(
    <Stack.Navigator>
      <Stack.Screen name="Workouts" component={WorkoutScreen} />
      <Stack.Screen name="Workout Details" component={WorkoutDetailsScreen} />
      <Stack.Screen name="Active Workout" component={ActiveWorkoutScreen} />
    </Stack.Navigator>
  )
}

export default function App() {
  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql("CREATE TABLE IF NOT EXISTS workout_templates (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, exercises TEXT);");
    }, tableError);
    historydb.transaction((tx) => {
      tx.executeSql("CREATE TABLE IF NOT EXISTS workout_history (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, exercises TEXT, elapsed_time INTEGER, date TEXT);");
    }, tableError);
  }, []);
  
  const tableError = () => {
    Alert.alert(
      "Error creating database file",
      "Try clearing the database from settings and restarting the app.",
      [{
        text: "Ok"
      }]
    )
  }
  
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
