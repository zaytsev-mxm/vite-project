// https://bigfrontend.dev/problem/async-task-queue

export class AsyncTaskQueue {
    private readonly concurrency: number;
    private allTasksQueue: Array<() => Promise<unknown>> = [];
    private queueHead: number = 0;  // Track the queue start position
    private runningTasksCount: number = 0;

    constructor(concurrency: number) {
        this.concurrency = concurrency;
    }

    queue(task: () => Promise<unknown>) {
        this.allTasksQueue.push(task);
        this.runTask();
    }

    private runTask() {
        if (
            this.runningTasksCount < this.concurrency && /* we do not run more than the concurrency allows us */
            this.queueHead < this.allTasksQueue.length /* there are still unprocessed tasks in the queue */
        ) {
            const task = this.allTasksQueue[this.queueHead++];
            this.runningTasksCount++;

            task().catch(() => {
                /* mute the error */
            }).finally(() => {
                this.runningTasksCount--;
                this.runTask();
            });
        }
    }
}