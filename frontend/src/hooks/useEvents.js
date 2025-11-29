import { useEffect, useRef, useState, useCallback } from 'react';
import contractService from '../utils/contractService.js';
import toast from 'react-hot-toast';

// Utility function để throttle notifications
const throttleNotifications = (() => {
  const lastNotificationTime = {};
  const maxNotificationsPerMinute = 5;
  const notificationCounts = {};
  
  return (key, callback, delay = 3000) => {
    const now = Date.now();
    const minute = Math.floor(now / 60000);
    const countKey = `${key}-${minute}`;
    
    // Reset counter mỗi phút
    if (!notificationCounts[countKey]) {
      notificationCounts[countKey] = 0;
    }
    
    // Kiểm tra limit và delay
    if (notificationCounts[countKey] < maxNotificationsPerMinute &&
        (!lastNotificationTime[key] || now - lastNotificationTime[key] > delay)) {
      lastNotificationTime[key] = now;
      notificationCounts[countKey]++;
      callback();
    }
  };
})();

// Utility để format notification messages
const formatNotificationMessage = (event) => {
  switch (event.type) {
    case 'donated':
      return {
        message: `💰 Có người vừa donate ${parseFloat(event.amount).toFixed(3)} ETH!`,
        duration: 4000,
        icon: '🎉'
      };
    case 'proposalCreated':
      return {
        message: `📝 Đề xuất mới: "${event.description?.substring(0, 50)}${event.description?.length > 50 ? '...' : ''}"`,
        duration: 5000,
        icon: '📋'
      };
    case 'voted':
      return {
        message: `🗳️ Vote mới: ${event.support ? 'Ủng hộ' : 'Phản đối'} với ${parseFloat(event.weight).toFixed(3)} ETH`,
        duration: 3000,
        icon: event.support ? '👍' : '👎'
      };
    case 'proposalExecuted':
      return {
        message: `✅ Đề xuất đã thực hiện: ${parseFloat(event.amount).toFixed(3)} ETH được chuyển`,
        duration: 6000,
        icon: '🚀'
      };
    case 'refunded':
      return {
        message: `💸 Hoàn tiền: ${parseFloat(event.amount).toFixed(3)} ETH`,
        duration: 4000,
        icon: '💰'
      };
    default:
      return {
        message: `ℹ️ Sự kiện mới: ${event.type}`,
        duration: 3000,
        icon: '📢'
      };
  }
};

// Hook để lắng nghe events của một campaign cụ thể
export const useEvents = (campaignAddress) => {
  const [events, setEvents] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);
  const unsubscribeRef = useRef(null);
  const lastUpdateRef = useRef(0);

  // Callback xử lý events
  const handleEvent = useCallback((eventData) => {
    console.log(`📨 New event received for ${campaignAddress}:`, eventData);
    
    // Thêm event vào state với deduplication
    setEvents(prev => {
      // Kiểm tra duplicate dựa trên transactionHash và logIndex
      const isDuplicate = prev.some(e => 
        e.transactionHash === eventData.transactionHash && 
        e.logIndex === eventData.logIndex
      );
      
      if (isDuplicate) {
        console.log('📋 Duplicate event ignored:', eventData.transactionHash);
        return prev;
      }
      
      // Thêm event mới và giữ tối đa 100 events
      const updatedEvents = [eventData, ...prev].slice(0, 100);
      
      // Throttle state updates (max 1 update per 500ms)
      const now = Date.now();
      if (now - lastUpdateRef.current < 500) {
        setTimeout(() => {
          lastUpdateRef.current = now;
        }, 500);
        return prev;
      }
      
      lastUpdateRef.current = now;
      return updatedEvents;
    });
    
    // Show notification với throttling
    const notificationKey = `${eventData.type}-${campaignAddress}-${eventData.transactionHash}`;
    throttleNotifications(notificationKey, () => {
      const notif = formatNotificationMessage(eventData);
      
      switch (eventData.type) {
        case 'donated':
        case 'proposalExecuted':
        case 'refunded':
          toast.success(notif.message, { 
            duration: notif.duration, 
            icon: notif.icon 
          });
          break;
        case 'proposalCreated':
        case 'voted':
          toast(notif.message, { 
            duration: notif.duration, 
            icon: notif.icon 
          });
          break;
        default:
          console.log(`ℹ️ Unhandled event type for notification: ${eventData.type}`);
      }
    });
  }, [campaignAddress]);

  // Bắt đầu lắng nghe events
  const startListening = useCallback(() => {
    if (!campaignAddress || isListening) return;

    console.log(`🚀 Starting event listener for: ${campaignAddress}`);
    setError(null);
    setIsListening(true);

    try {
      const unsubscribe = contractService.listenToAllEvents(campaignAddress, handleEvent);
      unsubscribeRef.current = unsubscribe;
      console.log(`✅ Event listener started for: ${campaignAddress}`);
    } catch (err) {
      console.error(`❌ Failed to start event listener for ${campaignAddress}:`, err);
      setError(err.message);
      setIsListening(false);
    }
  }, [campaignAddress, handleEvent, isListening]);

  // Dừng lắng nghe events
  const stopListening = useCallback(() => {
    if (!isListening) return;

    console.log(`🛑 Stopping event listener for: ${campaignAddress}`);
    
    if (unsubscribeRef.current) {
      try {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
        console.log(`✅ Event listener stopped for: ${campaignAddress}`);
      } catch (err) {
        console.error(`❌ Error stopping event listener:`, err);
      }
    }
    
    setIsListening(false);
  }, [campaignAddress, isListening]);

  // Tải events đã qua
  const loadPastEvents = useCallback(async (fromBlock = 0) => {
    if (!campaignAddress) return;

    console.log(`📜 Loading past events for ${campaignAddress} from block ${fromBlock}`);
    
    try {
      setError(null);
      const pastEvents = await contractService.getPastEvents(campaignAddress, null, fromBlock);
      
      // Sắp xếp và set events
      const sortedEvents = pastEvents.sort((a, b) => {
        if (a.blockNumber !== b.blockNumber) {
          return b.blockNumber - a.blockNumber; // Mới nhất trước
        }
        return b.logIndex - a.logIndex;
      });
      
      setEvents(sortedEvents);
      console.log(`✅ Loaded ${sortedEvents.length} past events for ${campaignAddress}`);
    } catch (err) {
      console.error(`❌ Error loading past events for ${campaignAddress}:`, err);
      setError(`Không thể tải lịch sử sự kiện: ${err.message}`);
      toast.error('Không thể tải lịch sử sự kiện');
    }
  }, [campaignAddress]);

  // Clear events
  const clearEvents = useCallback(() => {
    console.log(`🗑️ Clearing events for: ${campaignAddress}`);
    setEvents([]);
    setError(null);
  }, [campaignAddress]);

  // Auto start/stop khi campaignAddress thay đổi
  useEffect(() => {
    if (!campaignAddress) {
      console.log('❌ No campaign address provided');
      return;
    }

    console.log(`🔄 Campaign address changed to: ${campaignAddress}`);
    
    // Load past events trước khi start listening
    loadPastEvents().then(() => {
      // Start listening sau khi load past events
      startListening();
    });

    // Cleanup function
    return () => {
      console.log(`🧹 Cleaning up event listener for: ${campaignAddress}`);
      stopListening();
    };
  }, [campaignAddress, loadPastEvents, startListening, stopListening]);

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);

  return {
    events,
    isListening,
    error,
    startListening,
    stopListening,
    loadPastEvents,
    clearEvents,
    eventCount: events.length
  };
};

// Hook để lắng nghe events của tất cả campaigns (cho trang chính)
export const useGlobalCampaignEvents = () => {
  const [globalEvents, setGlobalEvents] = useState([]);
  const [listeningCampaigns, setListeningCampaigns] = useState(new Set());
  const [isGlobalListening, setIsGlobalListening] = useState(false);
  const unsubscribeGlobalRef = useRef(null);

  // Global callback xử lý events từ tất cả campaigns
  const globalCallback = useCallback((eventData) => {
    console.log(`🌍 Global event received:`, eventData);
    
    setGlobalEvents(prev => {
      // Kiểm tra duplicate
      const isDuplicate = prev.some(e => 
        e.transactionHash === eventData.transactionHash && 
        e.logIndex === eventData.logIndex &&
        e.campaignAddress === eventData.campaignAddress
      );
      
      if (isDuplicate) return prev;
      
      // Thêm campaignAddress vào event và giữ tối đa 50 events
      return [eventData, ...prev].slice(0, 50);
    });
    
    // Notification cho global events (ít hơn để tránh spam)
    const notificationKey = `global-${eventData.type}-${eventData.campaignAddress}`;
    throttleNotifications(notificationKey, () => {
      const shortAddress = eventData.campaignAddress?.slice(0, 6) + '...';
      switch (eventData.type) {
        case 'donated':
          toast.success(`💰 Donation mới trong ${shortAddress}: ${parseFloat(eventData.amount).toFixed(2)} ETH`, {
            duration: 3000
          });
          break;
        case 'proposalCreated':
          toast(`📝 Đề xuất mới trong ${shortAddress}`, {
            duration: 2000,
            icon: '📋'
          });
          break;
        default:
          // Không hiển thị notification cho các events khác ở global level
          break;
      }
    }, 5000); // Longer delay cho global notifications
  }, []);

  // Thêm campaign để lắng nghe
  const addCampaignListener = useCallback((campaignAddress) => {
    if (!campaignAddress || listeningCampaigns.has(campaignAddress)) {
      console.log(`⚠️ Campaign ${campaignAddress} already being listened to or invalid`);
      return;
    }

    console.log(`🌍 Adding global listener for campaign: ${campaignAddress}`);
    
    try {
      const unsubscribe = contractService.listenToAllEvents(campaignAddress, (eventData) => {
        globalCallback({ ...eventData, campaignAddress });
      });

      setListeningCampaigns(prev => new Set(prev).add(campaignAddress));
      
      // Store unsubscribe function để cleanup sau
      if (!unsubscribeGlobalRef.current) {
        unsubscribeGlobalRef.current = new Map();
      }
      unsubscribeGlobalRef.current.set(campaignAddress, unsubscribe);
      
      console.log(`✅ Global listener added for: ${campaignAddress}`);
    } catch (error) {
      console.error(`❌ Failed to add global listener for ${campaignAddress}:`, error);
    }
  }, [listeningCampaigns, globalCallback]);

  // Xóa campaign khỏi danh sách lắng nghe
  const removeCampaignListener = useCallback((campaignAddress) => {
    if (!listeningCampaigns.has(campaignAddress)) {
      console.log(`⚠️ Campaign ${campaignAddress} not in listening list`);
      return;
    }

    console.log(`🌍 Removing global listener for campaign: ${campaignAddress}`);
    
    const unsubscribe = unsubscribeGlobalRef.current?.get(campaignAddress);
    if (unsubscribe) {
      try {
        unsubscribe();
        unsubscribeGlobalRef.current.delete(campaignAddress);
        console.log(`✅ Global listener removed for: ${campaignAddress}`);
      } catch (error) {
        console.error(`❌ Error removing global listener for ${campaignAddress}:`, error);
      }
    }

    setListeningCampaigns(prev => {
      const newSet = new Set(prev);
      newSet.delete(campaignAddress);
      return newSet;
    });
  }, [listeningCampaigns]);

  // Bắt đầu global listening
  const startGlobalListening = useCallback(() => {
    if (isGlobalListening) return;
    
    console.log('🌍 Starting global campaign event listening');
    setIsGlobalListening(true);
    
    // Có thể thêm global callback vào eventService
    try {
      const unsubscribe = contractService.eventService.addGlobalCallback(globalCallback);
      unsubscribeGlobalRef.current = unsubscribe;
    } catch (error) {
      console.error('Error starting global listening:', error);
      setIsGlobalListening(false);
    }
  }, [isGlobalListening, globalCallback]);

  // Dừng global listening
  const stopGlobalListening = useCallback(() => {
    if (!isGlobalListening) return;
    
    console.log('🛑 Stopping global campaign event listening');
    
    if (unsubscribeGlobalRef.current) {
      if (typeof unsubscribeGlobalRef.current === 'function') {
        unsubscribeGlobalRef.current();
      } else if (unsubscribeGlobalRef.current instanceof Map) {
        unsubscribeGlobalRef.current.forEach(unsub => {
          try {
            unsub();
          } catch (error) {
            console.error('Error calling unsubscribe:', error);
          }
        });
        unsubscribeGlobalRef.current.clear();
      }
    }
    
    setIsGlobalListening(false);
    setListeningCampaigns(new Set());
  }, [isGlobalListening]);

  // Cleanup khi unmount
  useEffect(() => {
    return () => {
      console.log('🧹 Cleaning up global campaign event listeners');
      stopGlobalListening();
      setGlobalEvents([]);
    };
  }, [stopGlobalListening]);

  return {
    globalEvents,
    listeningCampaigns: Array.from(listeningCampaigns),
    isGlobalListening,
    addCampaignListener,
    removeCampaignListener,
    startGlobalListening,
    stopGlobalListening,
    clearGlobalEvents: () => setGlobalEvents([]),
    globalEventCount: globalEvents.length
  };
};