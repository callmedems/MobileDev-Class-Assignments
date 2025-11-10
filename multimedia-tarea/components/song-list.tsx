import { useAudio } from '@/contexts/AudioContext';
import { Song } from '@/database/database';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SongListProps {
  songs: Song[];
}

export function SongList({ songs }: SongListProps) {
  const { currentSong, isPlaying, playSong, pauseSong, setPlaylist } = useAudio();

  React.useEffect(() => {
    setPlaylist(songs);
  }, [songs]);

  const handleSongPress = async (song: Song) => {
    if (currentSong?.id === song.id) {
      if (isPlaying) {
        await pauseSong();
      } else {
        await playSong(song);
      }
    } else {
      await playSong(song);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderSongItem = ({ item }: { item: Song }) => {
    const isCurrentSong = currentSong?.id === item.id;
    const isCurrentlyPlaying = isCurrentSong && isPlaying;

    return (
      <TouchableOpacity
        style={[styles.songItem, isCurrentSong && styles.songItemActive]}
        onPress={() => handleSongPress(item)}>
        <Image source={{ uri: item.imageUrl }} style={styles.albumImage} />
        
        <View style={styles.songDetails}>
          <Text style={[styles.songTitle, isCurrentSong && styles.textActive]} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={[styles.artistName, isCurrentSong && styles.textActiveSecondary]} numberOfLines={1}>
            {item.artist}
          </Text>
          <Text style={styles.albumName} numberOfLines={1}>
            {item.album}
          </Text>
        </View>

        <View style={styles.songActions}>
          <Text style={styles.duration}>{formatDuration(item.duration)}</Text>
          <Ionicons
            name={isCurrentlyPlaying ? 'pause-circle' : 'play-circle'}
            size={32}
            color={isCurrentSong ? '#4CAF50' : '#666'}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={songs}
      renderItem={renderSongItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.listContainer}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 8,
  },
  songItem: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
  },
  songItemActive: {
    backgroundColor: '#E8F5E9',
  },
  albumImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
    marginRight: 12,
  },
  songDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  songTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  artistName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  albumName: {
    fontSize: 12,
    color: '#999',
  },
  textActive: {
    color: '#2E7D32',
  },
  textActiveSecondary: {
    color: '#4CAF50',
  },
  songActions: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  duration: {
    fontSize: 12,
    color: '#999',
  },
  separator: {
    height: 8,
  },
});
