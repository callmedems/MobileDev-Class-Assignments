import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Log levels for categorizing log messages
 */
export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS'
}

/**
 * Log entry structure
 */
interface LogEntry {
  timestamp: number;
  level: LogLevel;
  message: string;
  data?: any;
}

const LOG_STORAGE_KEY = '@app_logs';
const MAX_LOGS = 100; // Keep only the last 100 logs

/**
 * Logger service for local logging with AsyncStorage
 * Implements best practices for error tracking and debugging
 */
class Logger {
  /**
   * Write a log entry
   */
  private async writeLog(level: LogLevel, message: string, data?: any): Promise<void> {
    try {
      const entry: LogEntry = {
        timestamp: Date.now(),
        level,
        message,
        data
      };

      // Also log to console for development
      const consoleMessage = `[${level}] ${message}`;
      switch (level) {
        case LogLevel.ERROR:
          console.error(consoleMessage, data || '');
          break;
        case LogLevel.WARN:
          console.warn(consoleMessage, data || '');
          break;
        default:
          console.log(consoleMessage, data || '');
      }

      // Store in AsyncStorage
      const existingLogs = await this.getLogs();
      const updatedLogs = [...existingLogs, entry].slice(-MAX_LOGS);
      await AsyncStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(updatedLogs));
    } catch (error) {
      console.error('Failed to write log:', error);
    }
  }

  /**
   * Log info message
   */
  async info(message: string, data?: any): Promise<void> {
    await this.writeLog(LogLevel.INFO, message, data);
  }

  /**
   * Log warning message
   */
  async warn(message: string, data?: any): Promise<void> {
    await this.writeLog(LogLevel.WARN, message, data);
  }

  /**
   * Log error message
   */
  async error(message: string, data?: any): Promise<void> {
    await this.writeLog(LogLevel.ERROR, message, data);
  }

  /**
   * Log success message
   */
  async success(message: string, data?: any): Promise<void> {
    await this.writeLog(LogLevel.SUCCESS, message, data);
  }

  /**
   * Get all logs from storage
   */
  async getLogs(): Promise<LogEntry[]> {
    try {
      const logs = await AsyncStorage.getItem(LOG_STORAGE_KEY);
      return logs ? JSON.parse(logs) : [];
    } catch (error) {
      console.error('Failed to get logs:', error);
      return [];
    }
  }

  /**
   * Clear all logs
   */
  async clearLogs(): Promise<void> {
    try {
      await AsyncStorage.removeItem(LOG_STORAGE_KEY);
      console.log('Logs cleared successfully');
    } catch (error) {
      console.error('Failed to clear logs:', error);
    }
  }

  /**
   * Get logs as formatted string for display
   */
  async getLogsAsString(): Promise<string> {
    const logs = await this.getLogs();
    return logs.map(log => {
      const date = new Date(log.timestamp).toLocaleString();
      return `[${date}] [${log.level}] ${log.message}${log.data ? '\n' + JSON.stringify(log.data, null, 2) : ''}`;
    }).join('\n\n');
  }
}

// Export singleton instance
export const logger = new Logger();
