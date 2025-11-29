const createCampaign = require("./createCampaign");
const donate = require("./donate");
const info = require("./info");
const proposal = require("./proposal");
const vote = require("./vote");
const proposalInfo = require("./proposalInfo");
const executeProposal = require("./executeProposal");
const {ethers} = require("hardhat");
async function main() {
    const [owner, user1, user2, user3, user4] = await ethers.getSigners();
    // const campaignAddress = await createCampaign();
    const campaignAddress = "0x3B02fF1e626Ed7a8fd6eC5299e2C54e1421B626B";
    // await donate(campaignAddress);
    // await proposal(campaignAddress);
    // const proposalId = 0;

    // await vote(user1, campaignAddress, proposalId, true);
    // await vote(user2, campaignAddress, proposalId, false);
    // await vote(user3, campaignAddress, proposalId, true);
    // await proposalInfo(campaignAddress, proposalId);

    // await executeProposal(campaignAddress, proposalId);

    // await info(campaignAddress);

    console.log("số dư người 4: ", ethers.formatEther(await ethers.provider.getBalance(user4)));
    console.log("Số dư chiến dịch: " + ethers.formatEther(await ethers.provider.getBalance(campaignAddress)));
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});