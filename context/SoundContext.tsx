import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';

const STORAGE_MUSIC = 'sound:musicOn';
const STORAGE_SFX = 'sound:sfxOn';

type SoundContextValue = {
  musicOn: boolean;
  setMusicOn: (on: boolean) => void;
  sfxOn: boolean;
  setSfxOn: (on: boolean) => void;
};

const SoundContext = createContext<SoundContextValue | undefined>(undefined);

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [musicOn, setMusicOnState] = useState(true);
  const [sfxOn, setSfxOnState] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [soundReady, setSoundReady] = useState(false);
  const bgMusicRef = useRef<Audio.Sound | null>(null);
  const isMusicLoadedRef = useRef(false);

  // Load preferences from AsyncStorage
  useEffect(() => {
    (async () => {
      try {
        const [m, s] = await Promise.all([
          AsyncStorage.getItem(STORAGE_MUSIC),
          AsyncStorage.getItem(STORAGE_SFX),
        ]);
        if (m !== null) setMusicOnState(m === 'true');
        if (s !== null) setSfxOnState(s === 'true');
      } catch (_) {}
      setLoaded(true);
    })();
  }, []);

  // Load background music once (do not play until settings + sound are ready)
  useEffect(() => {
    let isMounted = true;
    const loadBackgroundMusic = async () => {
      if (isMusicLoadedRef.current) return;
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
        });
        const { sound } = await Audio.Sound.createAsync(
          require('../assets/sounds/tropy.mp3'),
          { isLooping: true, volume: 0.3 }
        );
        if (isMounted) {
          bgMusicRef.current = sound;
          isMusicLoadedRef.current = true;
          setSoundReady(true);
        }
      } catch (e) {
        console.warn('Failed to load background music:', e);
      }
    };
    loadBackgroundMusic();
    return () => {
      isMounted = false;
    };
  }, []);

  // Play/stop background music per setting (only after prefs and sound are loaded)
  useEffect(() => {
    if (!loaded || !soundReady) return;
    const sound = bgMusicRef.current;
    if (!sound) return;

    if (musicOn) {
      sound.playAsync().catch(() => {});
    } else {
      sound.pauseAsync().catch(() => {});
    }
  }, [musicOn, loaded, soundReady]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (bgMusicRef.current) {
        bgMusicRef.current.unloadAsync().catch(() => {});
      }
    };
  }, []);

  const setMusicOn = (on: boolean) => {
    setMusicOnState(on);
    AsyncStorage.setItem(STORAGE_MUSIC, String(on)).catch(() => {});
  };

  const setSfxOn = (on: boolean) => {
    setSfxOnState(on);
    AsyncStorage.setItem(STORAGE_SFX, String(on)).catch(() => {});
  };

  const value: SoundContextValue = {
    musicOn,
    setMusicOn,
    sfxOn,
    setSfxOn,
  };

  if (!loaded) {
    return null;
  }

  return (
    <SoundContext.Provider value={value}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound(): SoundContextValue {
  const ctx = useContext(SoundContext);
  if (ctx === undefined) {
    throw new Error('useSound must be used within SoundProvider');
  }
  return ctx;
}
