const {ethers} = require("hardhat");

async function vote(voter,campaignAddress, proposalId, support) {
    const campaign = await ethers.getContractAt("Campaign", campaignAddress);
    const tx = await campaign.connect(voter).vote(proposalId, support);
    await tx.wait();
    console.log(`Đã bỏ phiếu ${support ? "ủng hộ" : "phản đối"} đề xuất #${proposalId} từ địa chỉ ${voter.address}`);
}

module.exports = vote;