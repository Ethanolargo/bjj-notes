import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  GestureHandlerRootView,
  Swipeable,
} from 'react-native-gesture-handler';
import { ScrollView } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';

type NoteEntry = {
  date: string;
  move: string;
  info: string;
  note: string;
};

export default function JournalScreen() {
  const [notes, setNotes] = useState<NoteEntry[]>([]);
  const swipeableRefs = useRef<Swipeable[]>([]);

  const loadNotes = async () => {
    try {
      const stored = await AsyncStorage.getItem('bjjNotes');
      const parsed = stored ? JSON.parse(stored) : [];
      setNotes(parsed);
    } catch (err) {
      console.error('Failed to load notes:', err);
    }
  };

  const deleteNote = async (index: number) => {
    const updated = notes.filter((_, i) => i !== index);
    setNotes(updated);
    await AsyncStorage.setItem('bjjNotes', JSON.stringify(updated));
  };

  const clearNotes = async () => {
    try {
      await AsyncStorage.removeItem('bjjNotes');
      setNotes([]);
      alert('Journal cleared!');
    } catch (err) {
      console.error('Failed to clear journal:', err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [])
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.wrapper}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.header}>Note Entries</Text>
          {notes.length === 0 ? (
            <Text style={styles.noNotes}>No notes yet.</Text>
          ) : (
            notes.map((entry, index) => (
              <Swipeable
                key={`${entry.date}-${index}`}
                ref={(ref) => {
                  if (ref) swipeableRefs.current[index] = ref;
                }}
                friction={2}
                rightThreshold={40}
                onSwipeableOpen={() => deleteNote(index)}
                renderRightActions={() => (
                  <View style={styles.deleteBackground} />
                )}
              >
                <View style={styles.noteCard}>
                  <Text style={styles.date}>{entry.date}</Text>
                  <Text style={styles.move}>Move: {entry.move}</Text>
                  <Text style={styles.info}>Info: {entry.info}</Text>
                  <Text style={styles.note}>{entry.note}</Text>
                </View>
              </Swipeable>
            ))
          )}
          <View style={styles.clearButton}>
            <Button title="Clear Journal" color="red" onPress={clearNotes} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 16,
    paddingBottom: 80,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#000',
  },
  noNotes: {
    textAlign: 'center',
    fontSize: 16,
    color: '#000',
  },
  noteCard: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    marginBottom: 16,
    borderRadius: 10,
  },
  date: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#000',
  },
  move: {
    fontStyle: 'italic',
    marginBottom: 4,
    color: '#000',
  },
  info: {
    marginBottom: 4,
    color: '#000',
  },
  note: {
    color: '#000',
  },
  deleteBackground: {
    backgroundColor: 'red',
    flex: 1,
    borderRadius: 10,
    marginBottom: 16,
  },
  clearButton: {
    marginTop: 24,
    marginBottom: 16,
  },
});
