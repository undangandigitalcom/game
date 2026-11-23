import * as Tone from 'tone';

// ==========================================
// SOUND ENGINE (TONE.JS SYNTHESIZER)
// Menghasilkan efek audio retro/arcade secara native
// tanpa memerlukan aset file audio eksternal
// ==========================================

export type SoundEffectType =
  | 'coin'
  | 'jump'
  | 'hit'
  | 'click'
  | 'win'
  | 'shield'
  | 'shoot'
  | 'upgrade'
  | 'combo';

class SoundEngine {
  private static instance: SoundEngine;
  private synth: Tone.PolySynth | null = null;
  public enabled: boolean = true;

  private constructor() {
    const saved = localStorage.getItem('gameinvite_sound');
    if (saved !== null) {
      this.enabled = saved === 'true';
    }
  }

  public static getInstance(): SoundEngine {
    if (!SoundEngine.instance) {
      SoundEngine.instance = new SoundEngine();
    }
    return SoundEngine.instance;
  }

  public toggle(): boolean {
    this.enabled = !this.enabled;
    localStorage.setItem('gameinvite_sound', String(this.enabled));
    if (this.enabled) {
      this.play('click');
    }
    return this.enabled;
  }

  private initSynth() {
    if (!this.synth && typeof window !== 'undefined') {
      try {
        this.synth = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: 'triangle' },
          envelope: { attack: 0.01, decay: 0.1, sustain: 0.1, release: 0.3 }
        }).toDestination();
        this.synth.volume.value = -8;
      } catch (e) {
        console.warn('AudioContext init warning:', e);
      }
    }
  }

  public async play(type: SoundEffectType) {
    if (!this.enabled) return;
    try {
      if (Tone.context.state !== 'running') {
        await Tone.start();
      }
      this.initSynth();
      if (!this.synth) return;

      const now = Tone.now();
      switch (type) {
        case 'coin':
          this.synth.triggerAttackRelease('B5', '32n', now);
          this.synth.triggerAttackRelease('E6', '16n', now + 0.06);
          break;
        case 'jump':
          this.synth.triggerAttackRelease('C4', '32n', now);
          this.synth.triggerAttackRelease('G4', '16n', now + 0.05);
          break;
        case 'hit':
          this.synth.triggerAttackRelease('G2', '8n', now);
          this.synth.triggerAttackRelease('C2', '8n', now + 0.08);
          break;
        case 'click':
          this.synth.triggerAttackRelease('C5', '32n', now);
          break;
        case 'win':
          ['C5', 'E5', 'G5', 'C6'].forEach((n, i) => {
            this.synth?.triggerAttackRelease(n, '8n', now + i * 0.11);
          });
          break;
        case 'shield':
          this.synth.triggerAttackRelease('A4', '16n', now);
          this.synth.triggerAttackRelease('D5', '16n', now + 0.07);
          this.synth.triggerAttackRelease('A5', '8n', now + 0.14);
          break;
        case 'shoot':
          this.synth.triggerAttackRelease('G5', '64n', now);
          break;
        case 'upgrade':
          ['D5', 'F#5', 'A5', 'D6'].forEach((n, i) => {
            this.synth?.triggerAttackRelease(n, '16n', now + i * 0.06);
          });
          break;
        case 'combo':
          this.synth.triggerAttackRelease('E5', '16n', now);
          this.synth.triggerAttackRelease('G#5', '16n', now + 0.07);
          this.synth.triggerAttackRelease('B5', '8n', now + 0.14);
          break;
      }
    } catch {
      // Audio errors are non-blocking
    }
  }
}

export const sound = SoundEngine.getInstance();
