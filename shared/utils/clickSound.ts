export const clickSound = () => {
  const clickSoundRoute = '/assets/sounds/click1.wav';
  const audio = new Audio(clickSoundRoute);
  audio.volume = 0.1;
  audio.play();
};

export const winSound = () => {
  const clickSoundRoute = '/assets/pages/games/dice/sfx/win.mp3';
  const audio = new Audio(clickSoundRoute);
  audio.volume = 0.15;
  audio.play();
};

export const basicSounds = ['/assets/sounds/click1.wav'];

export class AudioBuilder {
  public audioLinks: string[];
  private audioContext: AudioContext | null = null;
  private audioBuffers: AudioBuffer[] = [];
  private gainNodeRef: GainNode | null = null;

  constructor(audioLinks: string[]) {
    this.audioLinks = audioLinks;
  }

  // public loadAudio = async () => {
  //     if (!this.audioContext) {
  //         this.audioContext = new AudioContext()
  //         this.gainNodeRef = this.audioContext.createGain()
  //         this.gainNodeRef.connect(this.audioContext.destination)
  //     }

  //     try {
  //         const audioBuffers = await Promise.all(
  //             this.audioLinks.map(async (audioLink) => {
  //                 const response = await fetch(audioLink)
  //                 const arrayBuffer = await response.arrayBuffer()
  //                 if (!this.audioContext) {
  //                     throw new Error("AudioContext is not initialized");
  //                 }
  //                 const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
  //                 this.audioBuffers.push(audioBuffer);
  //             })
  //         )

  //     } catch (error) {
  //         console.error("Error loading audio:", error)
  //     }
  // }

  public setVolume = (volume: number) => {
    if (!this.gainNodeRef) return;
    this.gainNodeRef.gain.value = volume;
  };

  public playSound = (index: number) => {
    if (!this.audioContext) return;
    const source = this.audioContext.createBufferSource();
    source.buffer = this.audioBuffers[index];

    if (this.gainNodeRef) source.connect(this.gainNodeRef);
    else source.connect(this.audioContext.destination);

    source.start();
  };
}

export interface AudioLink {
  name: string;
  link: string;
  pitch?: number;
  pitchRange?: number[];
  audioMultiplier?: number;
}

interface AudioBufferName {
  name: string;
  buffer: AudioBuffer;
  pitch: number | null;
  pitchRange: number[] | null;
}

export const basicSounds2 = [
  { name: 'click', link: '/assets/sounds/click1.wav' },
  { name: 'changeMode', link: '/assets/sounds/changeMode.mp3' },
  { name: 'clickySound', link: '/assets/sounds/clickySound.mp3' }
];
export class AudioBuilderImproved {
  public audioLinks: AudioLink[];
  private audioContext: AudioContext | null = null;
  private audioBuffers: AudioBufferName[] = [];
  private gainNodeRef: GainNode | null = null;
  private detuneValue: number = 0;

  constructor(audioLinks: AudioLink[]) {
    this.audioLinks = audioLinks;
  }

  public loadAudio = async () => {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
      this.gainNodeRef = this.audioContext.createGain();
      this.gainNodeRef.connect(this.audioContext.destination);
    }

    try {
      this.audioBuffers = [];

      await Promise.all(
        this.audioLinks.map(async audioLink => {
          const response = await fetch(audioLink.link);
          const arrayBuffer = await response.arrayBuffer();
          if (!this.audioContext) {
            throw new Error('AudioContext is not initialized');
          }

          const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
          this.audioBuffers.push({
            name: audioLink.name,
            buffer: audioBuffer,
            pitch: audioLink.pitch || null,
            pitchRange: audioLink.pitchRange || null
          });
        })
      );
    } catch (error) {
      console.error('Error loading audio:', error);
    }
  };

  public setVolume = (volume: number) => {
    if (!this.gainNodeRef) return;
    this.gainNodeRef.gain.value = volume;
  };

  public set pitch(ratio: number) {
    if (ratio <= 0) {
      console.error('El ratio de pitch debe ser mayor que 0.');
      return;
    }
    this.detuneValue = ratio === 1 ? 0 : 1200 * Math.log2(ratio);
  }

  private pitchFormula = (ratio: number) => {
    if (ratio <= 0) {
      console.error('El ratio de pitch debe ser mayor que 0.');
      return 0;
    }
    return ratio === 1 ? 0 : 1200 * Math.log2(ratio);
  };

  public playSound = (name: string) => {
    if (!this.audioContext) return;

    const source = this.audioContext.createBufferSource();
    const selectedAudio = this.audioBuffers.find(audioBuffer => audioBuffer.name === name);
    source.buffer = selectedAudio?.buffer || null;

    if (!source.buffer) {
      console.error('Sound not found:', name);
      return;
    }

    if (selectedAudio?.pitch) {
      source.detune.value = this.pitchFormula(selectedAudio.pitch);
    } else if (selectedAudio?.pitchRange) {
      const [minPitch, maxPitch] = selectedAudio.pitchRange;
      const selectedRange = Math.random() * (maxPitch - minPitch) + minPitch;

      source.detune.value = this.pitchFormula(selectedRange);
    } else {
      source.detune.value = this.detuneValue;
    }

    if (this.gainNodeRef) {
      source.connect(this.gainNodeRef);
    } else {
      source.connect(this.audioContext.destination);
    }

    source.start();
  };
}
