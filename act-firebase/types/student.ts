/**
 * Student data model
 * Represents a student record in the database
 */
export interface Student {
  id: string;
  matricula: string;
  nombre: string;
  semestre: string;
  createdAt: number;
}

/**
 * Student input for creating new records
 */
export interface StudentInput {
  matricula: string;
  nombre: string;
  semestre: string;
}

/**
 * Validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}
