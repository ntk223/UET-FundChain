const {ethers} = require("hardhat");

async function createCampaign() {
    const campaignFactoryAddress = "0x0165878A594ca255338adfa4d48449f69242Eb8F";
    const [owner] = await ethers.getSigners();
    const factory = await ethers.getContractAt("CampaignFactory", campaignFactoryAddress);

    const beneficiary = owner.address;
    const targetAmount = ethers.parseEther("300.0");
    const durationInSeconds = 3600; // 1 hour
    const campaignDescription = "This is a sample campaign description.";

    const tx = await factory.createCampaign(
        beneficiary,
        targetAmount,
        durationInSeconds,
        campaignDescription
    );
    await tx.wait();

    const campaigns = await factory.getDeployedCampaigns();
    const newCampaignAddress = campaigns[campaigns.length - 1];
    console.log(`Campaign mới được tạo tại địa chỉ: ${newCampaignAddress}`);
    return newCampaignAddress;
}

module.exports = createCampaign;

// createCampaign().catch((error) => {
//     console.error(error);
//     process.exitCode = 1;
// });