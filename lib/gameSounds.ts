import { Audio } from 'expo-av';

let yanivSound: Audio.Sound | null = null;
let assafSound: Audio.Sound | null = null;
let stickSound: Audio.Sound | null = null;
let pickSound: Audio.Sound | null = null;
let flickSound: Audio.Sound | null = null;

export async function loadGameSounds(): Promise<void> {
  try {
    await Audio.setAudioModeAsync({
      // Keep SFX audible on iOS even when hardware mute switch is on.
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });

    const loadOne = async (label: string, asset: number): Promise<Audio.Sound | null> => {
      try {
        const { sound } = await Audio.Sound.createAsync(asset);
        return sound;
      } catch (err) {
        console.warn(`[SFX] Failed to load ${label}:`, err);
        return null;
      }
    };

    // Load each SFX independently so one missing file does not disable all sounds.
    yanivSound = await loadOne('yaniv.wav', require('../assets/sounds/yaniv.wav'));
    assafSound = await loadOne('assaf.wav', require('../assets/sounds/assaf.wav'));
    stickSound = await loadOne('stick.wav', require('../assets/sounds/stick.wav'));
    pickSound = await loadOne('pick.mp3', require('../assets/sounds/pick.mp3'));
    flickSound = await loadOne('flick.mp3', require('../assets/sounds/flick.mp3'));
  } catch (e) {
    console.warn('Failed to load game sounds:', e);
  }
}

export function playYaniv(on: boolean): void {
  if (!on || !yanivSound) return;
  yanivSound.replayAsync().catch(() => {});
}

export function playAssaf(on: boolean): void {
  if (!on || !assafSound) return;
  assafSound.replayAsync().catch(() => {});
}

export function playStick(on: boolean): void {
  if (!on || !stickSound) return;
  stickSound.replayAsync().catch(() => {});
}

export function playPick(on: boolean): void {
  if (!on || !pickSound) return;
  pickSound.replayAsync().catch(() => {});
}

export function playFlick(on: boolean): void {
  if (!on || !flickSound) return;
  flickSound.replayAsync().catch(() => {});
}
