const {ethers} = require("hardhat");

async function main() {
    const campaignAddress = "0xB7A5bd0345EF1Cc5E66bf61BdeC17D2461fBd968"
    const campaign = await ethers.getContractAt("Campaign", campaignAddress);
    const donationAmount = ethers.parseEther("10.0");

    const [owner, donator1, donator2] = await ethers.getSigners();
     await campaign.connect(donator1).donate({ value: donationAmount });
     console.log(`Đã quyên góp ${ethers.formatEther(donationAmount)} ETH từ địa chỉ ${donator1.address} đến chiến dịch tại địa chỉ ${campaignAddress}`);
    //     await campaign.connect(donator2).donate({ value: donationAmount });
    // console.log(`Đã quyên góp ${ethers.formatEther(donationAmount)} ETH từ địa chỉ ${donator2.address} đến chiến dịch tại địa chỉ ${campaignAddress}`);
    const balanceCampaign = await campaign.totalRaised();
    console.log(`Số dư hiện tại của chiến dịch: ${ethers.formatEther(balanceCampaign)} ETH`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});