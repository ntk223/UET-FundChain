# 📋 TÀI LIỆU DỰ ÁN UET FUNDCHAIN

## 🎯 TỔNG QUAN DỰ ÁN

### Tên dự án
**UET FundChain** - Nền tảng gây quỹ cộng đồng phi tập trung dựa trên Blockchain

### Mô tả
UET FundChain là một nền tảng gây quỹ từ thiện và crowdfunding sử dụng công nghệ Blockchain và Smart Contract để tạo ra sự minh bạch, tin cậy và hiệu quả trong mọi chiến dịch. Người đóng góp có toàn quyền kiểm soát và quyết định cách sử dụng tiền quyên góp thông qua cơ chế bỏ phiếu DAO (Decentralized Autonomous Organization).

### Mục tiêu
- Tăng cường minh bạch trong hoạt động gây quỹ từ thiện
- Loại bỏ trung gian, giảm chi phí giao dịch
- Trao quyền cho người đóng góp trong việc giám sát và quyết định sử dụng quỹ
- Xây dựng niềm tin cộng đồng thông qua công nghệ Blockchain
- Tự động hóa quy trình hoàn tiền khi chiến dịch thất bại

---

## 👥 USE CASES (CÁC TRƯỜNG HỢP SỬ DỤNG)

### 1. Người tạo chiến dịch (Campaign Owner)

#### UC-01: Tạo chiến dịch gây quỹ
**Actor**: Người tạo chiến dịch
**Mô tả**: Tạo một chiến dịch gây quỹ mới với mục tiêu và thời hạn cụ thể
**Tiền điều kiện**: 
- Đã kết nối ví MetaMask
- Có đủ ETH để trả phí gas

**Luồng chính**:
1. Người dùng truy cập trang "Tạo chiến dịch"
2. Nhập thông tin:
   - Địa chỉ ví nhận tiền (owner)
   - Mục tiêu gây quỹ (ETH)
   - Thời hạn chiến dịch (ngày)
   - Mô tả chi tiết chiến dịch
3. Xác nhận giao dịch trong MetaMask
4. Hệ thống deploy smart contract Campaign mới
5. Chiến dịch được tạo thành công và hiển thị trong danh sách

**Kết quả**: Một smart contract Campaign mới được deploy trên blockchain

#### UC-02: Tạo đề xuất chi tiêu (Proposal)
**Actor**: Người sở hữu chiến dịch
**Mô tả**: Tạo đề xuất về cách sử dụng tiền đã quyên góp
**Tiền điều kiện**: 
- Là owner của campaign
- Campaign đã đạt mục tiêu (successful)

**Luồng chính**:
1. Owner truy cập chi tiết chiến dịch của mình
2. Nhấn "Tạo đề xuất mới"
3. Nhập thông tin:
   - Mô tả đề xuất
   - Số tiền cần chi (ETH)
   - Địa chỉ người nhận
4. Xác nhận giao dịch
5. Đề xuất được tạo và mở cho donors vote

**Kết quả**: Proposal được lưu trên blockchain, sẵn sàng để vote

#### UC-03: Thực thi đề xuất đã được phê duyệt
**Actor**: Bất kỳ ai (thường là owner)
**Mô tả**: Thực hiện chuyển tiền theo đề xuất đã được phê duyệt
**Tiền điều kiện**: 
- Đề xuất đạt quorum (>50% donors đã vote)
- Phiếu ủng hộ > phiếu phản đối
- Campaign có đủ số dư

**Luồng chính**:
1. Kiểm tra trạng thái đề xuất
2. Nhấn "Thực thi đề xuất"
3. Xác nhận giao dịch
4. Smart contract tự động chuyển tiền đến địa chỉ recipient
5. Đề xuất được đánh dấu là "Đã thực thi"

**Kết quả**: Tiền được chuyển theo đề xuất, giao dịch ghi nhận trên blockchain

---

### 2. Người đóng góp (Donor)

#### UC-04: Quyên góp cho chiến dịch
**Actor**: Người đóng góp
**Mô tả**: Đóng góp ETH cho một chiến dịch đang hoạt động
**Tiền điều kiện**: 
- Đã kết nối ví MetaMask
- Campaign đang trong thời hạn (active)
- Có đủ ETH trong ví

**Luồng chính**:
1. Duyệt danh sách chiến dịch
2. Chọn chiến dịch muốn đóng góp
3. Nhấn "Quyên góp"
4. Nhập số tiền ETH
5. Xác nhận giao dịch trong MetaMask
6. Giao dịch được xử lý
7. Số tiền đóng góp được cập nhật

**Kết quả**: 
- ETH được chuyển vào smart contract
- Thông tin donor được lưu trữ
- Quyền vote được cấp theo số tiền đóng góp

#### UC-05: Bỏ phiếu cho đề xuất
**Actor**: Người đã đóng góp
**Mô tả**: Vote ủng hộ hoặc phản đối một đề xuất chi tiêu
**Tiền điều kiện**: 
- Đã đóng góp cho campaign
- Chưa vote cho đề xuất này
- Đề xuất chưa được thực thi

**Luồng chính**:
1. Xem danh sách đề xuất trong chiến dịch
2. Đọc chi tiết đề xuất
3. Chọn "Ủng hộ" hoặc "Phản đối"
4. Xác nhận giao dịch
5. Vote được ghi nhận với weight = sqrt(contribution)

**Kết quả**: 
- Vote được lưu trên blockchain
- Không thể vote lại cho đề xuất này
- Tổng phiếu ủng hộ/phản đối được cập nhật

#### UC-06: Yêu cầu hoàn tiền khi chiến dịch thất bại
**Actor**: Người đã đóng góp
**Mô tả**: Lấy lại tiền đã đóng góp khi campaign không đạt mục tiêu
**Tiền điều kiện**: 
- Campaign đã hết hạn (deadline passed)
- Campaign không đạt target (failed)
- Đã có contribution

**Luồng chính**:
1. Truy cập chi tiết chiến dịch đã thất bại
2. Hệ thống hiển thị "RefundButton" với số tiền có thể hoàn
3. Nhấn "Yêu cầu hoàn tiền"
4. Xác nhận giao dịch
5. Smart contract tự động chuyển tiền về ví

**Kết quả**: 
- ETH được hoàn lại đầy đủ vào ví donor
- Contribution được reset về 0

---

### 3. Người xem (Visitor)

#### UC-07: Xem danh sách chiến dịch
**Actor**: Bất kỳ ai
**Mô tả**: Duyệt và tìm kiếm các chiến dịch đang hoạt động
**Tiền điều kiện**: Truy cập website

**Luồng chính**:
1. Truy cập trang chủ
2. Xem danh sách chiến dịch với thông tin:
   - Mục tiêu và tiến độ
   - Thời gian còn lại
   - Số người đóng góp
   - Trạng thái (Active/Success/Failed)
3. Lọc theo trạng thái
4. Sắp xếp theo thời gian hoặc tiến độ

**Kết quả**: Hiển thị danh sách chiến dịch phù hợp

#### UC-08: Xem chi tiết chiến dịch
**Actor**: Bất kỳ ai
**Mô tả**: Xem thông tin đầy đủ về một chiến dịch
**Tiền điều kiện**: Có địa chỉ campaign hợp lệ

**Luồng chính**:
1. Nhấn vào một chiến dịch
2. Xem thông tin chi tiết:
   - Mô tả đầy đủ
   - Tiến độ gây quỹ với biểu đồ
   - Danh sách donors
   - Danh sách proposals
   - Lịch sử events
3. Xem thống kê:
   - Tổng đã quyên góp
   - Số người đóng góp
   - Số tiền còn lại trong contract
   - Tổng đã sử dụng

**Kết quả**: Thông tin minh bạch và đầy đủ về chiến dịch

#### UC-09: Xem thống kê tổng quan nền tảng
**Actor**: Bất kỳ ai
**Mô tả**: Xem các chỉ số thống kê về toàn bộ nền tảng
**Tiền điều kiện**: Truy cập trang Statistics

**Luồng chính**:
1. Nhấn "Thống kê" trên navigation
2. Xem các metrics:
   - Tổng số dự án
   - Số dự án đang hoạt động
   - Số dự án thành công
   - Tổng đã quyên góp (ETH)
   - Tỷ lệ thành công
   - Top chiến dịch
3. Xem biểu đồ phân bố trạng thái

**Kết quả**: Cái nhìn tổng quan về hoạt động của nền tảng

---

## 🏗️ KIẾN TRÚC HỆ THỐNG

### Kiến trúc tổng quan
```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                        │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────┐ │
│  │  Pages  │  │Components│  │  Hooks   │  │   Utils     │ │
│  │         │  │          │  │          │  │             │ │
│  │ Landing │  │ Campaign │  │useCampign│  │ Contract    │ │
│  │Campaign │  │ Proposal │  │ useAuth  │  │ Service     │ │
│  │ Details │  │ Donation │  │ useEvents│  │ Event Mgr   │ │
│  │  Stats  │  │  Refund  │  │          │  │             │ │
│  └─────────┘  └──────────┘  └──────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
                           ↕ (ethers.js)
┌─────────────────────────────────────────────────────────────┐
│                     WEB3 LAYER                              │
│  ┌──────────────┐                                           │
│  │  MetaMask    │  (User's Ethereum Wallet)                │
│  └──────────────┘                                           │
└─────────────────────────────────────────────────────────────┘
                           ↕ (JSON-RPC)
┌─────────────────────────────────────────────────────────────┐
│              BLOCKCHAIN LAYER (Ethereum)                    │
│  ┌──────────────────┐     ┌──────────────────┐            │
│  │ CampaignFactory  │────→│   Campaign (n)   │            │
│  │  Smart Contract  │     │  Smart Contracts │            │
│  │                  │     │                  │            │
│  │ - Create Campaigns│    │ - Donate         │            │
│  │ - Track Campaigns │    │ - Create Proposal│            │
│  │                  │     │ - Vote           │            │
│  │                  │     │ - Execute        │            │
│  │                  │     │ - Refund         │            │
│  └──────────────────┘     └──────────────────┘            │
│                                                             │
│  ┌─────────────────────────────────────────────┐          │
│  │        Hardhat Local Node / Testnet          │          │
│  │         (Development Environment)            │          │
│  └─────────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

### Luồng dữ liệu chính

1. **User → Frontend**: Tương tác qua UI
2. **Frontend → MetaMask**: Request ký giao dịch
3. **MetaMask → Blockchain**: Gửi signed transaction
4. **Blockchain**: Thực thi smart contract
5. **Blockchain → Frontend**: Event logs, transaction receipts
6. **Frontend → User**: Cập nhật UI, thông báo

---

## 💻 CÔNG NGHỆ SỬ DỤNG

### 1. Blockchain & Smart Contract

#### Solidity ^0.8.20
- Ngôn ngữ lập trình smart contract chính thức của Ethereum
- Sử dụng để viết Campaign.sol và CampaignFactory.sol
- Hỗ trợ các tính năng: modifiers, events, mappings, structs

#### Hardhat
- Framework phát triển Ethereum hàng đầu
- Tính năng:
  - Local blockchain node (Hardhat Network)
  - Deploy và test smart contracts
  - Console logging trong Solidity
  - Gas reporter
  - TypeScript support

**Packages**:
- `@nomicfoundation/hardhat-toolbox`: Toolbox đầy đủ
- `hardhat`: ^2.22.4

#### OpenZeppelin Contracts ^5.4.0
- Thư viện smart contract đã được audit
- Sử dụng các pattern an toàn và best practices
- Tham khảo: ReentrancyGuard, Ownable patterns

### 2. Frontend

#### React 18.2.0
- Thư viện UI component-based hiện đại
- Hooks API: useState, useEffect, useCallback, useMemo
- Context API: CampaignContext, AuthContext
- React Router v7.9.6: Navigation và routing

#### Ethers.js ^6.8.0
- Thư viện JavaScript để tương tác với Ethereum
- Tính năng chính:
  - BrowserProvider: Kết nối MetaMask
  - Contract: Tương tác smart contract
  - Formatters: formatEther, parseEther
  - Event listeners: Lắng nghe blockchain events

#### Styling & UI

**Tailwind CSS**
- Utility-first CSS framework
- Custom design system với gradient orange-pink
- Responsive design
- Custom animations

**Lucide React ^0.263.1**
- Thư viện icon SVG hiện đại
- Icons sử dụng: 
  - ArrowRight, Users, TrendingUp, Shield
  - CheckCircle, Lock, Globe, Zap
  - Vote, RefreshCw, Loader2, RotateCcw

**React Hot Toast ^2.4.1**
- Notification system đẹp và dễ sử dụng
- Toast cho: success, error, loading states

#### State Management

**React Context API**
- CampaignContext: Quản lý state campaigns
- AuthContext: Quản lý wallet connection
- Custom Hooks:
  - useCampaign(): CRUD operations
  - useAuth(): Wallet connection
  - useEvents(): Blockchain event listening
  - useLoadingState(): Loading states

### 3. Development Tools

#### Package Managers
- npm: Quản lý dependencies
- Scripts: Automation tasks

#### Code Quality
- ESLint: JavaScript linting
- React Scripts: Build tools từ Create React App

#### Version Control
- Git: Source control
- GitHub: Repository hosting

---

## 📊 CẤU TRÚC DỰ ÁN

```
BlockchainProject/
├── contracts/                      # Smart Contracts
│   ├── Campaign.sol               # Main campaign contract
│   └── CampaignFactory.sol        # Factory pattern
│
├── scripts/                        # Deployment & interaction scripts
│   ├── deploy.js                  # Deploy contracts
│   ├── createCampaign.js          # Create campaign
│   ├── donate.js                  # Test donation
│   ├── proposal.js                # Create proposal
│   ├── vote.js                    # Vote on proposal
│   ├── executeProposal.js         # Execute proposal
│   ├── refund.js                  # Test refund
│   └── info.js                    # Get campaign info
│
├── test/                           # Smart contract tests
│   └── Campaign.test.js
│
├── frontend/                       # React Application
│   ├── public/
│   │   └── index.html
│   │
│   └── src/
│       ├── components/            # React Components
│       │   ├── Header/
│       │   │   ├── Header.js
│       │   │   └── WalletConnection.js
│       │   │
│       │   ├── Footer/
│       │   │   └── Footer.js
│       │   │
│       │   ├── Main/
│       │   │   ├── CampaignCard.js
│       │   │   ├── CampaignList.js
│       │   │   ├── CreateCampaign.js
│       │   │   ├── DonateForm.js
│       │   │   ├── CreateProposal.js
│       │   │   └── ...
│       │   │
│       │   └── CampaignDetail/
│       │       ├── CampaignHeader.js
│       │       ├── CampaignProgress.js
│       │       ├── CampaignTabs.js
│       │       ├── CampaignProposals.js
│       │       ├── ProposalCard.js
│       │       ├── DonorsList.js
│       │       ├── EventFeed.js
│       │       ├── RefundButton.js
│       │       └── ...
│       │
│       ├── page/                  # Pages/Routes
│       │   ├── LandingPage.js
│       │   ├── CampaignPage.js
│       │   ├── CampaignDetailPage.js
│       │   └── StatisticsPage.js
│       │
│       ├── hooks/                 # Custom Hooks
│       │   ├── useCampaign.js
│       │   ├── useAuth.js
│       │   ├── useEvents.js
│       │   └── useLoadingState.js
│       │
│       ├── utils/                 # Utilities
│       │   ├── contractService.js      # Main service
│       │   ├── contractHelpers.js      # Helper functions
│       │   ├── campaignOperations.js   # Write operations
│       │   ├── campaignQueries.js      # Read operations
│       │   ├── eventService.js         # Event listening
│       │   ├── eventManager.js         # Event processing
│       │   ├── constants.js            # Contract ABI & addresses
│       │   ├── config.js               # App configuration
│       │   └── notifications.js        # Toast messages
│       │
│       ├── App.js                 # Main App component
│       ├── index.js               # Entry point
│       └── index.css              # Global styles
│
├── artifacts/                      # Compiled contracts
├── cache/                          # Build cache
├── deployments/                    # Deployment info
│   └── deployment-info.json
│
├── hardhat.config.js              # Hardhat configuration
├── package.json                   # Root dependencies
├── README.md                      # Setup instructions
└── docs.txt                       # This documentation

```

---

## 🔐 SMART CONTRACT SPECIFICATION

### CampaignFactory.sol

**Mục đích**: Factory contract để tạo và quản lý các Campaign contracts

**State Variables**:
```solidity
address[] public deployedCampaigns;  // Danh sách địa chỉ các campaigns đã tạo
```

**Functions**:

1. **createCampaign**
```solidity
function createCampaign(
    address payable _owner,
    uint256 _target,
    uint256 _durationInSeconds,
    string memory _campaignDescription
) public returns (address)
```
- Tạo campaign mới
- Deploy contract Campaign
- Lưu địa chỉ vào deployedCampaigns
- Emit event: CampaignCreated
- Return: Địa chỉ campaign mới

2. **getDeployedCampaigns**
```solidity
function getDeployedCampaigns() public view returns (address[] memory)
```
- Lấy danh sách tất cả campaigns
- Return: Mảng địa chỉ campaigns

---

### Campaign.sol

**Mục đích**: Smart contract chính quản lý một chiến dịch gây quỹ

**State Variables**:
```solidity
address payable public immutable owner;      // Người tạo campaign
uint256 public immutable targetAmount;       // Mục tiêu (wei)
uint256 public immutable deadline;           // Thời hạn (timestamp)
uint256 public totalRaised;                  // Tổng đã quyên góp
string public campaignDescription;           // Mô tả
uint256 public createdAt;                    // Thời điểm tạo

address[] public donors;                     // Danh sách donors
mapping(address => uint256) public contributions; // Contribution của mỗi donor

mapping(uint256 => Proposal) private proposals;   // Các đề xuất
uint256 public nextProposalId;                    // ID cho proposal tiếp theo
```

**Structs**:
```solidity
struct Proposal {
    uint256 id;
    string description;
    uint256 amount;
    address payable recipient;
    uint256 voteYes;                    // Tổng weight phiếu ủng hộ
    uint256 voteNo;                     // Tổng weight phiếu phản đối
    bool executed;
    address[] voters;
    mapping(address => bool) voted;
}
```

**Modifiers**:
```solidity
modifier onlyOwner()              // Chỉ owner
modifier onlyDonor()              // Chỉ người đã donate
modifier campaignSuccessful()     // Campaign đạt target
modifier campaignEnded()          // Campaign đã kết thúc
modifier campaignActive()         // Campaign đang hoạt động
```

**Events**:
```solidity
event Donated(address indexed donor, uint256 amount);
event Refunded(address indexed donor, uint256 amount);
event ProposalCreated(uint256 id, string description, uint256 amount, address recipient);
event Voted(address indexed voter, uint256 proposalId, bool support, uint256 weight);
event ProposalExecuted(uint256 indexed proposalId, uint256 amount, address recipient);
```

**Main Functions**:

1. **donate()**
```solidity
function donate() external payable campaignActive
```
- Nhận donation từ user
- Thêm vào donors list (nếu lần đầu)
- Cập nhật contributions mapping
- Cập nhật totalRaised
- Emit: Donated

2. **refund()**
```solidity
function refund() external campaignEnded
```
- Yêu cầu: Campaign thất bại (totalRaised < targetAmount)
- Hoàn lại ETH cho donor
- Reset contribution về 0
- Emit: Refunded

3. **createProposal()**
```solidity
function createProposal(
    string calldata _description,
    uint256 _amount,
    address payable _recipient
) external onlyOwner campaignSuccessful
```
- Chỉ owner mới tạo được
- Yêu cầu: Campaign successful
- Kiểm tra: amount <= balance
- Tạo proposal mới
- Emit: ProposalCreated

4. **vote()**
```solidity
function vote(uint256 proposalId, bool support) 
    external onlyDonor campaignSuccessful
```
- Chỉ donor mới vote được
- Kiểm tra: chưa vote cho proposal này
- Vote weight = sqrt(contribution)
- Cập nhật voteYes hoặc voteNo
- Thêm vào voters list
- Emit: Voted

5. **executeProposal()**
```solidity
function executeProposal(uint256 proposalId) 
    external campaignSuccessful
```
- Kiểm tra điều kiện:
  - Có votes
  - Quorum: >50% donors đã vote
  - Approved: voteYes > voteNo
  - Đủ balance
- Chuyển tiền đến recipient
- Đánh dấu executed = true
- Emit: ProposalExecuted

**Helper Functions** (15 functions):

```solidity
// Status checks
function isEnded() external view returns (bool)
function isSuccessful() external view returns (bool)
function getTimeRemaining() external view returns (uint256)
function getProgressPercentage() external view returns (uint256)

// Donor info
function isDonor(address addr) external view returns (bool)
function getContribution(address addr) external view returns (uint256)
function getDonors() external view returns (address[] memory)

// Proposal info
function getProposalVoters(uint256 proposalId) external view returns (address[] memory)
function hasQuorum(uint256 proposalId) external view returns (bool)
function isProposalApproved(uint256 proposalId) external view returns (bool)
function getProposalCount() external view returns (uint256)

// General
function getBalance() external view returns (uint256)
function getDonorCount() external view returns (uint256)
function getCampaignSummary() external view returns (...)
function getVoteWeight(address donor) external view returns (uint256)
```

---

## 🎨 FRONTEND ARCHITECTURE

### Component Hierarchy

```
App
├── Header
│   ├── Navigation (Home, Campaigns, Statistics)
│   └── WalletConnection
│
├── Routes
│   ├── LandingPage
│   │   ├── Hero Section
│   │   ├── Features (4 cards)
│   │   ├── Benefits (6 cards)
│   │   ├── How it Works (3 steps)
│   │   ├── Use Cases (6 categories)
│   │   └── CTA Section
│   │
│   ├── CampaignPage
│   │   ├── ActionButton (Create Campaign)
│   │   └── CampaignList
│   │       └── CampaignCard (multiple)
│   │
│   ├── CampaignDetailPage
│   │   ├── CampaignHeader (owner, status)
│   │   ├── CampaignProgress (bar chart)
│   │   ├── CampaignTabs
│   │   │   ├── Tab: Overview
│   │   │   │   └── CampaignOverview
│   │   │   ├── Tab: Proposals
│   │   │   │   ├── CreateProposalBanner
│   │   │   │   └── ProposalsList
│   │   │   │       └── ProposalCard (multiple)
│   │   │   ├── Tab: Donors
│   │   │   │   └── DonorsList
│   │   │   └── Tab: Events
│   │   │       └── EventFeed
│   │   │
│   │   └── Sidebar
│   │       ├── RefundButton (if failed)
│   │       ├── DonationSidebar
│   │       ├── CampaignStats
│   │       └── CampaignOwnerInfo
│   │
│   └── StatisticsPage
│       ├── Main Stats Grid (4 cards)
│       ├── Financial Statistics (2 cards)
│       ├── Status Distribution (bar charts)
│       ├── Top Campaigns (5)
│       └── Additional Metrics (3)
│
└── Footer
    ├── About Info
    ├── Quick Links
    ├── Resources
    └── Social Links
```

### State Management Flow

```
┌─────────────────────────────────────────────────────────┐
│                  React Context API                      │
│                                                         │
│  ┌──────────────────┐         ┌──────────────────┐    │
│  │ CampaignContext  │         │   AuthContext    │    │
│  │                  │         │                  │    │
│  │ - campaigns      │         │ - account        │    │
│  │ - getCampaign    │         │ - isConnected    │    │
│  │ - createCampaign │         │ - connectWallet  │    │
│  │ - donate         │         │ - disconnect     │    │
│  │ - createProposal │         │ - formatAddress  │    │
│  │ - vote           │         │                  │    │
│  │ - executeProposal│         │                  │    │
│  │ - refund         │         │                  │    │
│  └──────────────────┘         └──────────────────┘    │
│           ↕                            ↕               │
│  ┌────────────────────────────────────────────────┐   │
│  │          contractService                        │   │
│  │  ┌──────────────┐  ┌──────────────────────┐   │   │
│  │  │ Operations   │  │      Queries         │   │   │
│  │  │              │  │                      │   │   │
│  │  │ - donate     │  │ - getAllCampaigns    │   │   │
│  │  │ - createPropo│  │ - getCampaignDetails │   │   │
│  │  │ - vote       │  │ - getUserContribution│   │   │
│  │  │ - execute    │  │ - getDonors          │   │   │
│  │  │ - refund     │  │ - getProposal        │   │   │
│  │  └──────────────┘  └──────────────────────┘   │   │
│  └────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                         ↕
┌─────────────────────────────────────────────────────────┐
│                   Blockchain                            │
│              (via ethers.js + MetaMask)                 │
└─────────────────────────────────────────────────────────┘
```

### Custom Hooks

1. **useCampaign()**
- Provider: CampaignProvider
- State: campaigns list
- Functions: CRUD operations cho campaigns
- Sử dụng: Tất cả components cần tương tác với campaigns

2. **useAuth()**
- Provider: AuthProvider
- State: account address, connection status
- Functions: Connect/disconnect wallet
- Sử dụng: Header, WalletConnection, gated components

3. **useEvents(campaignAddress)**
- Lắng nghe real-time events từ blockchain
- State: events list, isListening
- Functions: loadPastEvents, clearEvents
- Sử dụng: EventFeed trong CampaignDetailPage

4. **useLoadingState()**
- Quản lý loading states cho async operations
- Return: loading, startLoading, stopLoading
- Sử dụng: Forms, buttons với async actions

---

## 🎯 CORE FEATURES

### 1. Campaign Management

**Create Campaign**
- Input validation
- Gas estimation
- Transaction confirmation
- Success notification
- Auto redirect to campaign page

**View Campaigns**
- List view với filters
- Card-based layout
- Real-time status updates
- Progress visualization
- Time remaining countdown

**Campaign Status**
- 🟢 Active: Đang nhận donation
- 🟢 Successful: Đạt target
- 🔴 Failed: Hết hạn, chưa đạt target

### 2. Donation System

**Donate Flow**
1. Select campaign
2. Enter amount (ETH)
3. Confirm transaction in MetaMask
4. Wait for blockchain confirmation
5. UI updates automatically
6. Receive voting rights

**Features**:
- Minimum donation: 0.0001 ETH
- Real-time balance updates
- Gas estimation
- Transaction history
- Donor leaderboard

### 3. DAO Voting System

**Vote Weight Calculation**
```javascript
voteWeight = Math.sqrt(contribution)
```
- Công bằng hơn linear weight
- Khuyến khích nhiều người tham gia
- Giảm sức mạnh của "whale" donors

**Quorum Requirement**
```javascript
quorum = (votersCount * 2) > donorsCount
// >50% donors phải vote
```

**Approval Condition**
```javascript
approved = voteYes > voteNo
```

### 4. Proposal Execution

**Conditions**:
1. ✅ Campaign successful (đạt target)
2. ✅ Quorum reached (>50% donors voted)
3. ✅ Approved (voteYes > voteNo)
4. ✅ Sufficient balance

**Execution**:
- Automatic fund transfer
- On-chain verification
- Irreversible once executed
- Full transparency

### 5. Refund Mechanism

**Trigger Conditions**:
- Campaign deadline passed
- Total raised < target amount
- User has contribution > 0

**Process**:
1. User clicks "Yêu cầu hoàn tiền"
2. Smart contract verifies conditions
3. ETH transferred back to user's wallet
4. Contribution reset to 0
5. Transaction recorded on blockchain

**Safety**:
- Reentrancy protection
- Check-Effects-Interactions pattern
- Automated execution (no manual approval)

### 6. Event System

**Real-time Event Listening**
- WebSocket connection to blockchain
- Auto-update UI on new events
- Event types:
  - Donated
  - Refunded
  - ProposalCreated
  - Voted
  - ProposalExecuted

**Event Feed Display**
- Chronological order
- Filter by type
- Load historical events
- Human-readable formatting

### 7. Statistics Dashboard

**Metrics Tracked**:
- Total campaigns
- Active campaigns
- Success rate
- Total raised (ETH)
- Top performing campaigns
- Status distribution

**Visualizations**:
- Progress bars
- Pie charts (planned)
- Trend graphs (planned)
- Financial cards

---

## 🔒 SECURITY CONSIDERATIONS

### Smart Contract Security

1. **Reentrancy Protection**
```solidity
// Check-Effects-Interactions pattern
contributions[msg.sender] = 0;  // Effect first
(bool success, ) = payable(msg.sender).call{value: amount}("");  // Interaction last
```

2. **Access Control**
- onlyOwner: Chỉ owner tạo proposals
- onlyDonor: Chỉ donor mới vote được
- campaignActive: Chỉ donate khi active

3. **Input Validation**
```solidity
require(msg.value > 0, "Must send ETH");
require(_amount <= address(this).balance, "Not enough funds");
require(!p.executed, "Already executed");
```

4. **Integer Overflow Prevention**
- Solidity ^0.8.0 tự động check overflow
- SafeMath không cần thiết

5. **Immutable Variables**
```solidity
address payable public immutable owner;
uint256 public immutable targetAmount;
uint256 public immutable deadline;
```
- Tiết kiệm gas
- Bảo vệ critical values

### Frontend Security

1. **Wallet Connection**
- Chỉ đọc address, không lưu private key
- Request quyền từ user
- Clear session on disconnect

2. **Transaction Signing**
- Tất cả transactions cần confirm trong MetaMask
- User thấy rõ:
  - Amount
  - Recipient
  - Gas fee

3. **Input Sanitization**
- Validate amount > 0
- Check address format
- Prevent XSS trong text inputs

4. **Error Handling**
```javascript
try {
  await contract.donate();
} catch (error) {
  const message = parseError(error);
  toast.error(message);
}
```

---

## 📈 PERFORMANCE OPTIMIZATION

### Smart Contract

1. **Gas Optimization**
- Use `immutable` cho constant values
- Pack struct variables
- Minimize storage writes
- Use events thay vì storage khi có thể

2. **Batch Operations**
```solidity
// Lấy nhiều thông tin trong 1 call
function getCampaignSummary() external view returns (
    address, uint256, uint256, uint256, uint256, uint256, uint256, bool, bool
)
```

### Frontend

1. **Code Splitting**
- React.lazy() cho routes
- Dynamic imports cho heavy components

2. **Memoization**
```javascript
const progressPercentage = useMemo(() => {
  return (totalRaised / targetAmount) * 100;
}, [totalRaised, targetAmount]);
```

3. **useCallback** cho functions
```javascript
const loadCampaignDetails = useCallback(async () => {
  // ...
}, [address]);
```

4. **Debouncing/Throttling**
- Event listeners
- Search inputs
- Scroll handlers

5. **Batch Contract Calls**
```javascript
const [owner, target, deadline, raised] = await Promise.all([
  campaign.owner(),
  campaign.targetAmount(),
  campaign.deadline(),
  campaign.totalRaised()
]);
```

---

## 🧪 TESTING

### Smart Contract Tests

**Test File**: `test/Campaign.test.js`

**Test Categories**:

1. **Deployment Tests**
```javascript
✓ Should set the correct owner
✓ Should set the correct target amount
✓ Should set the correct deadline
✓ Should initialize with zero raised
```

2. **Donation Tests**
```javascript
✓ Should accept donations
✓ Should track donor contributions
✓ Should update totalRaised
✓ Should revert if campaign ended
✓ Should revert if donation is 0
```

3. **Refund Tests**
```javascript
✓ Should refund if campaign failed
✓ Should revert if campaign successful
✓ Should revert if campaign not ended
✓ Should revert if no contribution
✓ Should reset contribution after refund
```

4. **Proposal Tests**
```javascript
✓ Only owner can create proposals
✓ Can only create when successful
✓ Should validate proposal amount
✓ Should emit ProposalCreated event
```

5. **Voting Tests**
```javascript
✓ Only donors can vote
✓ Cannot vote twice
✓ Vote weight = sqrt(contribution)
✓ Should update voteYes/voteNo correctly
```

6. **Execution Tests**
```javascript
✓ Should execute when conditions met
✓ Should transfer funds to recipient
✓ Should revert if quorum not reached
✓ Should revert if not approved
✓ Should mark proposal as executed
```

**Run Tests**:
```bash
npm run test              # Run all tests
npm run test:verbose      # Detailed output
npm run test:gas          # With gas report
```

### Frontend Testing (Future)

**Planned**:
- Unit tests cho components (Jest + React Testing Library)
- Integration tests cho hooks
- E2E tests với Cypress
- Visual regression tests

---

## 🚀 DEPLOYMENT

### Local Development

1. **Start Hardhat Node**
```bash
npm run node
```
- Runs on: http://127.0.0.1:8545
- Chain ID: 31337
- Provides test accounts with 10000 ETH each

2. **Deploy Contracts**
```bash
npm run deploy:local
```
- Deploys CampaignFactory
- Saves address to `deployments/deployment-info.json`
- Optionally creates sample campaign

3. **Update Frontend Config**
```javascript
// frontend/src/utils/constants.js
export const CONTRACT_ADDRESSES = {
  CAMPAIGN_FACTORY: "0x5FbDB2315678afecb367f032d93F642f64180aa3"
};
```

4. **Start Frontend**
```bash
npm run frontend:start
```
- Runs on: http://localhost:3000
- Auto-reload on file changes

5. **Configure MetaMask**
- Network: Hardhat Localhost
- RPC URL: http://127.0.0.1:8545
- Chain ID: 31337
- Import test account private key

### Testnet Deployment (Future)

**Sepolia Testnet**:
1. Get test ETH from faucet
2. Update `hardhat.config.js`:
```javascript
networks: {
  sepolia: {
    url: process.env.SEPOLIA_RPC_URL,
    accounts: [process.env.PRIVATE_KEY]
  }
}
```
3. Deploy:
```bash
npm run deploy:sepolia
```

### Mainnet Deployment (Future)

**Prerequisites**:
- Full security audit
- Comprehensive testing
- Gas optimization
- Emergency pause mechanism
- Upgrade strategy

---

## 📱 USER INTERFACE

### Design System

**Color Palette**:
- Primary: Orange (#f97316) → Pink (#ec4899) gradient
- Success: Green (#22c55e) → Emerald (#10b981)
- Warning: Yellow (#fbbf24)
- Error: Red (#ef4444) → Rose (#f43f5e)
- Info: Blue (#3b82f6) → Cyan (#06b6d4)
- Neutral: Gray scale

**Typography**:
- Font Family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto
- Headings: Bold, 2xl to 6xl
- Body: Regular, sm to lg
- Code: font-mono

**Spacing**:
- Base unit: 4px
- Scale: 0.5, 1, 2, 3, 4, 6, 8, 12, 16, 20, 24

**Components**:

1. **Buttons**
```css
.btn-primary: Orange-pink gradient, shadow
.btn-secondary: White background, border
.btn-disabled: Opacity 50%, no hover
```

2. **Cards**
```css
.card: White background, rounded-xl, shadow-sm
.card:hover: shadow-xl, transform translateY(-2px)
```

3. **Inputs**
```css
.input: Border-2, rounded-lg, focus:ring
```

4. **Badges**
```css
.status-active: Blue background
.status-successful: Green background  
.status-failed: Red background
```

### Responsive Design

**Breakpoints**:
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px

**Mobile-First Approach**:
- Base styles cho mobile
- Progressive enhancement với media queries
- Touch-friendly buttons (min 44x44px)
- Hamburger menu cho navigation (future)

### Accessibility

**ARIA Labels**:
```jsx
<button aria-label="Quyên góp cho chiến dịch">
  Quyên góp
</button>
```

**Keyboard Navigation**:
- Tab through interactive elements
- Enter to activate buttons
- Escape to close modals

**Color Contrast**:
- Text: Min 4.5:1 ratio
- Large text: Min 3:1 ratio
- WCAG AA compliant

---

## 🔄 WORKFLOW EXAMPLES

### Complete Donation Flow

```
1. USER ACTIONS:
   - Browse campaigns list
   - Select interesting campaign
   - Click "Quyên góp"
   - Enter amount: 0.5 ETH
   - Click "Xác nhận"

2. FRONTEND:
   - Validate input (amount > 0)
   - Call contractService.donate(address, "0.5")
   - Show loading toast

3. CONTRACT SERVICE:
   - Parse amount: ethers.parseEther("0.5")
   - Get campaign contract instance
   - Call campaign.donate({value: amount})
   
4. METAMASK:
   - Popup confirmation dialog
   - Show:
     * To: Campaign address
     * Value: 0.5 ETH
     * Gas: ~50000
   - User confirms

5. BLOCKCHAIN:
   - Validate: msg.sender, msg.value
   - Check: campaignActive modifier
   - Execute: 
     * Add to donors array (if first time)
     * Update contributions[donor]
     * Update totalRaised
   - Emit: Donated event

6. FRONTEND:
   - Receive transaction receipt
   - Show success toast
   - Reload campaign details
   - Update UI:
     * Progress bar
     * Total raised
     * Donor count
   - Add to event feed

7. USER SEES:
   - Success notification
   - Updated campaign stats
   - Own contribution visible
   - Can now vote on proposals
```

### Complete Proposal Execution Flow

```
1. PRECONDITIONS:
   - Campaign successful (raised >= target)
   - Owner created proposal
   - Donors voted
   - Quorum reached (>50%)
   - Approved (Yes > No)

2. USER (anyone) CLICKS:
   - "Thực thi đề xuất"

3. SMART CONTRACT:
   - Check conditions:
     ✓ campaignSuccessful
     ✓ !proposal.executed
     ✓ voters.length * 2 > donors.length
     ✓ voteYes > voteNo
     ✓ amount <= balance
   
   - Execute:
     * Mark executed = true
     * Transfer ETH to recipient
     * Emit ProposalExecuted

4. BLOCKCHAIN:
   - Transaction confirmed
   - Funds transferred
   - State updated permanently

5. UI UPDATES:
   - Proposal status: "Đã thực thi"
   - Campaign balance decreased
   - Cannot execute again
   - Event feed updated
```

---

## 🐛 TROUBLESHOOTING

### Common Issues

1. **MetaMask not detected**
```
Error: "MetaMask không được cài đặt"
Solution: Install MetaMask extension
```

2. **Wrong network**
```
Error: "Please switch to Hardhat Localhost"
Solution: Add custom network in MetaMask
- RPC: http://127.0.0.1:8545
- Chain ID: 31337
```

3. **Insufficient funds**
```
Error: "insufficient funds for intrinsic transaction cost"
Solution: Import Hardhat account with ETH or get testnet ETH
```

4. **Nonce too low**
```
Error: "nonce has already been used"
Solution: Reset MetaMask account
- Settings → Advanced → Reset Account
```

5. **Contract not deployed**
```
Error: "Contract not found at address"
Solution: 
- npm run deploy:local
- Update CONTRACT_ADDRESSES in constants.js
```

6. **Transaction timeout**
```
Error: "Transaction took too long"
Solution:
- Increase gas limit
- Check Hardhat node is running
- Restart Hardhat node
```

---

## 📚 API REFERENCE

### ContractService Methods

```javascript
// Campaign Management
await contractService.createCampaign(owner, target, duration, description)
await contractService.getAllCampaigns()
await contractService.getCampaignDetails(address)

// Donations
await contractService.donate(campaignAddress, amount)
await contractService.getUserContribution(campaignAddress, userAddress)
await contractService.getDonors(campaignAddress)

// Proposals
await contractService.createProposal(campaignAddress, description, amount, recipient)
await contractService.getProposal(campaignAddress, proposalId)
await contractService.getAllProposals(campaignAddress)
await contractService.getProposalCount(campaignAddress)

// Voting
await contractService.vote(campaignAddress, proposalId, support)
await contractService.executeProposal(campaignAddress, proposalId)
await contractService.canExecuteProposal(campaignAddress, proposalId)

// Refund
await contractService.refund(campaignAddress)

// Helpers
await contractService.isVoted(campaignAddress, proposalId, voterAddress)
await contractService.getVoterCount(campaignAddress, proposalId)
```

### useCampaign Hook

```javascript
const {
  campaigns,              // Array of all campaigns
  getCampaignDetails,     // (address) => Promise<Campaign>
  createCampaign,         // (owner, target, duration, desc) => Promise<bool>
  donate,                 // (address, amount) => Promise<bool>
  fetchCampaigns,         // () => Promise<void>
  createProposal,         // (address, desc, amount, recipient) => Promise<bool>
  getAllProposals,        // (address) => Promise<Proposal[]>
  vote,                   // (address, proposalId, support) => Promise<bool>
  executeProposal,        // (address, proposalId) => Promise<bool>
  refund,                 // (address) => Promise<bool>
  getAllCampaigns         // () => Promise<Campaign[]>
} = useCampaign();
```

### useAuth Hook

```javascript
const {
  account,                // Current wallet address or null
  isConnected,           // Boolean
  connectWallet,         // () => Promise<string>
  disconnectWallet,      // () => void
  formatAddress         // (address) => shortened string
} = useAuth();
```

### useEvents Hook

```javascript
const {
  events,                // Array of blockchain events
  isListening,          // Boolean
  loadPastEvents,       // (fromBlock?) => Promise<void>
  clearEvents           // () => void
} = useEvents(campaignAddress);
```

---

## 🎓 LEARNING RESOURCES

### Blockchain & Smart Contracts
- [Solidity Documentation](https://docs.soliditylang.org/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Ethereum.org](https://ethereum.org/en/developers/)

### Web3 Development
- [Ethers.js Documentation](https://docs.ethers.org/)
- [MetaMask Developer Docs](https://docs.metamask.io/)
- [Web3 University](https://www.web3.university/)

### React & Frontend
- [React Documentation](https://react.dev/)
- [React Router](https://reactrouter.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 📝 CHANGELOG

### Version 1.0.0 (Current)

**Features**:
- ✅ Campaign creation và management
- ✅ Donation system với real-time updates
- ✅ DAO voting mechanism với quadratic-like weighting
- ✅ Proposal execution với multi-condition checks
- ✅ Refund system cho failed campaigns
- ✅ Event listening và feed
- ✅ Statistics dashboard
- ✅ Responsive UI với Orange-Pink design system
- ✅ 15 helper functions cho efficient queries

**Smart Contracts**:
- Campaign.sol: Main contract với 5 core functions + 15 helpers
- CampaignFactory.sol: Factory pattern cho deployment

**Frontend**:
- 4 main pages: Landing, Campaigns, Detail, Statistics
- 20+ reusable components
- 4 custom hooks
- Comprehensive utils layer

---

## 🚧 FUTURE IMPROVEMENTS

### Phase 2 (Planned)

**Smart Contract**:
- [ ] Milestone-based funding release
- [ ] Multi-sig requirement cho proposals
- [ ] Emergency pause mechanism
- [ ] Upgradeable contracts (proxy pattern)
- [ ] Time-locked proposals

**Frontend**:
- [ ] Campaign search và advanced filters
- [ ] User profile page
- [ ] Notification system
- [ ] Campaign analytics dashboard
- [ ] Mobile app (React Native)

**Features**:
- [ ] Social sharing
- [ ] Campaign updates/news feed
- [ ] Comments section
- [ ] Rating system
- [ ] KYC integration (optional)

**Technical**:
- [ ] IPFS for campaign media storage
- [ ] Subgraph for efficient querying
- [ ] Multi-chain support (Polygon, BSC)
- [ ] ENS integration
- [ ] Gasless transactions (meta-transactions)

### Phase 3 (Future)

- [ ] NFT rewards cho donors
- [ ] Staking mechanism
- [ ] Governance token
- [ ] Cross-chain bridges
- [ ] Fiat on-ramp integration

---

## 👨‍💻 DEVELOPMENT TEAM

**Roles**:
- Smart Contract Developer
- Frontend Developer
- UI/UX Designer
- QA Tester
- DevOps Engineer

---

## 📄 LICENSE

MIT License - Free to use and modify

---

## 📞 SUPPORT & CONTACT

**GitHub Repository**: https://github.com/ntk223/VolunteerHub-Blockchain

**Issues**: Report bugs và feature requests tại GitHub Issues

**Documentation**: Tài liệu này (docs.txt)

---

## 🙏 ACKNOWLEDGMENTS

**Technologies Used**:
- Ethereum Foundation
- Hardhat Team
- OpenZeppelin
- React Team
- Ethers.js
- Tailwind CSS
- Lucide Icons

**Inspiration**:
- Kickstarter (crowdfunding model)
- Gitcoin (DAO governance)
- MolochDAO (voting mechanisms)

---

**Document Version**: 1.0
**Last Updated**: December 9, 2025
**Author**: UET FundChain Development Team

---

## 📊 METRICS & KPIs

### Success Metrics

**Platform**:
- Total campaigns created
- Total ETH raised
- Success rate (%)
- Average campaign duration
- Average contribution size

**User Engagement**:
- Daily/Monthly active users
- Repeat donors (%)
- Average campaigns per user
- Vote participation rate (%)

**Technical**:
- Average transaction confirmation time
- Gas cost per operation
- System uptime (%)
- Error rate (%)

---

## 🔍 GLOSSARY

**Blockchain Terms**:
- **Wei**: Đơn vị nhỏ nhất của ETH (1 ETH = 10^18 wei)
- **Gas**: Chi phí thực thi transaction
- **Smart Contract**: Chương trình tự động trên blockchain
- **ABI**: Application Binary Interface - Interface để tương tác với contract
- **Nonce**: Number used once - Số thứ tự transaction từ một address

**Project Terms**:
- **Campaign**: Chiến dịch gây quỹ
- **Donor**: Người đóng góp
- **Owner**: Người tạo và quản lý campaign
- **Proposal**: Đề xuất sử dụng tiền
- **Quorum**: Tỷ lệ tối thiểu người vote cần đạt
- **Vote Weight**: Sức vote tính theo sqrt(contribution)
- **Refund**: Hoàn tiền cho donors khi campaign thất bại

---

END OF DOCUMENTATION
