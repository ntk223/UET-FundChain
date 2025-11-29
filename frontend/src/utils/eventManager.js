import { ethers } from 'ethers';
import { CAMPAIGN_ABI } from './constants.js';

/**
 * EventManager - Quản lý việc lắng nghe và xử lý events từ smart contracts
 * Sử dụng polling để tránh lỗi "contract runner does not support subscribing"
 */
export class EventManager {
  constructor(provider) {
    this.provider = provider;
    this.activePollers = new Map(); // campaignAddress -> { intervalId, lastBlock, callbacks }
    this.globalCallbacks = new Set(); // callbacks cho global events
    this.pollingInterval = 3000; // 3 giây
    this.blocksToLookback = 10; // Số blocks để look back khi bắt đầu polling
  }

  /**
   * Bắt đầu polling events cho một campaign cụ thể
   */
  startPolling(campaignAddress, callback) {
    if (!campaignAddress || !callback) {
      throw new Error('Campaign address và callback là bắt buộc');
    }

    // Nếu đã có poller cho campaign này, thêm callback vào
    if (this.activePollers.has(campaignAddress)) {
      const poller = this.activePollers.get(campaignAddress);
      poller.callbacks.add(callback);
      console.log(`📡 Added callback to existing poller for ${campaignAddress}`);
      return () => this.removeCallback(campaignAddress, callback);
    }

    // Tạo poller mới
    const poller = {
      intervalId: null,
      lastBlock: 0,
      callbacks: new Set([callback]),
      isRunning: false
    };

    this.activePollers.set(campaignAddress, poller);
    
    // Bắt đầu polling
    this._startPollingForCampaign(campaignAddress, poller);
    
    console.log(`🚀 Started event polling for ${campaignAddress}`);
    
    // Trả về unsubscribe function
    return () => this.stopPolling(campaignAddress, callback);
  }

  /**
   * Dừng polling cho một callback cụ thể
   */
  removeCallback(campaignAddress, callback) {
    const poller = this.activePollers.get(campaignAddress);
    if (!poller) return;

    poller.callbacks.delete(callback);
    
    // Nếu không còn callbacks nào, dừng polling
    if (poller.callbacks.size === 0) {
      this.stopPolling(campaignAddress);
    }
  }

  /**
   * Dừng hoàn toàn polling cho một campaign
   */
  stopPolling(campaignAddress, specificCallback = null) {
    const poller = this.activePollers.get(campaignAddress);
    if (!poller) return;

    if (specificCallback) {
      poller.callbacks.delete(specificCallback);
      if (poller.callbacks.size > 0) {
        return; // Vẫn còn callbacks khác
      }
    }

    // Dừng interval
    if (poller.intervalId) {
      clearInterval(poller.intervalId);
    }
    
    this.activePollers.delete(campaignAddress);
    console.log(`🛑 Stopped event polling for ${campaignAddress}`);
  }

  /**
   * Dừng tất cả polling
   */
  stopAllPolling() {
    for (const [campaignAddress] of this.activePollers) {
      this.stopPolling(campaignAddress);
    }
    this.globalCallbacks.clear();
    console.log('🛑 Stopped all event polling');
  }

  /**
   * Thêm global callback (lắng nghe events từ tất cả campaigns)
   */
  addGlobalCallback(callback) {
    this.globalCallbacks.add(callback);
    return () => this.globalCallbacks.delete(callback);
  }

  /**
   * Lấy past events từ một campaign
   */
  async getPastEvents(campaignAddress, eventTypes = null, fromBlock = 0, toBlock = 'latest') {
    try {
      const campaign = new ethers.Contract(campaignAddress, CAMPAIGN_ABI, this.provider);
      const defaultEventTypes = ['Donated', 'ProposalCreated', 'Voted', 'ProposalExecuted', 'Refunded'];
      const typesToQuery = eventTypes || defaultEventTypes;
      
      const allEvents = [];

      for (const eventType of typesToQuery) {
        try {
          const filter = campaign.filters[eventType]();
          const events = await campaign.queryFilter(filter, fromBlock, toBlock);
          
          const parsedEvents = events.map(event => 
            this._formatEventData(eventType, event, campaign)
          );
          
          allEvents.push(...parsedEvents);
        } catch (error) {
          console.error(`Error querying ${eventType} events:`, error);
        }
      }

      // Sắp xếp theo block number và log index
      allEvents.sort((a, b) => {
        if (a.blockNumber !== b.blockNumber) {
          return b.blockNumber - a.blockNumber; // Mới nhất trước
        }
        return b.logIndex - a.logIndex;
      });

      return allEvents;
    } catch (error) {
      console.error(`Error getting past events for ${campaignAddress}:`, error);
      return [];
    }
  }

  /**
   * Private method: Bắt đầu polling cho một campaign
   */
  async _startPollingForCampaign(campaignAddress, poller) {
    if (poller.isRunning) return;
    
    poller.isRunning = true;
    
    try {
      // Lấy current block để khởi tạo
      const currentBlock = await this.provider.getBlockNumber();
      poller.lastBlock = Math.max(0, currentBlock - this.blocksToLookback);
      
      console.log(`📡 Starting polling for ${campaignAddress} from block ${poller.lastBlock}`);
      
      // Load initial past events
      const initialEvents = await this.getPastEvents(
        campaignAddress, 
        null, 
        poller.lastBlock
      );
      
      // Gọi callbacks với initial events
      initialEvents.forEach(event => {
        poller.callbacks.forEach(callback => {
          try {
            callback(event);
          } catch (error) {
            console.error('Error in event callback:', error);
          }
        });
        
        // Gọi global callbacks
        this.globalCallbacks.forEach(callback => {
          try {
            callback({ ...event, campaignAddress });
          } catch (error) {
            console.error('Error in global callback:', error);
          }
        });
      });
      
    } catch (error) {
      console.error(`Error initializing polling for ${campaignAddress}:`, error);
    }

    // Bắt đầu interval polling
    poller.intervalId = setInterval(async () => {
      await this._pollForNewEvents(campaignAddress, poller);
    }, this.pollingInterval);
  }

  /**
   * Private method: Poll for new events
   */
  async _pollForNewEvents(campaignAddress, poller) {
    if (!poller.isRunning) return;

    try {
      const currentBlock = await this.provider.getBlockNumber();
      
      if (currentBlock > poller.lastBlock) {
        const newEvents = await this.getPastEvents(
          campaignAddress,
          null,
          poller.lastBlock + 1,
          currentBlock
        );

        if (newEvents.length > 0) {
          console.log(`📨 Found ${newEvents.length} new events for ${campaignAddress}`);
          
          // Gọi callbacks với events mới
          newEvents.forEach(event => {
            // Campaign-specific callbacks
            poller.callbacks.forEach(callback => {
              try {
                callback(event);
              } catch (error) {
                console.error('Error in event callback:', error);
              }
            });
            
            // Global callbacks
            this.globalCallbacks.forEach(callback => {
              try {
                callback({ ...event, campaignAddress });
              } catch (error) {
                console.error('Error in global callback:', error);
              }
            });
          });
        }
        
        poller.lastBlock = currentBlock;
      }
    } catch (error) {
      console.error(`Error polling events for ${campaignAddress}:`, error);
    }
  }

  /**
   * Private method: Format event data
   */
  _formatEventData(eventType, event, contract) {
    try {
      const parsed = contract.interface.parseLog(event);
      const timestamp = Date.now(); // Có thể lấy từ block nếu cần chính xác hơn
      
      const baseEvent = {
        type: eventType.toLowerCase(),
        transactionHash: event.transactionHash,
        blockNumber: event.blockNumber,
        logIndex: event.logIndex,
        timestamp,
        raw: event
      };

      switch (eventType) {
        case 'Donated':
          return {
            ...baseEvent,
            type: 'donated',
            donor: parsed.args.donor,
            amount: ethers.formatEther(parsed.args.amount)
          };

        case 'ProposalCreated':
          return {
            ...baseEvent,
            type: 'proposalCreated',
            proposalId: parsed.args.id.toString(),
            description: parsed.args.description,
            amount: ethers.formatEther(parsed.args.amount),
            recipient: parsed.args.recipient
          };

        case 'Voted':
          return {
            ...baseEvent,
            type: 'voted',
            voter: parsed.args.voter,
            proposalId: parsed.args.proposalId.toString(),
            support: parsed.args.support,
            weight: ethers.formatEther(parsed.args.weight)
          };

        case 'ProposalExecuted':
          return {
            ...baseEvent,
            type: 'proposalExecuted',
            proposalId: parsed.args.proposalId.toString(),
            amount: ethers.formatEther(parsed.args.amount),
            recipient: parsed.args.recipient
          };

        case 'Refunded':
          return {
            ...baseEvent,
            type: 'refunded',
            donor: parsed.args.donor,
            amount: ethers.formatEther(parsed.args.amount)
          };

        default:
          return {
            ...baseEvent,
            args: parsed.args
          };
      }
    } catch (error) {
      console.error(`Error formatting ${eventType} event:`, error);
      return {
        type: eventType.toLowerCase(),
        transactionHash: event.transactionHash,
        blockNumber: event.blockNumber,
        logIndex: event.logIndex,
        timestamp: Date.now(),
        error: error.message,
        raw: event
      };
    }
  }

  /**
   * Get status của event manager
   */
  getStatus() {
    return {
      activePollers: Array.from(this.activePollers.keys()),
      globalCallbacks: this.globalCallbacks.size,
      pollingInterval: this.pollingInterval
    };
  }
}