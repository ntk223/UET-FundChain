const {ethers} = require("hardhat");

async function main() {
    const campaignAddress = "0xCafac3dD18aC6c6e92c921884f9E4176737C052c"
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
 