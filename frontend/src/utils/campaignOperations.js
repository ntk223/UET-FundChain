import { ethers } from 'ethers';

export class CampaignOperations {
  constructor(contractHelper) {
    this.helper = contractHelper;
  }

  // Tạo campaign mới
  async createCampaign(owner, targetAmount, durationInDays, campaignDescription) {
    try {
      console.log('Creating campaign:', { owner, targetAmount, durationInDays, campaignDescription });
      
      const factoryContract = this.helper.getFactoryContract();
      const targetInWei = ethers.parseEther(targetAmount.toString());
      const durationInSeconds = durationInDays * 24 * 60 * 60;
      
      console.log('Calling factory.createCampaign with:', {
        owner,
        targetInWei: targetInWei.toString(),
        durationInSeconds,
        campaignDescription
      });
      
      const tx = await factoryContract.createCampaign(
        owner,
        targetInWei,
        durationInSeconds,
        campaignDescription
      );
      
      console.log('Transaction sent:', tx.hash);
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);
      
      return tx;
    } catch (error) {
      console.error('Lỗi tạo campaign:', error);
      throw new Error(`Không thể tạo campaign: ${this.helper.parseError(error)}`);
    }
  }

  // Quyên góp vào campaign
  async donate(campaignAddress, amount) {
    try {
      console.log('Donating:', { campaignAddress, amount });

      const campaign = this.helper.getCampaignContract(campaignAddress, true);
      const amountInWei = ethers.parseEther(amount.toString());

      // Kiểm tra balance trước khi donate
      const userAddress = await this.helper.signer.getAddress();
      const userBalance = await this.helper.provider.getBalance(userAddress);

      if (userBalance < amountInWei) {
        throw new Error('Số dư không đủ để thực hiện giao dịch');
      }

      // Gọi trực tiếp transaction với gasLimit
      const tx = await campaign.donate({
        value: amountInWei,
        gasLimit: 300_000n
      });

      console.log('Donate transaction sent:', tx.hash);
      const receipt = await tx.wait();
      console.log('Donate transaction confirmed:', receipt);

      return tx;
    } catch (error) {
      console.error('Lỗi quyên góp:', error);
      throw new Error(this.helper.parseError(error, 'donate'));
    }
  }

  // Tạo proposal
  async createProposal(campaignAddress, description, amount, recipient) {
    try {
      console.log('Creating proposal:', { campaignAddress, description, amount, recipient });
      
      const campaign = this.helper.getCampaignContract(campaignAddress, true);
      const amountInWei = ethers.parseEther(amount.toString());
      
      const tx = await campaign.createProposal(description, amountInWei, recipient);
      console.log('Proposal transaction sent:', tx.hash);
      
      const receipt = await tx.wait();
      console.log('Proposal transaction confirmed:', receipt);
      
      return tx;
    } catch (error) {
      console.error('Lỗi tạo proposal:', error);
      throw new Error(this.helper.parseError(error, 'proposal'));
    }
  }

  // Bỏ phiếu cho proposal
  async vote(campaignAddress, proposalId, support) {
    try {
      console.log('Voting on proposal:', { campaignAddress, proposalId, support });
      
      const campaign = this.helper.getCampaignContract(campaignAddress, true);
      const tx = await campaign.vote(proposalId, support);
      
      console.log('Vote transaction sent:', tx.hash);
      const receipt = await tx.wait();
      console.log('Vote transaction confirmed:', receipt);
      
      return tx;
    } catch (error) {
      console.error('Lỗi vote:', error);
      throw new Error(this.helper.parseError(error, 'vote'));
    }
  }

  // Thực hiện proposal
  async executeProposal(campaignAddress, proposalId) {
    try {
      console.log('Executing proposal:', { campaignAddress, proposalId });
      
      const campaign = this.helper.getCampaignContract(campaignAddress, true);
      const tx = await campaign.executeProposal(proposalId);
      
      console.log('Execute proposal transaction sent:', tx.hash);
      const receipt = await tx.wait();
      console.log('Execute proposal transaction confirmed:', receipt);
      
      return tx;
    } catch (error) {
      console.error('Lỗi execute proposal:', error);
      throw new Error(this.helper.parseError(error, 'execute'));
    }
  }

  // Hoàn tiền (cho donors)
  async refund(campaignAddress) {
    try {
      console.log('Processing refund for campaign:', campaignAddress);
      
      const campaign = this.helper.getCampaignContract(campaignAddress, true);
      const tx = await campaign.refund();
      
      console.log('Refund transaction sent:', tx.hash);
      const receipt = await tx.wait();
      console.log('Refund transaction confirmed:', receipt);
      
      return tx;
    } catch (error) {
      console.error('Lỗi hoàn tiền:', error);
      throw new Error(this.helper.parseError(error, 'refund'));
    }
  }
}