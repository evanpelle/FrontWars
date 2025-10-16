import { Howl } from "howler";
import end from "../../../proprietary/sounds/music/es_end.mp3";
import epic from "../../../proprietary/sounds/music/es_epic.mp3";
import frontwars from "../../../proprietary/sounds/music/frontwars.mp3";
import coinSound from "../../../resources/sounds/effects/coin.mp3";

export enum SoundEffect {
  KaChing = "gemstone",
}

class SoundManager {
  private backgroundMusic: Howl[] = [];
  private currentTrack: number = 0;
  private soundEffects: Map<SoundEffect, Howl> = new Map();
  private soundEffectsVolume: number = 1;
  private backgroundMusicVolume: number = 0;

  constructor() {
    this.backgroundMusic = [
      new Howl({
        src: [frontwars],
        loop: false,
        onend: this.playNext.bind(this),
        volume: 0,
      }),
      new Howl({
        src: [end],
        loop: false,
        onend: this.playNext.bind(this),
        volume: 0,
      }),
      new Howl({
        src: [epic],
        loop: false,
        onend: this.playNext.bind(this),
        volume: 0,
      }),
    ];
    this.loadSoundEffect(SoundEffect.KaChing, coinSound);
  }

  public playBackgroundMusic(): void {
    if (
      this.backgroundMusic.length > 0 &&
      !this.backgroundMusic[this.currentTrack].playing()
    ) {
      this.backgroundMusic[this.currentTrack].play();
    }
  }

  public stopBackgroundMusic(): void {
    if (this.backgroundMusic.length > 0) {
      this.backgroundMusic[this.currentTrack].stop();
    }
  }

  public setBackgroundMusicVolume(volume: number): void {
    this.backgroundMusicVolume = Math.max(0, Math.min(1, volume));
    this.backgroundMusic.forEach((track) => {
      track.volume(this.backgroundMusicVolume);
    });
  }

  private playNext(): void {
    this.currentTrack = (this.currentTrack + 1) % this.backgroundMusic.length;
    this.playBackgroundMusic();
  }

  public loadSoundEffect(name: SoundEffect, src: string): void {
    if (!this.soundEffects.has(name)) {
      const sound = new Howl({
        src: [src],
        volume: this.soundEffectsVolume,
      });
      this.soundEffects.set(name, sound);
    }
  }

  public playSoundEffect(name: SoundEffect): void {
    const sound = this.soundEffects.get(name);
    if (sound) {
      sound.play();
    }
  }

  public setSoundEffectsVolume(volume: number): void {
    this.soundEffectsVolume = Math.max(0, Math.min(1, volume));
    this.soundEffects.forEach((sound) => {
      sound.volume(this.soundEffectsVolume);
    });
  }

  public stopSoundEffect(name: SoundEffect): void {
    const sound = this.soundEffects.get(name);
    if (sound) {
      sound.stop();
    }
  }

  public unloadSoundEffect(name: SoundEffect): void {
    const sound = this.soundEffects.get(name);
    if (sound) {
      sound.unload();
      this.soundEffects.delete(name);
    }
  }
}

export default new SoundManager();
