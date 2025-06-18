/**
 * Advanced Voice Isolation and Processing Utilities
 * Includes noise reduction, voice activity detection, and speaker verification
 */

interface VoiceProfile {
  id: string;
  name: string;
  voicePrint: Float32Array;
  confidence: number;
  createdAt: Date;
}

interface VoiceActivityResult {
  isVoiceDetected: boolean;
  confidence: number;
  noiseLevel: number;
  speechRatio: number;
}

export class VoiceIsolationProcessor {
  private audioContext: AudioContext | null = null;
  private analyserNode: AnalyserNode | null = null;
  private gainNode: GainNode | null = null;
  private noiseGateNode: GainNode | null = null;
  private voiceProfiles: VoiceProfile[] = [];
  private currentVoiceProfile: VoiceProfile | null = null;
  
  // Configurable parameters
  private readonly NOISE_GATE_THRESHOLD = -50; // dB
  private readonly VOICE_ACTIVITY_THRESHOLD = 0.3;
  private readonly NOISE_REDUCTION_FACTOR = 0.7;
  private readonly SPEAKER_VERIFICATION_THRESHOLD = 0.75;

  constructor() {
    this.loadVoiceProfiles();
  }

  /**
   * Initialize audio processing pipeline with noise reduction
   */
  async initializeAudioProcessing(stream: MediaStream): Promise<MediaStream> {
    try {
      this.audioContext = new AudioContext({ sampleRate: 16000 });
      
      // Create audio processing nodes
      const source = this.audioContext.createMediaStreamSource(stream);
      this.analyserNode = this.audioContext.createAnalyser();
      this.gainNode = this.audioContext.createGain();
      this.noiseGateNode = this.audioContext.createGain();
      
      // Configure analyser for voice detection
      this.analyserNode.fftSize = 2048;
      this.analyserNode.smoothingTimeConstant = 0.3;
      
      // Create noise reduction filter
      const biquadFilter = this.audioContext.createBiquadFilter();
      biquadFilter.type = 'highpass';
      biquadFilter.frequency.setValueAtTime(85, this.audioContext.currentTime); // Remove low-frequency noise
      biquadFilter.Q.setValueAtTime(1, this.audioContext.currentTime);
      
      // Connect audio pipeline
      source.connect(biquadFilter);
      biquadFilter.connect(this.noiseGateNode);
      this.noiseGateNode.connect(this.gainNode);
      this.gainNode.connect(this.analyserNode);
      
      // Create output stream
      const destination = this.audioContext.createMediaStreamDestination();
      this.analyserNode.connect(destination);
      
      // Start noise gate processing
      this.startNoiseGateProcessing();
      
      return destination.stream;
    } catch (error) {
      console.error('Error initializing audio processing:', error);
      return stream; // Fallback to original stream
    }
  }

  /**
   * Real-time noise gate to reduce background noise
   */
  private startNoiseGateProcessing(): void {
    if (!this.analyserNode || !this.noiseGateNode) return;

    const processAudio = () => {
      const bufferLength = this.analyserNode!.frequencyBinCount;
      const dataArray = new Float32Array(bufferLength);
      this.analyserNode!.getFloatTimeDomainData(dataArray);
      
      // Calculate RMS (root mean square) for volume level
      let rms = 0;
      for (let i = 0; i < bufferLength; i++) {
        rms += dataArray[i] * dataArray[i];
      }
      rms = Math.sqrt(rms / bufferLength);
      
      // Convert to dB
      const dB = 20 * Math.log10(rms);
      
      // Apply noise gate
      if (dB < this.NOISE_GATE_THRESHOLD) {
        // Below threshold - reduce gain significantly
        this.noiseGateNode!.gain.setValueAtTime(0.1, this.audioContext!.currentTime);
      } else {
        // Above threshold - allow normal audio
        this.noiseGateNode!.gain.setValueAtTime(1.0, this.audioContext!.currentTime);
      }
      
      requestAnimationFrame(processAudio);
    };
    
    processAudio();
  }

  /**
   * Advanced voice activity detection
   */
  detectVoiceActivity(): VoiceActivityResult {
    if (!this.analyserNode || !this.audioContext) {
      return {
        isVoiceDetected: false,
        confidence: 0,
        noiseLevel: 0,
        speechRatio: 0
      };
    }

    const bufferLength = this.analyserNode.frequencyBinCount;
    const frequencyData = new Float32Array(bufferLength);
    const timeData = new Float32Array(bufferLength);
    
    try {
      this.analyserNode.getFloatFrequencyData(frequencyData);
      this.analyserNode.getFloatTimeDomainData(timeData);
    } catch (error) {
      console.error('Error getting audio data:', error);
      return {
        isVoiceDetected: false,
        confidence: 0,
        noiseLevel: 0,
        speechRatio: 0
      };
    }
    
    // Analyze frequency spectrum for voice characteristics
    const voiceFreqRange = this.getVoiceFrequencyPower(frequencyData);
    const totalPower = this.getTotalPower(frequencyData);
    const speechRatio = voiceFreqRange / Math.max(totalPower, 0.001);
    
    // Calculate zero crossing rate (indicator of voiced speech)
    const zcr = this.calculateZeroCrossingRate(timeData);
    
    // Spectral centroid (brightness indicator)
    const spectralCentroid = this.calculateSpectralCentroid(frequencyData);
    
    // Voice activity confidence based on multiple features
    let confidence = 0;
    confidence += speechRatio > 0.3 ? 0.4 : 0;
    confidence += zcr > 0.05 && zcr < 0.15 ? 0.3 : 0; // Typical range for speech
    confidence += spectralCentroid > 1000 && spectralCentroid < 4000 ? 0.3 : 0;
    
    const isVoiceDetected = confidence >= this.VOICE_ACTIVITY_THRESHOLD;
    const noiseLevel = totalPower - voiceFreqRange;
    
    return {
      isVoiceDetected,
      confidence,
      noiseLevel,
      speechRatio
    };
  }

  /**
   * Extract voice features for speaker identification
   */
  private extractVoiceFeatures(): Float32Array | null {
    if (!this.analyserNode || !this.audioContext) return null;

    const bufferLength = this.analyserNode.frequencyBinCount;
    const frequencyData = new Float32Array(bufferLength);
    
    try {
      this.analyserNode.getFloatFrequencyData(frequencyData);
    } catch (error) {
      console.error('Error extracting voice features:', error);
      return null;
    }
    
    // Extract mel-frequency cepstral coefficients (MFCC) features
    const mfccFeatures = this.calculateMFCC(frequencyData);
    
    // Extract fundamental frequency and harmonics
    const f0Features = this.extractF0Features(frequencyData);
    
    // Combine features
    const features = new Float32Array(mfccFeatures.length + f0Features.length);
    features.set(mfccFeatures, 0);
    features.set(f0Features, mfccFeatures.length);
    
    return features;
  }

  /**
   * Create or update voice profile for speaker verification
   */
  async createVoiceProfile(userId: string, userName: string): Promise<boolean> {
    try {
      const features = this.extractVoiceFeatures();
      if (!features) return false;

      const voiceProfile: VoiceProfile = {
        id: userId,
        name: userName,
        voicePrint: features,
        confidence: 1.0,
        createdAt: new Date()
      };

      // Remove existing profile for this user
      this.voiceProfiles = this.voiceProfiles.filter(p => p.id !== userId);
      this.voiceProfiles.push(voiceProfile);
      this.currentVoiceProfile = voiceProfile;
      
      // Save to localStorage
      this.saveVoiceProfiles();
      
      return true;
    } catch (error) {
      console.error('Error creating voice profile:', error);
      return false;
    }
  }

  /**
   * Verify if current speaker matches known profile
   */
  verifySpeaker(): { isVerified: boolean; confidence: number; matchedProfile?: VoiceProfile } {
    const currentFeatures = this.extractVoiceFeatures();
    if (!currentFeatures || this.voiceProfiles.length === 0) {
      return { isVerified: false, confidence: 0 };
    }

    let bestMatch: VoiceProfile | null = null;
    let bestSimilarity = 0;

    // Compare with all known profiles
    for (const profile of this.voiceProfiles) {
      const similarity = this.calculateCosineSimilarity(currentFeatures, profile.voicePrint);
      if (similarity > bestSimilarity) {
        bestSimilarity = similarity;
        bestMatch = profile;
      }
    }

    const isVerified = bestSimilarity >= this.SPEAKER_VERIFICATION_THRESHOLD;
    
    return {
      isVerified,
      confidence: bestSimilarity,
      matchedProfile: bestMatch || undefined
    };
  }

  /**
   * Adaptive noise reduction based on environment
   */
  adaptiveNoiseReduction(noiseLevel: number): void {
    if (!this.gainNode) return;

    // Adjust gain based on detected noise level
    let reductionFactor = 1.0;
    
    if (noiseLevel > 0.1) {
      // High noise environment
      reductionFactor = 0.6;
    } else if (noiseLevel > 0.05) {
      // Medium noise environment
      reductionFactor = 0.8;
    }
    
    this.gainNode.gain.setValueAtTime(reductionFactor, this.audioContext?.currentTime || 0);
  }

  // Helper methods for audio analysis
  private getVoiceFrequencyPower(frequencyData: Float32Array): number {
    // Voice frequency range approximately 85Hz to 3400Hz
    const sampleRate = this.audioContext?.sampleRate || 16000;
    const binSize = sampleRate / (frequencyData.length * 2);
    
    const voiceStartBin = Math.floor(85 / binSize);
    const voiceEndBin = Math.floor(3400 / binSize);
    
    let voicePower = 0;
    for (let i = voiceStartBin; i < Math.min(voiceEndBin, frequencyData.length); i++) {
      voicePower += Math.pow(10, frequencyData[i] / 10);
    }
    
    return voicePower;
  }

  private getTotalPower(frequencyData: Float32Array): number {
    let totalPower = 0;
    for (let i = 0; i < frequencyData.length; i++) {
      totalPower += Math.pow(10, frequencyData[i] / 10);
    }
    return totalPower;
  }

  private calculateZeroCrossingRate(timeData: Float32Array): number {
    let crossings = 0;
    for (let i = 1; i < timeData.length; i++) {
      if ((timeData[i] >= 0) !== (timeData[i - 1] >= 0)) {
        crossings++;
      }
    }
    return crossings / timeData.length;
  }

  private calculateSpectralCentroid(frequencyData: Float32Array): number {
    let weightedSum = 0;
    let magnitudeSum = 0;
    
    for (let i = 0; i < frequencyData.length; i++) {
      const magnitude = Math.pow(10, frequencyData[i] / 10);
      weightedSum += i * magnitude;
      magnitudeSum += magnitude;
    }
    
    return magnitudeSum > 0 ? weightedSum / magnitudeSum : 0;
  }

  private calculateMFCC(frequencyData: Float32Array): Float32Array {
    // Simplified MFCC calculation (normally this would be more complex)
    const numCoefficients = 13;
    const mfcc = new Float32Array(numCoefficients);
    
    // Apply mel filterbank and DCT transform (simplified)
    const melFilters = this.createMelFilterbank(frequencyData.length);
    
    for (let i = 0; i < numCoefficients; i++) {
      let sum = 0;
      for (let j = 0; j < melFilters.length; j++) {
        sum += Math.log(Math.max(melFilters[j] * Math.pow(10, frequencyData[j] / 10), 1e-10)) * Math.cos((i * (j + 0.5) * Math.PI) / melFilters.length);
      }
      mfcc[i] = sum;
    }
    
    return mfcc;
  }

  private extractF0Features(frequencyData: Float32Array): Float32Array {
    // Extract fundamental frequency features (simplified)
    const f0Features = new Float32Array(4);
    const sampleRate = this.audioContext?.sampleRate || 16000;
    const binSize = sampleRate / (frequencyData.length * 2);
    
    // Find peak in voice frequency range
    let maxBin = 0;
    let maxValue = -Infinity;
    
    const startBin = Math.floor(85 / binSize);
    const endBin = Math.floor(400 / binSize);
    
    for (let i = startBin; i < Math.min(endBin, frequencyData.length); i++) {
      if (frequencyData[i] > maxValue) {
        maxValue = frequencyData[i];
        maxBin = i;
      }
    }
    
    const f0 = maxBin * binSize;
    f0Features[0] = f0;
    f0Features[1] = maxValue;
    f0Features[2] = f0 * 2; // Second harmonic
    f0Features[3] = f0 * 3; // Third harmonic
    
    return f0Features;
  }

  private createMelFilterbank(fftSize: number): Float32Array {
    // Simplified mel filterbank creation
    const numFilters = 26;
    const filterbank = new Float32Array(numFilters);
    
    for (let i = 0; i < numFilters; i++) {
      filterbank[i] = Math.exp(-0.5 * Math.pow((i - numFilters / 2) / (numFilters / 4), 2));
    }
    
    return filterbank;
  }

  private calculateCosineSimilarity(a: Float32Array, b: Float32Array): number {
    if (a.length !== b.length) return 0;
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    
    const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
    return magnitude > 0 ? dotProduct / magnitude : 0;
  }

  private saveVoiceProfiles(): void {
    try {
      const profilesData = this.voiceProfiles.map(profile => ({
        ...profile,
        voicePrint: Array.from(profile.voicePrint) // Convert Float32Array to regular array for JSON
      }));
      localStorage.setItem('voiceProfiles', JSON.stringify(profilesData));
    } catch (error) {
      console.error('Error saving voice profiles:', error);
    }
  }

  private loadVoiceProfiles(): void {
    try {
      const saved = localStorage.getItem('voiceProfiles');
      if (saved) {
        const profilesData = JSON.parse(saved);
        this.voiceProfiles = profilesData.map((profile: any) => ({
          ...profile,
          voicePrint: new Float32Array(profile.voicePrint), // Convert back to Float32Array
          createdAt: new Date(profile.createdAt)
        }));
      }
    } catch (error) {
      console.error('Error loading voice profiles:', error);
      this.voiceProfiles = [];
    }
  }

  /**
   * Clean up audio processing resources
   */
  cleanup(): void {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.analyserNode = null;
    this.gainNode = null;
    this.noiseGateNode = null;
  }
}

// Export singleton instance
export const voiceProcessor = new VoiceIsolationProcessor(); 