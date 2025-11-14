const {ethers} = require("hardhat");

async function main() {
    const campaignFactoryAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    const [owner] = await ethers.getSigners();
    const factory = await ethers.getContractAt("CampaignFactory", campaignFactoryAddress);

    const beneficiary = owner.address;
    const targetAmount = ethers.parseEther("300.0");
    const durationInSeconds = 3600; // 1 hour

    const tx = await factory.createCampaign(
        beneficiary,
        targetAmount,
        durationInSeconds
    );
    await tx.wait();

    const campaigns = await factory.getDeployedCampaigns();
    const newCampaignAddress = campaigns[campaigns.length - 1];
    console.log(`Campaign mới được tạo tại địa chỉ: ${newCampaignAddress}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});