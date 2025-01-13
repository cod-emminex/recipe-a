// client/src/services/offlineSync.js
import { storage } from "../utils/storage";
import { v4 as uuidv4 } from "uuid";

class OfflineSyncService {
  constructor() {
    this.syncQueue = this.loadSyncQueue();
    this.isSyncing = false;
    this.setupNetworkListeners();
  }

  loadSyncQueue() {
    return storage.get("syncQueue", []);
  }

  saveSyncQueue() {
    storage.set("syncQueue", this.syncQueue);
  }

  setupNetworkListeners() {
    window.addEventListener("online", () => {
      this.processSyncQueue();
    });
  }

  addToSyncQueue(action) {
    const syncItem = {
      id: uuidv4(),
      action,
      timestamp: new Date().toISOString(),
      retries: 0,
    };

    this.syncQueue.push(syncItem);
    this.saveSyncQueue();

    if (navigator.onLine) {
      this.processSyncQueue();
    }
  }

  async processSyncQueue() {
    if (this.isSyncing || this.syncQueue.length === 0) return;
    this.isSyncing = true;

    try {
      const itemsToSync = [...this.syncQueue];
      this.syncQueue = [];
      this.saveSyncQueue();

      for (const item of itemsToSync) {
        try {
          await this.processItem(item);
        } catch (error) {
          console.error("Error processing sync item:", error);

          if (item.retries < 3) {
            item.retries++;
            this.syncQueue.push(item);
          } else {
            // Log failed item for manual resolution
            console.error("Sync item failed permanently:", item);
          }
        }
      }

      this.saveSyncQueue();
    } finally {
      this.isSyncing = false;
    }
  }

  async processItem(item) {
    const { action } = item;

    switch (action.type) {
      case "CREATE_RECIPE":
        await fetch("/api/recipes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(action.data),
        });
        break;

      case "UPDATE_RECIPE":
        await fetch(`/api/recipes/${action.data.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(action.data),
        });
        break;

      case "DELETE_RECIPE":
        await fetch(`/api/recipes/${action.data.id}`, {
          method: "DELETE",
        });
        break;

      // Add more action types as needed

      default:
        console.warn("Unknown sync action type:", action.type);
    }
  }

  getQueueStatus() {
    return {
      pendingItems: this.syncQueue.length,
      isSyncing: this.isSyncing,
    };
  }

  clearQueue() {
    this.syncQueue = [];
    this.saveSyncQueue();
  }
}

export default new OfflineSyncService();
