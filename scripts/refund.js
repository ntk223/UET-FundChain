const {ethers} = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

async function main() {
    const campaignAddress = "0x10C6E9530F1C1AF873a391030a1D9E8ed0630D26"
    const campaign = await ethers.getContractAt("Campaign", campaignAddress);
    const [owner, donator1, donator2] = await ethers.getSigners();
    console.log("Owner balance before donation:", ethers.formatEther(await ethers.provider.getBalance(owner.address)));
    console.log("Donator1 balance before donation:", ethers.formatEther(await ethers.provider.getBalance(donator1.address)));
    console.log("Donator2 balance before donation:", ethers.formatEther(await ethers.provider.getBalance(donator2.address)));

    const tx1 = await campaign.connect(donator1).donate({ value: ethers.parseEther("100") });
    const tx2 = await campaign.connect(donator2).donate({ value: ethers.parseEther("100") });
    console.log("-------------------------------------------------------");
    console.log("Owner balance after donation:", ethers.formatEther(await ethers.provider.getBalance(owner.address)));
    console.log("Donator1 balance after donation:", ethers.formatEther(await ethers.provider.getBalance(donator1.address)));
    console.log("Donator2 balance after donation:", ethers.formatEther(await ethers.provider.getBalance(donator2.address)));
    console.log("Campaign total raised after donations:", ethers.formatEther(await campaign.totalRaised()));
    await time.increase(7201); // Tăng thời gian 2 giờ 1 giây
    console.log("⏰ Đã hết hạn campaign");

    const refund1 = await campaign.connect(donator1).refund();
    const refund2 = await campaign.connect(donator2).refund();
    console.log("Refunds đã được xử lý.");
    console.log("-------------------------------------------------------");
    console.log("Owner balance after refund:", ethers.formatEther(await ethers.provider.getBalance(owner.address)));
    console.log("Donator1 balance after refund:", ethers.formatEther(await ethers.provider.getBalance(donator1.address)));
    console.log("Donator2 balance after refund:", ethers.formatEther(await ethers.provider.getBalance(donator2.address)));

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});