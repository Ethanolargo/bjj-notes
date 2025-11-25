import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moveInfo from '../data/moveInfo.json';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

export default function NewNoteScreen() {
  const [note, setNote] = useState('');
  const [move, setMove] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [info, setInfo] = useState('');
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      // Reset state when screen is focused
      setNote('');
      setMove('');
      setSubmitted(false);
      setInfo('');
    }, [])
  );

  const handleSubmit = async () => {
    const moveName = move.trim().toLowerCase();
    const moveDetails = (moveInfo as Record<string, string>)[moveName] || 'No info found';
    const entry = {
      date: new Date().toLocaleDateString(),
      note,
      move,
      info: moveDetails,
    };

    try {
      const stored = await AsyncStorage.getItem('bjjNotes');
      const notes = stored ? JSON.parse(stored) : [];
      notes.push(entry);
      await AsyncStorage.setItem('bjjNotes', JSON.stringify(notes));
      router.push('/journal');
    } catch (err) {
      console.error('Failed to save note:', err);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.wrapper}>
        <ScrollView contentContainerStyle={styles.container}>
          {!submitted ? (
            <>
              <Text style={styles.label}>What was the move of the day?</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter a move"
                placeholderTextColor="rgba(0,0,0,0.4)"
                value={move}
                onChangeText={setMove}
              />
              <Button title="Next" onPress={() => setSubmitted(true)} />
            </>
          ) : (
            <>
              <Text style={styles.label}>Notes?</Text>
              <TextInput
                style={styles.input}
                multiline
                placeholder="Type your note here..."
                placeholderTextColor="#000"
                value={note}
                onChangeText={setNote}
              />
              <Button title="Submit" onPress={handleSubmit} />

              <View style={styles.backButton}>
                <Button title="⬅ Back" color="#888" onPress={() => setSubmitted(false)} />
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 16,
    flexGrow: 1,
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    color: '#000',
    marginBottom: 16,
  },
  backButton: {
    marginTop: 16,
  },
});
