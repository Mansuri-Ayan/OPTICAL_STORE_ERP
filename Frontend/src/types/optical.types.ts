/**
 * Optical domain types & optometric metrics
 */

export interface EyePower {
  sph: string | number;       // Sphere: e.g. -2.50 to +20.00 in 0.25 steps
  cyl: string | number;       // Cylinder: e.g. -0.75 to +6.00 in 0.25 steps
  axis: string | number;      // Axis: 0 to 180 degrees
  addPower?: string | number; // Addition: e.g. +1.50 for reading/presbyopia
  pd?: string | number;       // Pupillary Distance: monocular (e.g. 31mm) or binocular
  prism?: string | number;    // Prism diopters
  base?: 'BU' | 'BD' | 'BI' | 'BO' | ''; // Base direction: Base Up, Down, In, Out
}

export type LensType =
  | 'Single Vision'
  | 'Bifocal'
  | 'Progressive'
  | 'Blue Cut'
  | 'Photochromic'
  | 'Polarized'
  | 'Anti-Reflective'
  | 'Transition'
  | 'High-Index';

export type FramePreference =
  | 'Full Rim'
  | 'Half Rim'
  | 'Rimless'
  | 'Cat Eye'
  | 'Aviator'
  | 'Round'
  | 'Rectangle'
  | 'Wayfarer'
  | 'Oval'
  | 'Sports';

export type LensCoating =
  | 'Anti-Reflective'
  | 'Blue Light Filter'
  | 'UV Protection'
  | 'Scratch Resistant'
  | 'Anti-Fog'
  | 'Hydrophobic';

export interface Prescription {
  id?: string | number;
  customerId?: string | number;
  rightEye: EyePower;  // OD (Oculus Dexter)
  leftEye: EyePower;   // OS (Oculus Sinister)
  lensType?: LensType | string;
  framePreference?: FramePreference | string;
  lensCoating?: LensCoating | string;
  doctorName?: string;
  clinicName?: string;
  prescriptionDate?: string;
  notes?: string;
  created_at?: string;
}

export interface VisionDelta {
  rightEyeDiff: {
    sphDiff: number;
    cylDiff: number;
    summary: string;
  };
  leftEyeDiff: {
    sphDiff: number;
    cylDiff: number;
    summary: string;
  };
}
