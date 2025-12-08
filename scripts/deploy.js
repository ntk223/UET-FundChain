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
      const durationInDays = 10;
      const durationInSeconds = durationInDays * 24 * 3600;
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
          durationInSeconds,
          campaignDescriptions[i]
        );
      }
      console.log("   ✅ Campaign mẫu đã được tạo.");
      console.log();
    }

    // 4. Tóm tắt kết quả
    console.log("🎉 DEPLOY THÀNH CÔNG!");
    console.log("=" .repeat(50));
    console.log("📋 Thông tin contracts:");
    console.log("   🏭 CampaignFactory:", factoryAddress);
    
    if (createSampleCampaign) {
      const campaigns = await factory.getDeployedCampaigns();
      console.log("   🎯 Sample Campaign:", campaigns[0]);
    }
    
    console.log();
    console.log("💡 Hướng dẫn sử dụng:");
    console.log("   1. Lưu lại địa chỉ CampaignFactory");
    console.log("   2. Sử dụng factory.createCampaign() để tạo campaigns mới");
    console.log("   3. Interact với campaigns thông qua địa chỉ của chúng");
    console.log();

    // 5. Xuất thông tin cho frontend (nếu cần)
    const network = await ethers.provider.getNetwork();
    const deploymentInfo = {
      network: network.name,
      chainId: network.chainId.toString(), // Convert BigInt to string
      contracts: {
        CampaignFactory: {
          address: factoryAddress,
          deployer: deployer.address,
          deployedAt: new Date().toISOString()
        }
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
