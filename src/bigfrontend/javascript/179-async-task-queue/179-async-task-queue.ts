// https://bigfrontend.dev/problem/async-task-queue

type PromiseFactory = () => Promise<unknown>;

export class AsyncTaskQueue {
  private readonly concurrency: number;

  private allTasksQueue: PromiseFactory[] = [];

  private activeTasksQueue: Set<PromiseFactory> = new Set();

  constructor(concurrency: number) {
    this.concurrency = concurrency;
    this.addToActiveTasksQueue = this.addToActiveTasksQueue.bind(this);
  }

  queue(task: PromiseFactory) {
    this.allTasksQueue.push(task);
    this.startProcessingTasksFromTheQueue();
  }

  private addToActiveTasksQueue(task: PromiseFactory) {
    this.activeTasksQueue.add(task);
    task()
      .catch(() => {
        /* mute the error */
      })
      .finally(() => {
        this.removeFromActiveTasksQueue(task);
      });
  }

  private removeFromActiveTasksQueue(task: PromiseFactory) {
    this.activeTasksQueue.delete(task);
    this.startProcessingTasksFromTheQueue();
  }

  private startProcessingTasksFromTheQueue() {
    const countTasksToExecute = this.concurrency - this.activeTasksQueue.size;
    const tasksToAdd = this.allTasksQueue.splice(0, countTasksToExecute);
    tasksToAdd.forEach(this.addToActiveTasksQueue);
  }
}
