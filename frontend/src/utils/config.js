/**
 * Application Configuration
 * Central configuration file for the Campaign DApp
 */

// ===== Network Configuration =====
export const NETWORK_CONFIG = {
  // Hardhat Local Network
  LOCAL: {
    chainId: 31337,
    name: 'Hardhat Local',
    rpcUrl: 'http://127.0.0.1:8545',
    blockExplorer: null
  },
  
  // Sepolia Testnet
  SEPOLIA: {
    chainId: 11155111,
    name: 'Sepolia',
    rpcUrl: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
    blockExplorer: 'https://sepolia.etherscan.io'
  }
};

// Current network (change this for production)
export const CURRENT_NETWORK = NETWORK_CONFIG.LOCAL;

// ===== Smart Contract Configuration =====
export const CONTRACT_ADDRESSES = {
  CAMPAIGN_FACTORY: "0x5FbDB2315678afecb367f032d93F642f64180aa3"
};

// ===== Event Polling Configuration =====
export const EVENT_CONFIG = {
  // Polling interval in milliseconds
  POLLING_INTERVAL: 3000,
  
  // Number of blocks to look back for past events
  BLOCK_LOOKBACK: 10000,
  
  // Maximum retries for failed requests
  MAX_RETRIES: 3,
  
  // Timeout for event queries (ms)
  QUERY_TIMEOUT: 30000
};

// ===== UI Configuration =====
export const UI_CONFIG = {
  // Theme colors
  COLORS: {
    primary: {
      start: '#fa709a', // Pink
      end: '#fee140'    // Orange
    },
    success: {
      start: '#43e97b', // Green
      end: '#38f9d7'    // Teal
    },
    background: '#f8f9fa',
    text: {
      primary: '#1f2937',
      secondary: '#6b7280'
    }
  },
  
  // Notification duration (ms)
  NOTIFICATION_DURATION: 5000,
  
  // Debounce delays (ms)
  DEBOUNCE: {
    SEARCH: 300,
    RESIZE: 150,
    SCROLL: 100
  },
  
  // Items per page for pagination
  ITEMS_PER_PAGE: 12,
  
  // Date format
  DATE_FORMAT: 'DD/MM/YYYY HH:mm',
  
  // Address display length
  ADDRESS_DISPLAY_LENGTH: 6
};

// ===== Campaign Configuration =====
export const CAMPAIGN_CONFIG = {
  // Minimum target amount (in ETH)
  MIN_TARGET_AMOUNT: 0.01,
  
  // Maximum target amount (in ETH)
  MAX_TARGET_AMOUNT: 10000,
  
  // Minimum duration (in days)
  MIN_DURATION_DAYS: 1,
  
  // Maximum duration (in days)
  MAX_DURATION_DAYS: 365,
  
  // Minimum donation (in ETH)
  MIN_DONATION: 0.001,
  
  // Quorum percentage for proposal execution
  QUORUM_PERCENTAGE: 50
};

// ===== Gas Configuration =====
export const GAS_CONFIG = {
  // Gas limit multiplier for safety margin
  GAS_LIMIT_MULTIPLIER: 1.2,
  
  // Default gas limits for different operations
  DEFAULTS: {
    createCampaign: 3000000,
    donate: 100000,
    createProposal: 200000,
    vote: 150000,
    executeProposal: 300000
  }
};

// ===== Error Messages =====
export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: 'Vui lòng kết nối ví của bạn',
  INSUFFICIENT_BALANCE: 'Số dư không đủ',
  TRANSACTION_REJECTED: 'Giao dịch bị từ chối',
  NETWORK_ERROR: 'Lỗi kết nối mạng',
  INVALID_ADDRESS: 'Địa chỉ không hợp lệ',
  CAMPAIGN_NOT_FOUND: 'Không tìm thấy chiến dịch',
  CAMPAIGN_ENDED: 'Chiến dịch đã kết thúc',
  CAMPAIGN_NOT_SUCCESSFUL: 'Chiến dịch chưa đạt mục tiêu',
  NOT_CAMPAIGN_OWNER: 'Bạn không phải chủ chiến dịch',
  NOT_DONOR: 'Bạn chưa đóng góp cho chiến dịch này',
  ALREADY_VOTED: 'Bạn đã bỏ phiếu cho đề xuất này',
  PROPOSAL_EXECUTED: 'Đề xuất đã được thực hiện',
  QUORUM_NOT_REACHED: 'Chưa đủ số lượng phiếu',
  PROPOSAL_NOT_APPROVED: 'Đề xuất không được thông qua'
};

// ===== Success Messages =====
export const SUCCESS_MESSAGES = {
  CAMPAIGN_CREATED: 'Tạo chiến dịch thành công!',
  DONATION_SUCCESS: 'Đóng góp thành công!',
  PROPOSAL_CREATED: 'Tạo đề xuất thành công!',
  VOTE_SUCCESS: 'Bỏ phiếu thành công!',
  PROPOSAL_EXECUTED: 'Thực hiện đề xuất thành công!',
  REFUND_SUCCESS: 'Hoàn tiền thành công!'
};

// ===== Local Storage Keys =====
export const STORAGE_KEYS = {
  CONNECTED_ACCOUNT: 'campaign_dapp_account',
  THEME_PREFERENCE: 'campaign_dapp_theme',
  RECENT_CAMPAIGNS: 'campaign_dapp_recent'
};

// ===== External Links =====
export const EXTERNAL_LINKS = {
  GITHUB: 'https://github.com',
  TWITTER: 'https://twitter.com',
  DISCORD: 'https://discord.com',
  DOCS: '/docs',
  WHITEPAPER: '/whitepaper.pdf'
};

export default {
  NETWORK_CONFIG,
  CURRENT_NETWORK,
  CONTRACT_ADDRESSES,
  EVENT_CONFIG,
  UI_CONFIG,
  CAMPAIGN_CONFIG,
  GAS_CONFIG,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  STORAGE_KEYS,
  EXTERNAL_LINKS
};
