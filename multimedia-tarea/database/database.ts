import * as SQLite from 'expo-sqlite';

export interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  imageUrl: string;
  audioUrl: string;
  duration: number;
}

let db: SQLite.SQLiteDatabase | null = null;

export async function initDatabase(): Promise<void> {
  try {
    db = await SQLite.openDatabaseAsync('music.db');
    
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS songs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        artist TEXT NOT NULL,
        album TEXT NOT NULL,
        imageUrl TEXT NOT NULL,
        audioUrl TEXT NOT NULL,
        duration INTEGER NOT NULL
      );
    `);

    // Verificar si ya hay datos
    const result = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM songs');
    
    // Si no hay canciones, insertar datos iniciales
    if (result && result.count === 0) {
      await insertInitialData();
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

async function insertInitialData(): Promise<void> {
  if (!db) return;

  const songs = [
    {
      title: 'Let It Snow',
      artist: 'Winter Collection',
      album: 'Winter Songs',
      imageUrl: 'https://picsum.photos/seed/snow/400/400',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      duration: 360
    },
    {
      title: 'Night Drive',
      artist: 'After Dark',
      album: 'Night Drive Compilation',
      imageUrl: 'https://picsum.photos/seed/night/400/400',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      duration: 344
    },
    {
      title: 'Out of Sight',
      artist: 'The Vision',
      album: 'Lost Tracks',
      imageUrl: 'https://picsum.photos/seed/sight/400/400',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      duration: 328
    },
    {
      title: 'Remember Me',
      artist: 'Echo Station',
      album: 'Memories',
      imageUrl: 'https://picsum.photos/seed/remember/400/400',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
      duration: 313
    },
    {
      title: 'The Sickest Man',
      artist: 'Strange Tales',
      album: 'Dark Stories',
      imageUrl: 'https://picsum.photos/seed/sick/400/400',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
      duration: 297
    },
    {
      title: 'Stereo Action',
      artist: 'Sound Unlimited',
      album: 'Best Hits',
      imageUrl: 'https://picsum.photos/seed/stereo/400/400',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
      duration: 281
    },
    {
      title: 'This Strange Effect',
      artist: 'Night Drive Compilation',
      album: 'Night Vibes',
      imageUrl: 'https://picsum.photos/seed/strange/400/400',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
      duration: 265
    },
    {
      title: 'Deep Inside Me',
      artist: 'The Naked Heroes',
      album: 'Hardrive',
      imageUrl: 'https://picsum.photos/seed/deep/400/400',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
      duration: 409
    },
  ];

  for (const song of songs) {
    await db.runAsync(
      'INSERT INTO songs (title, artist, album, imageUrl, audioUrl, duration) VALUES (?, ?, ?, ?, ?, ?)',
      song.title,
      song.artist,
      song.album,
      song.imageUrl,
      song.audioUrl,
      song.duration
    );
  }
}

export async function getAllSongs(): Promise<Song[]> {
  if (!db) {
    await initDatabase();
  }
  
  try {
    const songs = await db!.getAllAsync<Song>('SELECT * FROM songs ORDER BY id');
    return songs;
  } catch (error) {
    console.error('Error getting songs:', error);
    return [];
  }
}

export async function getSongById(id: number): Promise<Song | null> {
  if (!db) {
    await initDatabase();
  }

  try {
    const song = await db!.getFirstAsync<Song>('SELECT * FROM songs WHERE id = ?', id);
    return song || null;
  } catch (error) {
    console.error('Error getting song by id:', error);
    return null;
  }
}
