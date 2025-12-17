const { ethers } = require("hardhat");
const {createCampaign} = require("./createCampaign");
async function main() {
  console.log("🚀 Bắt đầu deploy smart contracts...\n");

  // Lấy thông tin deployer
  const [deployer] = await ethers.getSigners();
  console.log("📋 Thông tin Deployer:");
  console.log("   Địa chỉ:", deployer.address);
  console.log("   Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH");
  console.log();

  try {
    // 1. Deploy CampaignFactory
    console.log("📦 Đang deploy CampaignFactory...");
    const CampaignFactory = await ethers.getContractFactory("CampaignFactory");
    const factory = await CampaignFactory.deploy();
    
    console.log("   ⏳ Chờ confirmation...");
    await factory.waitForDeployment();
    
    const factoryAddress = await factory.getAddress();
    console.log("   ✅ CampaignFactory deployed tại địa chỉ:", factoryAddress);
    console.log();

    // 2. Verify deployment
    console.log("🔍 Kiểm tra deployment...");
    const deployedCampaigns = await factory.getDeployedCampaigns();
    console.log("   📊 Số campaigns hiện tại:", deployedCampaigns.length);
    console.log();

    // 3. Tạo một campaign mẫu (tùy chọn)
    const createSampleCampaign = true;
    
    if (createSampleCampaign) {
      console.log("🎯 Tạo campaign mẫu...");
      const [owner1, owner2, owner3, owner4, owner5] = await ethers.getSigners();
      const targetAmount = [ethers.parseEther("100.0"), ethers.parseEther("200.0"), ethers.parseEther("300.0"), ethers.parseEther("400.0"), ethers.parseEther("500.0")];
      const durationInDays = [1, 2, 3, 4, 5];
      const durationInSeconds = durationInDays.map(days => days * 24 * 3600);
      const owners = [owner1.address, owner2.address, owner3.address, owner4.address, owner5.address];
      const campaignDescriptions = [
        "Hỗ trợ giáo dục vùng sâu vùng xa",
        "Cứu trợ thiên tai bão lụt",
        "Bảo vệ môi trường và động vật hoang dã",
        "Nâng cao y tế cộng đồng",
        "Phát triển nghệ thuật và văn hóa"
      ];
      for (let i = 0; i < owners.length; i++) {
        console.log(`   ➡ Tạo campaign cho owner: ${owners[i]}`);
        const tx = await factory.createCampaign(
          owners[i],
          targetAmount[i],
          durationInSeconds[i],
          campaignDescriptions[i]
        );
        if (i === 0) {
          const [donor1, donor2] = await ethers.getSigners();
          // Donor1 donate 150 ETH
          const campaignAddress = (await factory.getDeployedCampaigns())[ (await factory.getDeployedCampaigns()).length - 1];
          const Campaign = await ethers.getContractFactory("Campaign");
          const campaign = Campaign.attach(campaignAddress);
          console.log(`      💰 Donor1 (${donor1.address}) donate 60 ETH vào campaign...`);
          const donateTx1 = await campaign.connect(donor1).donate({ value: ethers.parseEther("60.0") });
          await donateTx1.wait();
          console.log(`      ✅ Donor1 đã donate 60 ETH`);
          
          // Donor2 donate 100 ETH
          console.log(`      💰 Donor2 (${donor2.address}) donate 40 ETH vào campaign...`);
          const donateTx2 = await campaign.connect(donor2).donate({ value: ethers.parseEther("40.0") });
          await donateTx2.wait();
          console.log(`      ✅ Donor2 đã donate 40 ETH`);
        }
      }
      console.log("   ✅ Campaign mẫu đã được tạo.");
      console.log();
    }

    // 4. Tạo campaign hết hạn để test refund
    console.log("⏰ Tạo campaign hết hạn cho refund test...");
    const [donor1, owner ] = await ethers.getSigners();
    
    // Tạo campaign với deadline 10 giây
    console.log(`   ➡ Tạo campaign ngắn hạn (10 giây)...`);
    const expiredCampaignTarget = ethers.parseEther("50.0");
    const shortDuration = 10; // 10 giây
    const expiredTx = await factory.createCampaign(
      owner.address,
      expiredCampaignTarget,
      shortDuration,
      "Campaign test refund - Hỗ trợ khẩn cấp"
    );
    await expiredTx.wait();
    
    // Lấy địa chỉ campaign vừa tạo
    const allCampaigns = await factory.getDeployedCampaigns();
    const expiredCampaignAddress = allCampaigns[allCampaigns.length - 1];
    console.log(`   📍 Campaign address: ${expiredCampaignAddress}`);
    
    // Donate vào campaign (deployer donate 10 ETH, không đủ target 50 ETH)
    console.log(`   💰 Deployer donate 10 ETH vào campaign...`);
    const Campaign = await ethers.getContractFactory("Campaign");
    const expiredCampaign = Campaign.attach(expiredCampaignAddress);
    const donateTx = await expiredCampaign.connect(donor1).donate({ value: ethers.parseEther("10.0") });
    await donateTx.wait();
    console.log(`   ✅ Đã donate 10 ETH`);
    
    // Tăng thời gian blockchain để campaign hết hạn
    console.log(`   ⏰ Tăng thời gian blockchain 15 giây...`);
    await ethers.provider.send("evm_increaseTime", [15]);
    await ethers.provider.send("evm_mine");
    console.log(`   ✅ Campaign đã hết hạn!`);
    
    // Kiểm tra trạng thái
    const isEnded = await expiredCampaign.isEnded();
    const isSuccessful = await expiredCampaign.isSuccessful();
    const totalRaised = await expiredCampaign.totalRaised();
    
    console.log(`   📊 Trạng thái campaign:`);
    console.log(`      - Đã hết hạn: ${isEnded}`);
    console.log(`      - Thành công: ${isSuccessful}`);
    console.log(`      - Tổng raised: ${ethers.formatEther(totalRaised)} ETH / ${ethers.formatEther(expiredCampaignTarget)} ETH`);
    console.log(`   💡 Donor (${donor1.address}) có thể refund 10 ETH!`);
    console.log();

    // 5. Tóm tắt kết quả
    console.log("🎉 DEPLOY THÀNH CÔNG!");
    console.log("=" .repeat(50));
    console.log("📋 Thông tin contracts:");
    console.log("   🏭 CampaignFactory:", factoryAddress);
    
    if (createSampleCampaign) {
      const campaigns = await factory.getDeployedCampaigns();
      console.log("   🎯 Sample Campaigns:", campaigns.length, "campaigns");
      console.log("   📍 Campaign đầu tiên:", campaigns[0]);
      console.log("   💸 Campaign hết hạn (refund):", campaigns[campaigns.length - 1]);
    }
    
    console.log();
    console.log("💡 Hướng dẫn sử dụng:");
    console.log("   1. Lưu lại địa chỉ CampaignFactory");
    console.log("   2. Sử dụng factory.createCampaign() để tạo campaigns mới");
    console.log("   3. Interact với campaigns thông qua địa chỉ của chúng");
    console.log("   4. Chạy 'npm run refund' để test refund cho campaign hết hạn");
    console.log();

    // 6. Xuất thông tin cho frontend (nếu cần)
    const network = await ethers.provider.getNetwork();
    const finalCampaigns = await factory.getDeployedCampaigns();
    const deploymentInfo = {
      network: network.name,
      chainId: network.chainId.toString(), // Convert BigInt to string
      contracts: {
        CampaignFactory: {
          address: factoryAddress,
          deployer: deployer.address,
          deployedAt: new Date().toISOString()
        }
      },
      campaigns: {
        total: finalCampaigns.length,
        expiredCampaignForRefund: finalCampaigns[finalCampaigns.length - 1]
      }
    };

    // Ghi thông tin deploy vào file JSON
    const fs = require('fs');
    const path = require('path');
    
    const deployDir = path.join(__dirname, '..', 'deployments');
    if (!fs.existsSync(deployDir)) {
      fs.mkdirSync(deployDir, { recursive: true });
    }
    
    const deploymentFile = path.join(deployDir, 'deployment-info.json');
    fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
    
    console.log("📄 Thông tin deployment đã được lưu tại:", deploymentFile);

  } catch (error) {
    console.error("❌ LỖI TRONG QUÁ TRÌNH DEPLOY:");
    console.error(error);
    process.exit(1);
  }
}


// Thực thi script
main()
  .then(() => {
    console.log("\n✨ Deploy script hoàn thành!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Lỗi không mong đợi:", error);
    process.exit(1);
  });
