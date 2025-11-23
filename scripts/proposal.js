const {ethers} = require("hardhat");

async function main() {
    const campaignAddress = "0xB7A5bd0345EF1Cc5E66bf61BdeC17D2461fBd968"
    const campaign = await ethers.getContractAt("Campaign", campaignAddress);

    const owner = await campaign.owner();
    console.log(`Chủ sở hữu chiến dịch là: ${owner}`);

    const proposalDescription = "Mua thêm thiết bị y tế";
    const proposalAmount = ethers.parseEther("15.0");
    const recipient = (await ethers.getSigners())[3]; // Thay thế bằng địa chỉ hợp lệ

    const tx = await campaign.createProposal(proposalDescription, proposalAmount, recipient.address);
    await tx.wait();
    console.log(`Đã tạo đề xuất với mô tả: "${proposalDescription}", số tiền: ${ethers.formatEther(proposalAmount)} ETH, người nhận: ${recipient.address}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});