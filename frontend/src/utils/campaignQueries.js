import { ethers } from 'ethers';

export class CampaignQueries {
  constructor(contractHelper) {
    this.helper = contractHelper;
  }

  // Lấy tất cả campaigns
  async getAllCampaigns() {
    try {
      console.log('Fetching deployed campaigns...');
      const factoryContract = this.helper.getFactoryContract();
      const campaignAddresses = await factoryContract.getDeployedCampaigns();
      console.log('Found campaigns:', campaignAddresses);
      
      const campaigns = [];
      
      for (let address of campaignAddresses) {
        try {
          const campaignData = await this.getCampaignDetails(address);
          campaigns.push(campaignData);
        } catch (error) {
          console.error(`Lỗi load campaign ${address}:`, error);
          // Skip campaign này và tiếp tục với campaign khác
        }
      }
      
      console.log('Loaded campaigns:', campaigns);
      return campaigns;
    } catch (error) {
      console.error('Lỗi load campaigns:', error);
      throw new Error(`Không thể tải campaigns: ${error.message}`);
    }
  }

  // Lấy chi tiết 1 campaign
  async getCampaignDetails(address) {
    try {
      console.log(`Getting campaign details for: ${address}`);
      const campaign = this.helper.getCampaignContract(address);
      
      const rawData = await Promise.all([
        campaign.owner(),
        campaign.targetAmount(),
        campaign.deadline(),
        campaign.totalRaised(),
        campaign.getBalance(),
        campaign.campaignDescription(),
        campaign.createdAt()
      ]);
      
      console.log('Campaign raw data:', {
        owner: rawData[0],
        targetAmount: rawData[1].toString(),
        deadline: rawData[2].toString(),
        totalRaised: rawData[3].toString(),
        balance: rawData[4].toString()
      });
      
      const campaignData = this.helper.formatCampaignData(rawData, address);
      console.log('Processed campaign data:', campaignData);
      return campaignData;
    } catch (error) {
      console.error(`Lỗi load campaign details ${address}:`, error);
      throw new Error(`Không thể load campaign: ${error.message}`);
    }
  }

  // Lấy contribution của user
  async getUserContribution(campaignAddress, userAddress) {
    try {
      const campaign = this.helper.getCampaignContract(campaignAddress);
      const contribution = await campaign.contributions(userAddress);
      return ethers.formatEther(contribution);
    } catch (error) {
      console.error('Lỗi lấy contribution:', error);
      return '0';
    }
  }

  // Lấy danh sách donors
  async getDonors(campaignAddress) {
    try {
      const campaign = this.helper.getCampaignContract(campaignAddress);
      const donorCount = await campaign.getDonorCount();
      
      // Lấy contributions của từng donor
      const donorDetails = [];
      for (let i = 0; i < donorCount; i++) {
        const donorAddress = await campaign.donors(i);
        const contribution = await campaign.contributions(donorAddress);
        donorDetails.push({
          address: donorAddress,
          contribution: ethers.formatEther(contribution)
        });
      }
      
      return donorDetails;
    } catch (error) {
      console.error('Lỗi lấy danh sách donors:', error);
      return [];
    }
  }

  // Lấy thông tin proposal
  async getProposal(campaignAddress, proposalId) {
    try {
      const campaign = this.helper.getCampaignContract(campaignAddress);
      const rawProposal = await campaign.getProposal(proposalId);
      
      return this.helper.formatProposalData(rawProposal, proposalId);
    } catch (error) {
      console.error('Lỗi lấy proposal:', error);
      throw new Error(`Không thể lấy thông tin proposal: ${error.message}`);
    }
  }

  // Lấy số lượng proposal
  async getProposalCount(campaignAddress) {
    try {
      const campaign = this.helper.getCampaignContract(campaignAddress);
      const count = await campaign.nextProposalId();
      return Number(count);
    } catch (error) {
      console.error('Lỗi lấy số proposal:', error);
      return 0;
    }
  }

  // Lấy tất cả proposals
  async getAllProposals(campaignAddress) {
    try {
      const campaign = this.helper.getCampaignContract(campaignAddress);
      const proposalCount = await campaign.nextProposalId();
      
      const proposals = [];
      for (let i = 0; i < proposalCount; i++) {
        const proposal = await this.getProposal(campaignAddress, i);
        proposals.push(proposal);
      }
      
      return proposals;
    } catch (error) {
      console.error('Lỗi lấy danh sách đề xuất:', error);
      return [];
    }
  }

  // Kiểm tra user đã vote cho proposal chưa
  async hasVoted(campaignAddress, proposalId, voterAddress) {
    try {
      const campaign = this.helper.getCampaignContract(campaignAddress);
      const voted = await campaign.isVoted(proposalId, voterAddress);
      return voted;
    } catch (error) {
      console.error('Lỗi kiểm tra vote status:', error);
      return false;
    }
  }

  // Lấy số lượng voters cho proposal
  async getVoterCount(campaignAddress, proposalId) {
    try {
      const campaign = this.helper.getCampaignContract(campaignAddress);
      const count = await campaign.getVoterCount(proposalId);
      return Number(count);
    } catch (error) {
      console.error('Lỗi lấy voter count:', error);
      return 0;
    }
  }

  // Kiểm tra proposal có thể execute không
  // Sử dụng các helper functions từ smart contract để code gọn và tối ưu hơn
  async canExecuteProposal(campaignAddress, proposalId) {
    try {
      const contract = this.helper.getCampaignContract(campaignAddress);
      const proposal = await this.getProposal(campaignAddress, proposalId);
      
      // 1. Đã execute rồi thì không thể execute nữa
      if (proposal.executed) return false;
      
      // 2. Gọi các helper functions để kiểm tra điều kiện
      // Tối ưu: gọi parallel để giảm thời gian
      const [isSuccessful, hasQuorum, isApproved, balance] = await Promise.all([
        contract.isSuccessful(),      // Kiểm tra đạt target
        contract.hasQuorum(proposalId),  // Kiểm tra quorum (>50% donors voted)
        contract.isProposalApproved(proposalId),  // Kiểm tra voteYes > voteNo
        contract.getBalance()         // Kiểm tra số dư
      ]);
      
      // 3. Campaign phải thành công
      if (!isSuccessful) return false;
      
      // 4. Phải đạt quorum
      if (!hasQuorum) return false;
      
      // 5. Phải được approve (voteYes > voteNo)
      if (!isApproved) return false;
      
      // 7. Phải có đủ tiền để thực thi
      const amountNeeded = ethers.parseEther(proposal.amount);
      if (balance < amountNeeded) return false;
      
      return true;
    } catch (error) {
      console.error('Lỗi kiểm tra execute condition:', error);
      return false;
    }
  }

  // Lấy chi tiết các điều kiện thực thi proposal
  // Trả về object chứa từng điều kiện để hiển thị chi tiết cho user
  async getExecutionConditions(campaignAddress, proposalId) {
    try {
      const contract = this.helper.getCampaignContract(campaignAddress);
      const proposal = await this.getProposal(campaignAddress, proposalId);
      
      // Gọi parallel để tối ưu
      const [
        isSuccessful, 
        hasQuorum, 
        isApproved, 
        balance,
        progressPercentage
      ] = await Promise.all([
        contract.isSuccessful(),
        contract.hasQuorum(proposalId),
        contract.isProposalApproved(proposalId),
        contract.getBalance(),
        contract.getProgressPercentage()
      ]);
      
      const amountNeeded = ethers.parseEther(proposal.amount);
      const hasSufficientBalance = balance >= amountNeeded;
      
      return {
        executed: proposal.executed,
        isSuccessful,
        hasQuorum,
        isApproved,
        hasSufficientBalance,
        progressPercentage: Number(progressPercentage) / 100, // Convert từ x100 về decimal
        balance: ethers.formatEther(balance),
        amountNeeded: proposal.amount,
        canExecute: !proposal.executed && isSuccessful && hasQuorum && isApproved && hasSufficientBalance
      };
    } catch (error) {
      console.error('Lỗi lấy execution conditions:', error);
      return null;
    }
  }
}