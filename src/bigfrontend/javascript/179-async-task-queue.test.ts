import { describe, it, expect } from 'vitest';
import { AsyncTaskQueue } from './179-async-task-queue.better-big-o.ts';

describe('AsyncTaskQueue', () => {
  it('executes the promises in correct order', async () => {
    const queue = new AsyncTaskQueue(2); // Allow up to 2 tasks to run concurrently

    const executionLog: string[] = [];

    // Example async tasks
    const task1 = () => {
      executionLog.push('task1 started');
      return new Promise((resolve) => {
        setTimeout(() => {
          executionLog.push('task1 finished');
          resolve('Task 1 done');
        }, 1000);
      });
    };
    const task2 = () => {
      executionLog.push('task2 started');
      return new Promise((_resolve, reject) => {
        setTimeout(() => {
          executionLog.push('task2 finished');
          reject('Task 2 failed');
        }, 500);
      });
    };
    const task3 = () => {
      executionLog.push('task3 started');
      return new Promise((resolve) => {
        setTimeout(() => {
          executionLog.push('task3 finished');
          resolve('Task 3 done');
        }, 200);
      });
    };

    // Queue tasks
    queue.queue(task1); // Starts immediately
    queue.queue(task2); // Starts immediately (concurrency = 2)
    queue.queue(task3); // Waits until one of the first two tasks completes

    // Wait enough time for all tasks to complete
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Verify execution order
    expect(executionLog).toHaveLength(6);

    // task1 and task2 start immediately
    expect(executionLog[0]).toBe('task1 started');
    expect(executionLog[1]).toBe('task2 started');

    // task2 finishes first (after 500ms)
    expect(executionLog[2]).toBe('task2 finished');

    // task3 starts only after task2 finishes
    expect(executionLog[3]).toBe('task3 started');

    // task3 finishes (200ms after it started)
    expect(executionLog[4]).toBe('task3 finished');

    // task1 finishes last (1000ms total)
    expect(executionLog[5]).toBe('task1 finished');
  });
});
