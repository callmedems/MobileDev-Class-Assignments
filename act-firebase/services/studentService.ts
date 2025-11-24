import { database } from '@/config/firebase';
import { Student, StudentInput, ValidationResult } from '@/types/student';
import { off, onValue, orderByChild, push, query, ref, set } from 'firebase/database';
import { logger } from './logger';

/**
 * Student service for Firebase CRUD operations
 * Implements best practices: error handling, validation, logging
 */
class StudentService {
  private readonly COLLECTION_PATH = 'students';

  /**
   * Validate student input
   */
  validateStudent(input: StudentInput): ValidationResult {
    const errors: string[] = [];

    if (!input.matricula || input.matricula.trim().length === 0) {
      errors.push('La matrícula es requerida');
    }

    if (!input.nombre || input.nombre.trim().length === 0) {
      errors.push('El nombre es requerido');
    }

    if (!input.semestre || input.semestre.trim().length === 0) {
      errors.push('El semestre es requerido');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Create a new student record
   */
  async createStudent(input: StudentInput): Promise<Student> {
    try {
      // Validate input
      const validation = this.validateStudent(input);
      if (!validation.isValid) {
        const errorMessage = validation.errors.join(', ');
        await logger.error('Validation failed', { errors: validation.errors });
        throw new Error(errorMessage);
      }

      // Create reference
      const studentsRef = ref(database, this.COLLECTION_PATH);
      const newStudentRef = push(studentsRef);

      // Prepare student data
      const student: Student = {
        id: newStudentRef.key!,
        matricula: input.matricula.trim(),
        nombre: input.nombre.trim(),
        semestre: input.semestre.trim(),
        createdAt: Date.now()
      };

      // Save to Firebase
      await set(newStudentRef, student);
      await logger.success('Student created', { id: student.id, matricula: student.matricula });

      return student;
    } catch (error: any) {
      await logger.error('Error creating student', { error: error.message });
      throw error;
    }
  }

  /**
   * Subscribe to real-time updates of all students
   * Returns unsubscribe function
   */
  subscribeToStudents(callback: (students: Student[]) => void): () => void {
    try {
      const studentsRef = query(
        ref(database, this.COLLECTION_PATH),
        orderByChild('createdAt')
      );

      const listener = onValue(
        studentsRef,
        (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const students: Student[] = Object.values(data);
            // Sort by createdAt descending (newest first)
            students.sort((a, b) => b.createdAt - a.createdAt);
            callback(students);
            logger.info(`Received ${students.length} students from Firebase`);
          } else {
            callback([]);
            logger.info('No students found in database');
          }
        },
        (error) => {
          logger.error('Error subscribing to students', { error: error.message });
          callback([]);
        }
      );

      // Return unsubscribe function
      return () => {
        off(studentsRef);
        logger.info('Unsubscribed from students');
      };
    } catch (error: any) {
      logger.error('Error setting up subscription', { error: error.message });
      return () => {};
    }
  }

  /**
   * Get students once (no real-time updates)
   */
  async getStudents(): Promise<Student[]> {
    try {
      return new Promise((resolve, reject) => {
        const studentsRef = ref(database, this.COLLECTION_PATH);
        
        onValue(
          studentsRef,
          (snapshot) => {
            const data = snapshot.val();
            if (data) {
              const students: Student[] = Object.values(data);
              students.sort((a, b) => b.createdAt - a.createdAt);
              resolve(students);
            } else {
              resolve([]);
            }
          },
          (error) => {
            logger.error('Error getting students', { error: error.message });
            reject(error);
          },
          { onlyOnce: true }
        );
      });
    } catch (error: any) {
      await logger.error('Error in getStudents', { error: error.message });
      throw error;
    }
  }
}

// Export singleton instance
export const studentService = new StudentService();
