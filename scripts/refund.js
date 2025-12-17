const {ethers} = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

async function main() {
    // const campaignAddress = "0x7bc9A7e2bDf4c4f6b1Ff8Cff272310a4b17F783d"
    // const campaign = await ethers.getContractAt("Campaign", campaignAddress);
    const days = 2;
    // Tua thời gian đến sau deadline
    await time.increase(days * 24 * 3600 + 1); // Tăng thời gian 2 ngày + 1 giây
    // console.log(`⏰ Đã vượt qua deadline của campaign tại địa chỉ ${campaignAddress}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});