const { ethers } = require("hardhat");

async function main() {
  console.log("🎯 Script tương tác với Campaign contracts\n");

  // Thay đổi địa chỉ này thành địa chỉ CampaignFactory đã deploy
  const FACTORY_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Thay đổi địa chỉ này!
  
//   if (FACTORY_ADDRESS === "0x5FbDB2315678afecb367f032d93F642f64180aa3") {
//     console.log("⚠️  CẢNH BÁO: Vui lòng thay đổi FACTORY_ADDRESS trong script này!");
//     console.log("   Sử dụng địa chỉ CampaignFactory từ kết quả deploy");
//     console.log("   Hoặc chạy: npm run deploy:local trước\n");
//   }

  const [owner, donor1, donor2] = await ethers.getSigners();
  
  try {
    // 1. Kết nối với CampaignFactory
    console.log("🏭 Kết nối với CampaignFactory tại:", FACTORY_ADDRESS);
    const factory = await ethers.getContractAt("CampaignFactory", FACTORY_ADDRESS);
    
    // 2. Tạo một campaign mới
    console.log("\n🎯 Tạo campaign mới...");
    const beneficiary = owner.address;
    const targetAmount = ethers.parseEther("2"); // 2 ETH
    const durationInSeconds = 7200; // 2 giờ
    
    console.log("   📋 Thông tin campaign:");
    console.log("      Beneficiary:", beneficiary);
    console.log("      Target:", ethers.formatEther(targetAmount), "ETH");
    console.log("      Duration: 2 hours");
    
    const createTx = await factory.createCampaign(
      beneficiary,
      targetAmount,
      durationInSeconds
    );
    await createTx.wait();
    
    // 3. Lấy danh sách campaigns
    const campaigns = await factory.getDeployedCampaigns();
    const latestCampaign = campaigns[campaigns.length - 1];
    console.log("   ✅ Campaign được tạo tại:", latestCampaign);
    
    // 4. Kết nối với campaign vừa tạo
    const campaign = await ethers.getContractAt("Campaign", latestCampaign);
    
    // 5. Demo quyên góp
    console.log("\n💰 Demo quyên góp...");
    
    // Donor1 quyên góp
    const donation1 = ethers.parseEther("0.8");
    console.log(`   👤 ${donor1.address.slice(0,8)}... quyên góp ${ethers.formatEther(donation1)} ETH`);
    await campaign.connect(donor1).donate({ value: donation1 });
    
    // Donor2 quyên góp
    const donation2 = ethers.parseEther("0.7");
    console.log(`   👤 ${donor2.address.slice(0,8)}... quyên góp ${ethers.formatEther(donation2)} ETH`);
    await campaign.connect(donor2).donate({ value: donation2 });
    
    // 6. Kiểm tra trạng thái campaign
    console.log("\n📊 Trạng thái campaign:");
    const totalRaised = await campaign.totalRaised();
    const target = await campaign.targetAmount();
    const balance = await campaign.getBalance();
    const deadline = await campaign.deadline();
    
    console.log("   💰 Total raised:", ethers.formatEther(totalRaised), "ETH");
    console.log("   🎯 Target:", ethers.formatEther(target), "ETH");
    console.log("   💳 Contract balance:", ethers.formatEther(balance), "ETH");
    console.log("   ⏰ Deadline:", new Date(Number(deadline) * 1000).toLocaleString());
    
    const progress = (Number(totalRaised) / Number(target)) * 100;
    console.log("   📈 Progress:", progress.toFixed(1) + "%");
    
    // 7. Kiểm tra contributions của từng donor
    console.log("\n👥 Contributions:");
    const contrib1 = await campaign.contributions(donor1.address);
    const contrib2 = await campaign.contributions(donor2.address);
    
    console.log(`   👤 ${donor1.address.slice(0,8)}...: ${ethers.formatEther(contrib1)} ETH`);
    console.log(`   👤 ${donor2.address.slice(0,8)}...: ${ethers.formatEther(contrib2)} ETH`);
    
    console.log("\n✅ Demo hoàn thành!");
    console.log("\n💡 Các thao tác có thể thực hiện tiếp:");
    console.log("   - Chờ hết deadline để test withdraw/refund");
    console.log("   - Quyên góp thêm để đạt target");
    console.log("   - Tạo thêm campaigns khác");
    
  } catch (error) {
    console.error("❌ Lỗi:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });