const {ethers} = require("hardhat");

async function main() {
    const campaignAddress = "0x427f7c59ED72bCf26DfFc634FEF3034e00922DD8"
    const campaign = await ethers.getContractAt("Campaign", campaignAddress);
    // const [owner, donator1, donator2] = await ethers.getSigners();
    // const amount1 = await campaign.contributions(donator1.address);
    // const amount2 = await campaign.contributions(donator2.address);
    // console.log(campaign.donors());
    // console.log("Danh sách người quyên góp và số tiền họ đã đóng góp:");
    // console.log(`- Địa chỉ: ${donator1.address}, Số tiền đóng góp: ${ethers.formatEther(amount1)} ETH`);
    // console.log(`- Địa chỉ: ${donator2.address}, Số tiền đóng góp: ${ethers.formatEther(amount2)} ETH`);

    const donors = await campaign.getDonorCount();
    console.log("Tổng số:", donors);
    console.log("Danh sách người quyên góp và số tiền họ đã đóng góp:");
    for (let i = 0; i < donors; i++) {
        const donor = await campaign.donors(i);
        const amount = await campaign.contributions(donor);
        console.log(`- Địa chỉ: ${donor}, Số tiền đóng góp: ${ethers.formatEther(amount)} ETH`);
    }

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});