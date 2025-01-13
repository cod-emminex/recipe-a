// client/src/services/requestQueue.js
class RequestQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
    this.concurrentLimit = 3;
    this.activeRequests = 0;
  }

  add(request) {
    return new Promise((resolve, reject) => {
      this.queue.push({
        request,
        resolve,
        reject,
      });
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.processing || this.activeRequests >= this.concurrentLimit) return;
    this.processing = true;

    while (
      this.queue.length > 0 &&
      this.activeRequests < this.concurrentLimit
    ) {
      const { request, resolve, reject } = this.queue.shift();
      this.activeRequests++;

      try {
        const result = await request();
        resolve(result);
      } catch (error) {
        reject(error);
      } finally {
        this.activeRequests--;
      }
    }

    this.processing = false;

    if (this.queue.length > 0) {
      this.processQueue();
    }
  }

  clear() {
    this.queue = [];
  }

  get pending() {
    return this.queue.length;
  }

  get active() {
    return this.activeRequests;
  }
}

export default new RequestQueue();
