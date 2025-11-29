const {ethers} = require("hardhat");

async function info(campaignAddress) {
    const campaign = await ethers.getContractAt("Campaign", campaignAddress);
    console.log(`🎯 Thông tin chi tiết Campaign tại địa chỉ: ${campaignAddress}\n`)
    console.log(`Người tạo: ${await campaign.owner()}`);
    console.log(`Mục tiêu: ${ethers.formatEther(await campaign.targetAmount())} ETH`);
    const createdAt = await campaign.createdAt();
    console.log(`Thời gian tạo: ${new Date(Number(createdAt) * 1000).toLocaleString()}`);
    console.log(`Tổng tiền đã quyên góp: ${ethers.formatEther(await campaign.totalRaised())} ETH`);
    const deadline = await campaign.deadline();
    console.log(`Hạn chót quyên góp: ${new Date(Number(deadline) * 1000).toLocaleString()}`);
    // const isSuccessful = await campaign.isSuccessful();
    // console.log(`Trạng thái chiến dịch: ${isSuccessful ? "THÀNH CÔNG" : "CHƯA THÀNH CÔNG"}`);
    console.log(`Mô tả chiến dịch: ${await campaign.campaignDescription()}\n`);

    console.log("📋 Danh sách người quyên góp:");

    const donors = await campaign.getDonorCount();
    console.log("Tổng số:", donors);
    console.log("Danh sách người quyên góp và số tiền họ đã đóng góp:");
    for (let i = 0; i < donors; i++) {
        const donor = await campaign.donors(i);
        const amount = await campaign.contributions(donor);
        console.log(`- Địa chỉ: ${donor}, Số tiền đóng góp: ${ethers.formatEther(amount)} ETH`);
    }

    const proposalCount = await campaign.nextProposalId();
    console.log(`\n📋 Danh sách đề xuất đã tạo (Tổng số: ${proposalCount}):`);
    for (let i = 0; i < proposalCount; i++) {
        const proposal = await campaign.getProposal(i);
        const voterCount = await campaign.getVoterCount(i);
        console.log(`- Đề xuất #${i}: Mô tả - ${proposal.description}, Số tiền - ${ethers.formatEther(proposal.amount)} ETH, Người nhận - ${proposal.recipient}, Số phiếu ủng hộ - ${proposal.voteYes}, Số phiếu phản đối - ${proposal.voteNo}, Số người bỏ phiếu - ${voterCount}, Đã thực hiện - ${proposal.executed}`);
    }
}

module.exports = info;
// info(campaignAddress).catch((error) => {
//     console.error(error);
//     process.exitCode = 1;
// });