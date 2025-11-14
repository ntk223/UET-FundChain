const {ethers} = require("hardhat");

async function main() {
    const campaignAddress = "0xCafac3dD18aC6c6e92c921884f9E4176737C052c"
    const campaign = await ethers.getContractAt("Campaign", campaignAddress);

    const owner = await campaign.beneficiary();
    console.log(`Chủ sở hữu chiến dịch là: ${owner}`);

    const voter1 = (await ethers.getSigners())[1];
    const voter2 = (await ethers.getSigners())[2];
    const proposals = await campaign.getProposal(0);
    console.log(`Đề xuất số 0: Mô tả - ${proposals.description}, Số tiền - ${ethers.formatEther(proposals.amount)} ETH, Người nhận - ${proposals.recipient}, Số phiếu ủng hộ - ${proposals.voteYes}, Đã thực hiện - ${proposals.executed}`);
    // const tx = await campaign.connect(voter1).vote(campaign.nextProposalId() - 1, true);
    // await tx.wait();
    // console.log(`Địa chỉ ${voter1.address} đã bỏ phiếu cho đề xuất số ${campaign.nextProposalId() - 1}`);
    console.log(await campaign.nextProposalId());
    const tx2 = await campaign.connect(voter2).vote(Number(await campaign.nextProposalId()) - 1, true);
    await tx2.wait();
    console.log(`Địa chỉ ${voter2.address} đã bỏ phiếu cho đề xuất số ${Number(await campaign.nextProposalId()) - 1}`);

    const executeTx = await campaign.executeProposal(Number(await campaign.nextProposalId()) - 1);
    await executeTx.wait();
    console.log(`Đã thực hiện đề xuất số ${Number(await campaign.nextProposalId()) - 1}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});