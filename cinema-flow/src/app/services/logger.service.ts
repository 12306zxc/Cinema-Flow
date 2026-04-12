import { Injectable } from '@angular/core';

/**
 * LoggerService - 日志服务
 *
 * 功能：提供统一的日志记录功能，包含时间戳
 * 特性：所有日志输出带时间戳，便于调试和追踪
 */
@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  /**
   * 记录日志
   * @param message 日志消息
   */
  log(message: string): void {
    console.log(`[${new Date().toLocaleTimeString()}] ${message}`);
  }
}
