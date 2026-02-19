
export enum ParticleTemplate {
  HEARTS = 'HEARTS',
  FLOWERS = 'FLOWERS',
  SATURN = 'SATURN',
  FIREWORKS = 'FIREWORKS',
  GALAXY = 'GALAXY',
  DNA = 'DNA'
}

export interface HandGesture {
  isPinching: boolean;
  isOpen: boolean;
  isFist: boolean;
  palmX: number;
  palmY: number;
  palmZ: number;
  pinchStrength: number;
}

export interface ParticleConfig {
  color1: string;
  color2: string;
  size: number;
  density: number;
  expansion: number;
  speed: number;
}

export interface AIState {
  isProcessing: boolean;
  lastMessage: string;
}
