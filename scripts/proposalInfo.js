const {ethers} = require("hardhat");

async function proposalInfo(campaignAddress, proposalId) {
    const campaign = await ethers.getContractAt("Campaign", campaignAddress);
    const proposal = await campaign.getProposal(proposalId);
    const voterCount = await campaign.getVoterCount(proposalId);

    console.log(`📋 Thông tin đề xuất #${proposalId} tại chiến dịch ${campaignAddress}:`);
    console.log(`- Mô tả: ${proposal.description}`);
    console.log(`- Số tiền: ${ethers.formatEther(proposal.amount)} ETH`);
    console.log(`- Người nhận: ${proposal.recipient}`);
    console.log(`- Số phiếu ủng hộ: ${proposal.voteYes}`);
    console.log(`- Số phiếu phản đối: ${proposal.voteNo}`);
    console.log(`- Số người bỏ phiếu: ${voterCount}`);
    console.log(`- Đã thực hiện: ${proposal.executed}`);
}

module.exports = proposalInfo;