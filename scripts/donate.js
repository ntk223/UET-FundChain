const {ethers} = require("hardhat");

async function donate(campaignAddress) {
    const campaign = await ethers.getContractAt("Campaign", campaignAddress);
    const donationAmount = ethers.parseEther("10.0");

    const [owner, donator1, donator2, donator3] = await ethers.getSigners();
     await campaign.connect(donator1).donate({ value: donationAmount });
     await campaign.connect(donator2).donate({ value: 2n * donationAmount });
     await campaign.connect(donator3).donate({ value: 3n * donationAmount });
    const balanceCampaign = await campaign.totalRaised();
    console.log(`Số dư hiện tại của chiến dịch: ${ethers.formatEther(balanceCampaign)} ETH`);
}

module.exports = donate;
// donate().catch((error) => {
//     console.error(error);
//     process.exitCode = 1;
// });