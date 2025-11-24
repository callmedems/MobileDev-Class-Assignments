import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { logger } from '@/services/logger';
import { studentService } from '@/services/studentService';
import { Student } from '@/types/student';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';

/**
 * Student List Screen
 * Displays all students with real-time updates using FlatList
 * Implements best practices: FlatList for performance, real-time sync, pull-to-refresh
 */
export default function StudentListScreen() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    //real-time updates
    const unsubscribe = studentService.subscribeToStudents((updatedStudents) => {
      setStudents(updatedStudents);
      setIsLoading(false);
      setIsRefreshing(false);
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  /**
   * Handle pull-to-refresh
   */
  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await logger.info('Manual refresh triggered');
      // The subscription will automatically update the data
      setTimeout(() => setIsRefreshing(false), 1000);
    } catch (error) {
      setIsRefreshing(false);
    }
  };

  /**
   * Render individual student item
   */
  const renderStudentItem = ({ item, index }: { item: Student; index: number }) => (
    <ThemedView style={styles.studentCard}>
      <View style={styles.cardHeader}>
        <ThemedText style={styles.studentMatricula}>{item.matricula}</ThemedText>
        <View style={styles.semestreBadge}>
          <ThemedText style={styles.semestreBadgeText}>
            Semestre {item.semestre}
          </ThemedText>
        </View>
      </View>
      <ThemedText style={styles.studentName}>{item.nombre}</ThemedText>
    </ThemedView>
  );

  /**
   * Render empty state
   */
  const renderEmptyState = () => (
    <ThemedView style={styles.emptyState}>
      <ThemedText style={styles.emptyStateTitle}>No hay estudiantes</ThemedText>
      <ThemedText style={styles.emptyStateText}>
        Estudiantes guardados aparecerán aquí
      </ThemedText>
    </ThemedView>
  );

  /**
   * Render loading state
   */
  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5E35B1" />
        <ThemedText style={styles.loadingText}>Cargando estudiantes...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Estudiantes
        </ThemedText>
        <View style={styles.countBadge}>
          <ThemedText style={styles.countBadgeText}>
            {students.length} {students.length === 1 ? 'estudiante' : 'estudiantes'}
          </ThemedText>
        </View>
      </ThemedView>

      {/* Student List */}
      <FlatList
        data={students}
        renderItem={renderStudentItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#5E35B1']}
            tintColor="#5E35B1"
          />
        }
        showsVerticalScrollIndicator={false}
      />

    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  countBadge: {
    backgroundColor: '#5E35B1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  countBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 20,
    paddingTop: 10,
  },
  studentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  studentMatricula: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5E35B1',
  },
  semestreBadge: {
    backgroundColor: '#E8EAF6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  semestreBadgeText: {
    fontSize: 12,
    color: '#5E35B1',
    fontWeight: '600',
  },
  studentName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: '#000',
  },
  timestamp: {
    fontSize: 12,
    opacity: 0.6,
    color: '#000',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    opacity: 0.7,
  },
  realtimeIndicator: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  realtimeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginRight: 8,
  },
  realtimeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
