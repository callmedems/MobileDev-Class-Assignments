import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { MusicPlayer } from '@/components/music-player';
import { SongList } from '@/components/song-list';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAudio } from '@/contexts/AudioContext';
import { getAllSongs, Song } from '@/database/database';

export default function MusicScreen() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentSong } = useAudio();

  useEffect(() => {
    loadSongs();
  }, []);

  const loadSongs = async () => {
    try {
      const allSongs = await getAllSongs();
      setSongs(allSongs);
    } catch (error) {
      console.error('Error loading songs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <ThemedText style={styles.loadingText}>Cargando música...</ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons name="musical-notes" size={32} color="#4CAF50" />
          <ThemedText type="title">Música del Parque</ThemedText>
        </View>
        <ThemedText style={styles.subtitle}>
          {songs.length} canciones disponibles
        </ThemedText>
      </ThemedView>

      {/* Song List */}
      <View style={[styles.listWrapper, currentSong && styles.listWithPlayer]}>
        <SongList songs={songs} />
      </View>

      {/* Music Player */}
      {currentSong && <MusicPlayer />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    opacity: 0.7,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  listWrapper: {
    flex: 1,
  },
  listWithPlayer: {
    marginBottom: 0,
  },
});
