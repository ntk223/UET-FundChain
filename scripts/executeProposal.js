const {ethers} = require("hardhat");

async function executeProposal(campaignAddress, proposalId) {
    const campaign = await ethers.getContractAt("Campaign", campaignAddress);
    const tx = await campaign.executeProposal(proposalId);
    await tx.wait();
    console.log(`Đã thực hiện đề xuất #${proposalId} từ chiến dịch tại địa chỉ ${campaignAddress}`);
}

module.exports = executeProposal;