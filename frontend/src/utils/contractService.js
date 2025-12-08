import { ethers } from 'ethers';
import { ContractHelper } from './contractHelpers.js';
import { EventService } from './eventService.js';
import { CampaignOperations } from './campaignOperations.js';
import { CampaignQueries } from './campaignQueries.js';

class ContractService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.isInitialized = false;
    
    // Khởi tạo các helper classes
    this.helper = null;
    this.eventService = null;
    this.operations = null;
    this.queries = null;
  }

  // Khởi tạo connection với MetaMask
  async init() {
    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask không được cài đặt! Vui lòng cài đặt MetaMask extension.');
      }

      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      
      // Kiểm tra network
      const network = await this.provider.getNetwork();
      console.log('Connected to network:', network.name, 'Chain ID:', network.chainId.toString());
      
      // Khởi tạo các helper classes
      this.helper = new ContractHelper(this.provider, this.signer);
      this.eventService = new EventService(this.provider);
      this.operations = new CampaignOperations(this.helper);
      this.queries = new CampaignQueries(this.helper);
      
      console.log('📡 EventService initialized with status:', this.eventService.getStatus());

      this.isInitialized = true;
      const address = await this.signer.getAddress();
      console.log('ContractService initialized with address:', address);
      return address;
    } catch (error) {
      console.error('Lỗi khởi tạo ContractService:', error);
      throw new Error(`Không thể kết nối: ${error.message}`);
    }
  }

  // Đảm bảo đã khởi tạo
  async ensureInitialized() {
    if (!this.isInitialized) {
      await this.init();
    }
  }

  // Lấy thông tin account
  async getAccount() {
    await this.ensureInitialized();
    return await this.signer.getAddress();
  }

  // Lấy balance của account
  async getBalance(address) {
    await this.ensureInitialized();
    const balance = await this.provider.getBalance(address);
    return ethers.formatEther(balance);
  }

  // async getTotalUsed(campaignAddress) {
  //   await this.ensureInitialized();
  //   return this.queries.getTotalUsed(campaignAddress);
  // }
  // Tạo campaign mới
  async createCampaign(owner, targetAmount, durationInDays, campaignDescription) {
    await this.ensureInitialized();
    return this.operations.createCampaign(owner, targetAmount, durationInDays, campaignDescription);
  }

  // Lấy tất cả campaigns
  async getAllCampaigns() {
    await this.ensureInitialized();
    return this.queries.getAllCampaigns();
  }

  // Lấy chi tiết 1 campaign
  async getCampaignDetails(address) {
    await this.ensureInitialized();
    return this.queries.getCampaignDetails(address);
  }

  // Quyên góp vào campaign
  async donate(campaignAddress, amount) {
    await this.ensureInitialized();
    return this.operations.donate(campaignAddress, amount);
  }



  // Tạo proposal (thay thế withdrawFunds)
  async createProposal(campaignAddress, description, amount, recipient) {
    await this.ensureInitialized();
    return this.operations.createProposal(campaignAddress, description, amount, recipient);
  }

  // Bỏ phiếu cho proposal
  async vote(campaignAddress, proposalId, support) {
    await this.ensureInitialized();
    return this.operations.vote(campaignAddress, proposalId, support);
  }

  // Thực hiện proposal
  async executeProposal(campaignAddress, proposalId) {
    await this.ensureInitialized();
    return this.operations.executeProposal(campaignAddress, proposalId);
  }

  // Hoàn tiền (cho donors)
  async refund(campaignAddress) {
    await this.ensureInitialized();
    return this.operations.refund(campaignAddress);
  }

  // Lấy contribution của user
  async getUserContribution(campaignAddress, userAddress) {
    await this.ensureInitialized();
    return this.queries.getUserContribution(campaignAddress, userAddress);
  }

  // Lấy danh sách donors
  async getDonors(campaignAddress) {
    await this.ensureInitialized();
    return this.queries.getDonors(campaignAddress);
  }

  // Lấy thông tin proposal
  async getProposal(campaignAddress, proposalId) {
    await this.ensureInitialized();
    return this.queries.getProposal(campaignAddress, proposalId);
  }

  // Lấy số lượng proposal
  async getProposalCount(campaignAddress) {
    await this.ensureInitialized();
    return this.queries.getProposalCount(campaignAddress);
  }

  // Lấy tất cả proposals
  async getAllProposals(campaignAddress) {
    await this.ensureInitialized();
    return this.queries.getAllProposals(campaignAddress);
  }

  // Kiểm tra user đã vote chưa
  async hasVoted(campaignAddress, proposalId, voterAddress) {
    await this.ensureInitialized();
    return this.queries.hasVoted(campaignAddress, proposalId, voterAddress);
  }

  // Lấy voter count
  async getVoterCount(campaignAddress, proposalId) {
    await this.ensureInitialized();
    return this.queries.getVoterCount(campaignAddress, proposalId);
  }

  // Lấy donor count
  async getDonorCount(campaignAddress) {
    await this.ensureInitialized();
    const contract = this.helper.getCampaignContract(campaignAddress);
    const count = await contract.getDonorCount();
    return Number(count);
  }

  // Kiểm tra proposal có thể execute không
  async canExecuteProposal(campaignAddress, proposalId) {
    await this.ensureInitialized();
    return this.queries.canExecuteProposal(campaignAddress, proposalId);
  }

  // Lấy chi tiết điều kiện thực thi
  async getExecutionConditions(campaignAddress, proposalId) {
    await this.ensureInitialized();
    return this.queries.getExecutionConditions(campaignAddress, proposalId);
  }

  // --- EVENT LISTENERS ---

  // Lắng nghe sự kiện Donated sử dụng polling
  listenToDonated(campaignAddress, callback) {
    return this.eventService.listenToDonated(campaignAddress, callback);
  }



  // Lắng nghe TẤT CẢ sự kiện của một campaign sử dụng polling
  listenToAllEvents(campaignAddress, callback) {
    return this.eventService.listenToAllEvents(campaignAddress, callback);
  }

  // Lấy events đã qua (từ block cũ)
  async getPastEvents(campaignAddress, eventName, fromBlock = 0) {
    await this.ensureInitialized();
    return this.eventService.getPastEvents(campaignAddress, eventName, fromBlock);
  }

  // Dừng tất cả listeners
  removeAllListeners(campaignAddress) {
    return this.eventService.removeAllListeners(campaignAddress);
  }
}

export default new ContractService();