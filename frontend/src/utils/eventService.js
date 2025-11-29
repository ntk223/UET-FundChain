import { EventManager } from './eventManager.js';

/**
 * EventService - Wrapper class cho EventManager để maintain backward compatibility
 */
export class EventService {
  constructor(provider) {
    this.eventManager = new EventManager(provider);
  }

  // Lắng nghe tất cả sự kiện của một campaign
  listenToAllEvents(campaignAddress, callback) {
    return this.eventManager.startPolling(campaignAddress, callback);
  }

  // Lắng nghe sự kiện Donated cụ thể
  listenToDonated(campaignAddress, callback) {
    // Tạo wrapper callback để chỉ lắng nghe donated events
    const donatedCallback = (event) => {
      if (event.type === 'donated') {
        callback(event);
      }
    };
    return this.eventManager.startPolling(campaignAddress, donatedCallback);
  }

  // Lấy events đã qua
  async getPastEvents(campaignAddress, eventName, fromBlock = 0) {
    if (eventName) {
      return this.eventManager.getPastEvents(campaignAddress, [eventName], fromBlock);
    }
    return this.eventManager.getPastEvents(campaignAddress, null, fromBlock);
  }

  // Dừng tất cả listeners cho một campaign
  removeAllListeners(campaignAddress) {
    this.eventManager.stopPolling(campaignAddress);
  }

  // Dừng tất cả polling
  stopAll() {
    this.eventManager.stopAllPolling();
  }

  // Thêm global callback
  addGlobalCallback(callback) {
    return this.eventManager.addGlobalCallback(callback);
  }

  // Lấy status
  getStatus() {
    return this.eventManager.getStatus();
  }
}