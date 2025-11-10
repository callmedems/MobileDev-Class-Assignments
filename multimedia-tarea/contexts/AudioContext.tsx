import { Song } from '@/database/database';
import { Audio, AVPlaybackStatus } from 'expo-av';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface AudioContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  position: number;
  duration: number;
  playSong: (song: Song) => Promise<void>;
  pauseSong: () => Promise<void>;
  resumeSong: () => Promise<void>;
  stopSong: () => Promise<void>;
  nextSong: () => Promise<void>;
  previousSong: () => Promise<void>;
  seekTo: (position: number) => Promise<void>;
  setPlaylist: (songs: Song[]) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playlist, setPlaylist] = useState<Song[]>([]);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis || 0);
      setIsPlaying(status.isPlaying);

      if (status.didJustFinish) {
        nextSong();
      }
    }
  };

  const playSong = async (song: Song) => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: song.audioUrl },
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );

      setSound(newSound);
      setCurrentSong(song);
      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing song:', error);
    }
  };

  const pauseSong = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };

  const resumeSong = async () => {
    if (sound) {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  const stopSong = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
      setPosition(0);
    }
  };

  const nextSong = async () => {
    if (!currentSong || playlist.length === 0) return;

    const currentIndex = playlist.findIndex((s) => s.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % playlist.length;
    await playSong(playlist[nextIndex]);
  };

  const previousSong = async () => {
    if (!currentSong || playlist.length === 0) return;

    const currentIndex = playlist.findIndex((s) => s.id === currentSong.id);
    const previousIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
    await playSong(playlist[previousIndex]);
  };

  const seekTo = async (positionMs: number) => {
    if (sound) {
      await sound.setPositionAsync(positionMs);
    }
  };

  return (
    <AudioContext.Provider
      value={{
        currentSong,
        isPlaying,
        position,
        duration,
        playSong,
        pauseSong,
        resumeSong,
        stopSong,
        nextSong,
        previousSong,
        seekTo,
        setPlaylist,
      }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
