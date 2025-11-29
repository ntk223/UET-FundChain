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

  // Kiểm tra proposal có thể execute không (>50% vote yes)
  async canExecuteProposal(campaignAddress, proposalId) {
    try {
      const proposal = await this.getProposal(campaignAddress, proposalId);
      if (proposal.executed) return false;
      
      const totalVotes = parseFloat(proposal.voteYes) + parseFloat(proposal.voteNo);
      if (totalVotes === 0) return false;
      
      const yesPercentage = (parseFloat(proposal.voteYes) / totalVotes) * 100;
      return yesPercentage > 50;
    } catch (error) {
      console.error('Lỗi kiểm tra execute condition:', error);
      return false;
    }
  }
}