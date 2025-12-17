import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, CAMPAIGN_FACTORY_ABI, CAMPAIGN_ABI } from './constants.js';

export class ContractHelper {
  constructor(provider, signer) {
    this.provider = provider;
    this.signer = signer;
  }

  // Lấy blockchain timestamp hiện tại
  async getBlockchainTime() {
    try {
      const block = await this.provider.getBlock('latest');
      return block.timestamp;
    } catch (error) {
      console.error('Error getting blockchain time:', error);
      // Fallback to Date.now() if error
      return Math.floor(Date.now() / 1000);
    }
  }

  // Tạo factory contract instance
  getFactoryContract() {
    return new ethers.Contract(
      CONTRACT_ADDRESSES.CAMPAIGN_FACTORY,
      CAMPAIGN_FACTORY_ABI,
      this.signer
    );
  }

  // Tạo campaign contract instance
  getCampaignContract(address, withSigner = false) {
    return new ethers.Contract(
      address,
      CAMPAIGN_ABI,
      withSigner ? this.signer : this.provider
    );
  }

  // Parse error messages thân thiện hơn
  parseError(error, context = '') {
    let errorMessage = error.message;
    
    // Common errors
    if (error.message.includes('user rejected')) {
      return 'Giao dịch bị từ chối bởi người dùng';
    }
    if (error.message.includes('insufficient funds')) {
      return 'Số dư không đủ để thực hiện giao dịch';
    }

    // Context specific errors
    switch (context) {
      case 'donate':
        if (error.message.includes('Campaign ended')) {
          return 'Campaign đã kết thúc, không thể quyên góp';
        }
        if (error.message.includes('Must send ETH')) {
          return 'Số tiền quyên góp phải lớn hơn 0';
        }
        break;
        
      case 'proposal':
        if (error.message.includes('Only owner can propose')) {
          return 'Chỉ owner mới có thể tạo proposal';
        }
        if (error.message.includes('Not enough funds')) {
          return 'Campaign không có đủ tiền cho proposal này';
        }
        break;
        
      case 'vote':
        if (error.message.includes('Only donors can vote')) {
          return 'Chỉ những người đã quyên góp mới có thể vote';
        }
        if (error.message.includes('Already voted')) {
          return 'Bạn đã vote cho proposal này rồi';
        }
        if (error.message.includes('Proposal executed')) {
          return 'Proposal này đã được thực hiện';
        }
        break;
        
      case 'execute':
        if (error.message.includes('Already executed')) {
          return 'Proposal này đã được thực hiện rồi';
        }
        if (error.message.includes('Proposal not approved')) {
          return 'Proposal chưa được chấp thuận (cần nhiều vote YES hơn)';
        }
        if (error.message.includes('Insufficient funds')) {
          return 'Campaign không còn đủ tiền để thực hiện proposal';
        }
        break;
        
      case 'refund':
        if (error.message.includes('Campaign not ended yet')) {
          return 'Campaign chưa kết thúc, chưa thể hoàn tiền';
        }
        if (error.message.includes('Campaign successful')) {
          return 'Campaign thành công, không thể hoàn tiền';
        }
        if (error.message.includes('Nothing to refund')) {
          return 'Bạn chưa quyên góp vào campaign này';
        }
        break;
    }
    
    return errorMessage;
  }

  // Format campaign data
  formatCampaignData(rawData, address = null) {
    const [owner, targetAmount, deadline, totalRaised, balance, campaignDescription, createdAt] = rawData;
    
    const now = Math.floor(Date.now() / 1000);
    const isActive = now < Number(deadline);
    const isSuccessful = Number(totalRaised) >= Number(targetAmount);
    
    let status;
    if (isActive) {
      status = 'active';
    } else if (isSuccessful) {
      status = 'successful';
    } else {
      status = 'failed';
    }
    
    const formattedData = {
      owner,
      targetAmount: ethers.formatEther(targetAmount),
      deadline: Number(deadline),
      totalRaised: ethers.formatEther(totalRaised),
      balance: ethers.formatEther(balance),
      isActive,
      isSuccessful,
      status,
      progress: (Number(ethers.formatEther(totalRaised)) / Number(ethers.formatEther(targetAmount))) * 100,
      campaignDescription,
      createdAt: Number(createdAt)
    };

    if (address) {
      formattedData.address = address;
    }

    return formattedData;
  }

  // Format proposal data
  formatProposalData(rawProposal, proposalId = null) {
    const proposal = {
      description: rawProposal[0],
      amount: ethers.formatEther(rawProposal[1]),
      recipient: rawProposal[2],
      voteYes: ethers.formatEther(rawProposal[3]),
      voteNo: ethers.formatEther(rawProposal[4]),
      executed: rawProposal[5]
    };

    if (proposalId !== null) {
      proposal.id = proposalId;
    }

    return proposal;
  }
}