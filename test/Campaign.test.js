const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("Campaign Test - Simple Scenarios", function () {
  let factory;
  let campaign;
  let owner, beneficiary, donor1, donor2;

  beforeEach(async function () {
    // Lấy các tài khoản test
    [owner, beneficiary, donor1, donor2] = await ethers.getSigners();

    // Deploy CampaignFactory
    const CampaignFactory = await ethers.getContractFactory("CampaignFactory");
    factory = await CampaignFactory.deploy();

    // Tạo một campaign mới
    const targetAmount = ethers.parseEther("10"); // Mục tiêu 10 ETH
    const duration = 3600; // 1 giờ

    await factory.createCampaign(beneficiary.address, targetAmount, duration);
    
    // Lấy địa chỉ campaign vừa tạo
    const campaigns = await factory.getDeployedCampaigns();
    const campaignAddress = campaigns[0];
    
    // Kết nối với contract Campaign
    campaign = await ethers.getContractAt("Campaign", campaignAddress);
  });

  // Kịch bản 1: Campaign thành công - rút tiền được
  it("Kịch bản 1: Campaign THÀNH CÔNG - Beneficiary có thể rút tiền", async function () {
    console.log("=== KỊCH BẢN 1: CAMPAIGN THÀNH CÔNG ===");
    
    // 1. Kiểm tra thông tin ban đầu
    console.log("Target amount:", ethers.formatEther(await campaign.targetAmount()), "ETH");
    console.log("Total raised ban đầu:", ethers.formatEther(await campaign.totalRaised()), "ETH");
    
    // 2. Donor1 quyên góp 6 ETH
    await campaign.connect(donor1).donate({ value: ethers.parseEther("6") });
    console.log("Donor1 quyên góp: 6 ETH");
    console.log("Total raised sau donor1:", ethers.formatEther(await campaign.totalRaised()), "ETH");
    
    // 3. Donor2 quyên góp 4 ETH
    await campaign.connect(donor2).donate({ value: ethers.parseEther("4") });
    console.log("Donor2 quyên góp: 4 ETH");
    console.log("Total raised sau donor2:", ethers.formatEther(await campaign.totalRaised()), "ETH");
    
    // 4. Kiểm tra đã đạt mục tiêu
    const totalRaised = await campaign.totalRaised();
    const target = await campaign.targetAmount();
    expect(totalRaised).to.equal(ethers.parseEther("10"));
    console.log("✅ Đã đạt mục tiêu!");
    
    // 5. Tua thời gian đến sau deadline
    await time.increase(3601); // Tăng thời gian 1 giờ 1 giây
    console.log("⏰ Đã hết hạn campaign");
    
    // 6. Beneficiary rút tiền
    const balanceBefore = await ethers.provider.getBalance(beneficiary.address);
    console.log("Balance trước khi rút:", ethers.formatEther(balanceBefore), "ETH");
    
    const tx = await campaign.connect(beneficiary).withdrawFunds();
    await tx.wait();
    
    const balanceAfter = await ethers.provider.getBalance(beneficiary.address);
    console.log("Balance sau khi rút:", ethers.formatEther(balanceAfter), "ETH");
    
    // Kiểm tra contract đã trống
    expect(await campaign.getBalance()).to.equal(0);
    console.log("✅ Rút tiền thành công! Contract balance = 0");
  });

  // Kịch bản 2: Campaign thất bại - hoàn tiền
  it("Kịch bản 2: Campaign THẤT BẠI - Donors được hoàn tiền", async function () {
    console.log("=== KỊCH BẢN 2: CAMPAIGN THẤT BẠI ===");
    
    // 1. Kiểm tra thông tin ban đầu
    console.log("Target amount:", ethers.formatEther(await campaign.targetAmount()), "ETH");
    
    // 2. Chỉ quyên góp một phần (không đủ mục tiêu)
    await campaign.connect(donor1).donate({ value: ethers.parseEther("3") });
    console.log("Donor1 quyên góp: 3 ETH");
    
    await campaign.connect(donor2).donate({ value: ethers.parseEther("2") });
    console.log("Donor2 quyên góp: 2 ETH");
    
    const totalRaised = await campaign.totalRaised();
    console.log("Total raised:", ethers.formatEther(totalRaised), "ETH");
    console.log("❌ Không đạt mục tiêu 10 ETH");
    
    // 3. Tua thời gian đến sau deadline
    await time.increase(3601);
    console.log("⏰ Đã hết hạn campaign");
    
    // 4. Kiểm tra beneficiary KHÔNG THỂ rút tiền
    await expect(
      campaign.connect(beneficiary).withdrawFunds()
    ).to.be.revertedWith("Campaign did not meet its target");
    console.log("✅ Beneficiary không thể rút tiền (đúng như mong đợi)");
    
    // 5. Donor1 hoàn tiền
    const donor1BalanceBefore = await ethers.provider.getBalance(donor1.address);
    console.log("Donor1 balance trước refund:", ethers.formatEther(donor1BalanceBefore), "ETH");
    
    const refundTx1 = await campaign.connect(donor1).refund();
    await refundTx1.wait();
    
    const donor1BalanceAfter = await ethers.provider.getBalance(donor1.address);
    console.log("Donor1 balance sau refund:", ethers.formatEther(donor1BalanceAfter), "ETH");
    console.log("✅ Donor1 đã được hoàn tiền 3 ETH");
    
    // 6. Donor2 hoàn tiền
    const donor2BalanceBefore = await ethers.provider.getBalance(donor2.address);
    
    const refundTx2 = await campaign.connect(donor2).refund();
    await refundTx2.wait();
    
    const donor2BalanceAfter = await ethers.provider.getBalance(donor2.address);
    console.log("✅ Donor2 đã được hoàn tiền 2 ETH");
    
    // 7. Kiểm tra contract đã trống
    expect(await campaign.getBalance()).to.equal(0);
    console.log("✅ Tất cả đã được hoàn tiền! Contract balance = 0");
  });
});
