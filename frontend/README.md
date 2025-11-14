# Campaign DApp Frontend

Frontend React cho ứng dụng crowdfunding phi tập trung.

## 🚀 Cài đặt và Chạy

### 1. Cài đặt dependencies
```bash
cd frontend
npm install
```

### 2. Khởi động Hardhat local node (terminal 1)
```bash
cd ..
npm run node
```

### 3. Deploy smart contracts (terminal 2)  
```bash
npm run deploy:local
```

### 4. Khởi động frontend (terminal 3)
```bash
npm run frontend:start
```

Ứng dụng sẽ mở tại `http://localhost:3000`

## 🔧 Cấu hình

Cập nhật địa chỉ contract trong `src/utils/constants.js` sau khi deploy:

```javascript
export const CONTRACT_ADDRESSES = {
  CAMPAIGN_FACTORY: "0x5FbDB2315678afecb367f032d93F642f64180aa3" // Thay bằng địa chỉ thực
};
```

## 🎯 Tính năng

- ✅ Kết nối MetaMask
- ✅ Xem danh sách campaigns  
- ✅ Tạo campaign mới
- ✅ Quyên góp vào campaigns
- ✅ Rút tiền (beneficiary)
- ✅ Hoàn tiền (donors)
- ✅ Tracking contributions
- ✅ Responsive design

## 🛠 Công nghệ sử dụng

- React 18
- Ethers.js v6
- Tailwind CSS (CDN)
- React Hot Toast
- Lucide React Icons

## 📱 Screenshots

[Thêm screenshots của ứng dụng]

## ⚠️ Lưu ý

- Cần cài đặt MetaMask extension
- Kết nối với Hardhat Local Network (Chain ID: 31337)
- Import private key từ Hardhat để có ETH test