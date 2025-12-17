# 🏗️ THIẾT KẾ HỆ THỐNG UET FUNDCHAIN

## 📋 MỤC LỤC

1. [Tổng quan Kiến trúc](#tổng-quan-kiến-trúc)
2. [Kiến trúc Tầng (Layered Architecture)](#kiến-trúc-tầng)
3. [Thiết kế Smart Contract](#thiết-kế-smart-contract)
4. [Thiết kế Frontend](#thiết-kế-frontend)
5. [Luồng Dữ liệu](#luồng-dữ-liệu)
6. [Thiết kế Database & State](#thiết-kế-database--state)
7. [Thiết kế API & Services](#thiết-kế-api--services)
8. [Thiết kế Bảo mật](#thiết-kế-bảo-mật)
9. [Thiết kế Performance](#thiết-kế-performance)
10. [Sơ đồ Triển khai](#sơ-đồ-triển-khai)

---

## 1. TỔNG QUAN KIẾN TRÚC

### 1.1. Mô hình Architecture Pattern

UET FundChain sử dụng **Decentralized Application (DApp) Architecture** kết hợp với **Clean Architecture** principles:

```
┌─────────────────────────────────────────────────────────────────────┐
│                         PRESENTATION LAYER                          │
│                        (React SPA - Client)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐ │
│  │   UI/View    │  │  Components  │  │      User Input          │ │
│  │   - Pages    │  │  - Reusable  │  │  - Forms, Buttons        │ │
│  │   - Layouts  │  │  - Composite │  │  - Validation            │ │
│  └──────────────┘  └──────────────┘  └──────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                                ↕
┌─────────────────────────────────────────────────────────────────────┐
│                        APPLICATION LAYER                            │
│                    (Business Logic - Frontend)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐ │
│  │    Hooks     │  │   Context    │  │    State Management      │ │
│  │  - useCamp   │  │  - Campaign  │  │  - React State           │ │
│  │  - useAuth   │  │  - Auth      │  │  - Context API           │ │
│  │  - useEvents │  │              │  │  - Local State           │ │
│  └──────────────┘  └──────────────┘  └──────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                                ↕
┌─────────────────────────────────────────────────────────────────────┐
│                      INFRASTRUCTURE LAYER                           │
│                    (External Services Layer)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐ │
│  │ContractSvc   │  │Event Service │  │      Utilities           │ │
│  │  - Operations│  │  - Listeners │  │  - Formatters            │ │
│  │  - Queries   │  │  - Processor │  │  - Validators            │ │
│  │  - Helpers   │  │  - Manager   │  │  - Constants             │ │
│  └──────────────┘  └──────────────┘  └──────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                                ↕
┌─────────────────────────────────────────────────────────────────────┐
│                          WEB3 LAYER                                 │
│                  (Blockchain Interaction Layer)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐ │
│  │  Ethers.js   │  │   MetaMask   │  │    JSON-RPC Provider     │ │
│  │  - Provider  │  │  - Signer    │  │  - Network Connection    │ │
│  │  - Contract  │  │  - Accounts  │  │  - Transaction Pool      │ │
│  │  - Events    │  │  - Sign Tx   │  │  - Block Listener        │ │
│  └──────────────┘  └──────────────┘  └──────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                                ↕
┌─────────────────────────────────────────────────────────────────────┐
│                      BLOCKCHAIN LAYER                               │
│                  (Ethereum Virtual Machine)                         │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    SMART CONTRACTS                            │  │
│  │  ┌────────────────────┐       ┌──────────────────────────┐  │  │
│  │  │ CampaignFactory    │───────│   Campaign Instances     │  │  │
│  │  │                    │       │   (Multiple Contracts)   │  │  │
│  │  │ - createCampaign() │       │                          │  │  │
│  │  │ - getDeployed()    │       │ - donate()               │  │  │
│  │  │                    │       │ - refund()               │  │  │
│  │  │                    │       │ - createProposal()       │  │  │
│  │  │                    │       │ - vote()                 │  │  │
│  │  │                    │       │ - executeProposal()      │  │  │
│  │  └────────────────────┘       └──────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                  ETHEREUM BLOCKCHAIN                         │  │
│  │  - State Database (Merkle Patricia Trie)                    │  │
│  │  - Transaction Pool (Mempool)                               │  │
│  │  - Consensus Mechanism (PoS - Proof of Stake)               │  │
│  │  - Block Production & Validation                            │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.2. Đặc điểm Kiến trúc

**Decentralized Architecture**:
- Không có server backend tập trung
- Smart contract là "backend" trên blockchain
- Frontend chạy hoàn toàn trên client
- Data stored on-chain (immutable)

**Benefits**:
- ✅ Transparency: Mọi transaction đều public
- ✅ Trustless: Không cần trust bên thứ 3
- ✅ Censorship-resistant: Không ai có thể chặn
- ✅ No single point of failure
- ✅ Automatic execution: Smart contract tự động thực thi

**Trade-offs**:
- ⚠️ Higher latency (blockchain confirmation)
- ⚠️ Gas costs cho mọi write operation
- ⚠️ Public data (privacy limited)
- ⚠️ Immutable code (upgrades phức tạp)

---

## 2. KIẾN TRÚC TẦNG (LAYERED ARCHITECTURE)

### 2.1. Presentation Layer (Frontend)

**Responsibility**: Hiển thị UI và xử lý user interactions

**Components**:

```
src/
├── page/                           # Route Pages
│   ├── LandingPage.js             # Marketing page
│   ├── CampaignPage.js            # Campaign list
│   ├── CampaignDetailPage.js      # Single campaign detail
│   └── StatisticsPage.js          # Platform statistics
│
├── components/                     # Reusable UI Components
│   ├── Header/
│   │   ├── Header.js              # Navigation bar
│   │   └── WalletConnection.js    # MetaMask connect button
│   │
│   ├── Footer/
│   │   └── Footer.js              # Footer links
│   │
│   ├── Main/
│   │   ├── CampaignCard.js        # Campaign preview card
│   │   ├── CampaignList.js        # Grid of campaigns
│   │   ├── CreateCampaign.js      # Create campaign modal
│   │   ├── DonateForm.js          # Donation form modal
│   │   └── CreateProposal.js      # Create proposal modal
│   │
│   └── CampaignDetail/
│       ├── CampaignHeader.js      # Campaign title & status
│       ├── CampaignProgress.js    # Progress bar
│       ├── CampaignTabs.js        # Tab navigation
│       ├── CampaignOverview.js    # Overview tab content
│       ├── CampaignProposals.js   # Proposals tab
│       ├── ProposalCard.js        # Single proposal card
│       ├── DonorsList.js          # Donors tab
│       ├── EventFeed.js           # Events tab
│       ├── RefundButton.js        # Refund button (failed campaigns)
│       ├── DonationSidebar.js     # Donation CTA sidebar
│       ├── CampaignStats.js       # Statistics cards
│       └── CampaignOwnerInfo.js   # Owner information
│
└── App.js                          # Root component với Router
```

**Design Patterns**:
- **Component Composition**: Nhỏ, reusable components
- **Container/Presentational**: Logic vs Display separation
- **Render Props**: Share behavior between components
- **Higher-Order Components**: Cross-cutting concerns
- **Custom Hooks**: Reusable stateful logic

### 2.2. Application Layer (Business Logic)

**Responsibility**: State management và business rules

**Structure**:

```
src/
├── hooks/                          # Custom React Hooks
│   ├── useCampaign.js             # Campaign CRUD operations
│   │   - Context: CampaignContext
│   │   - State: campaigns list
│   │   - Functions: create, read, update operations
│   │
│   ├── useAuth.js                 # Wallet authentication
│   │   - Context: AuthContext
│   │   - State: account, isConnected
│   │   - Functions: connect, disconnect
│   │
│   ├── useEvents.js               # Blockchain event listening
│   │   - State: events list, isListening
│   │   - Functions: loadPastEvents, clearEvents
│   │
│   └── useLoadingState.js         # Loading state management
│       - State: loading, error
│       - Functions: startLoading, stopLoading
│
└── Context Structure:
    ├── CampaignContext
    │   └── Provides: campaigns, getCampaignDetails, donate, etc.
    │
    └── AuthContext
        └── Provides: account, connectWallet, formatAddress
```

**State Management Strategy**:

```javascript
// Context API cho global state
<AuthProvider>
  <CampaignProvider>
    <App>
      {/* Components có thể access cả 2 contexts */}
    </App>
  </CampaignProvider>
</AuthProvider>

// Local state cho UI state
const [showModal, setShowModal] = useState(false);
const [activeTab, setActiveTab] = useState('overview');

// Derived state từ props/context
const progressPercentage = useMemo(() => {
  return (totalRaised / targetAmount) * 100;
}, [totalRaised, targetAmount]);
```

### 2.3. Infrastructure Layer (Services)

**Responsibility**: Tương tác với external systems (blockchain)

**Structure**:

```
src/utils/
├── contractService.js              # Main service orchestrator
│   ├── init()                     # Initialize provider & signer
│   ├── Delegates to:
│   │   ├── contractHelpers.js
│   │   ├── campaignOperations.js
│   │   ├── campaignQueries.js
│   │   └── eventService.js
│
├── contractHelpers.js              # Helper utilities
│   ├── getFactoryContract()       # Factory contract instance
│   ├── getCampaignContract()      # Campaign contract instance
│   ├── formatCampaignData()       # Data transformation
│   └── parseError()               # Error parsing
│
├── campaignOperations.js           # Write operations (transactions)
│   ├── createCampaign()
│   ├── donate()
│   ├── createProposal()
│   ├── vote()
│   ├── executeProposal()
│   └── refund()
│
├── campaignQueries.js              # Read operations (calls)
│   ├── getAllCampaigns()
│   ├── getCampaignDetails()
│   ├── getUserContribution()
│   ├── getDonors()
│   ├── getProposal()
│   └── getAllProposals()
│
├── eventService.js                 # Event listening service
│   ├── listenToEvents()
│   ├── getPastEvents()
│   └── stopListening()
│
├── eventManager.js                 # Event processing
│   ├── processEvent()
│   ├── formatEvent()
│   └── filterEvents()
│
└── constants.js                    # Contract ABI & Addresses
    ├── CONTRACT_ADDRESSES
    ├── CAMPAIGN_FACTORY_ABI
    └── CAMPAIGN_ABI
```

**Service Layer Pattern**:

```javascript
class ContractService {
  // Singleton pattern
  constructor() {
    this.provider = null;
    this.signer = null;
    this.helper = null;
    this.operations = null;
    this.queries = null;
    this.eventService = null;
  }

  // Initialization
  async init() {
    // Setup provider
    // Setup signer
    // Initialize sub-services
  }

  // Delegation pattern
  async donate(address, amount) {
    await this.ensureInitialized();
    return this.operations.donate(address, amount);
  }
}

export default new ContractService(); // Singleton export
```

---

## 3. THIẾT KẾ SMART CONTRACT

### 3.1. Contract Architecture

**Design Pattern**: Factory Pattern + DAO Pattern

```
┌────────────────────────────────────────────────────────────┐
│                    CampaignFactory                         │
│  ┌──────────────────────────────────────────────────┐     │
│  │  State:                                          │     │
│  │  - address[] deployedCampaigns                   │     │
│  │                                                  │     │
│  │  Functions:                                      │     │
│  │  - createCampaign() returns address             │     │
│  │  - getDeployedCampaigns() returns address[]     │     │
│  └──────────────────────────────────────────────────┘     │
└────────────────────────────────────────────────────────────┘
                         │ creates
                         ↓
┌────────────────────────────────────────────────────────────┐
│                     Campaign Instance                      │
│  ┌──────────────────────────────────────────────────┐     │
│  │  Immutable State:                                │     │
│  │  - address payable owner                         │     │
│  │  - uint256 targetAmount                          │     │
│  │  - uint256 deadline                              │     │
│  │                                                  │     │
│  │  Mutable State:                                  │     │
│  │  - uint256 totalRaised                           │     │
│  │  - address[] donors                              │     │
│  │  - mapping(address => uint256) contributions     │     │
│  │  - mapping(uint256 => Proposal) proposals        │     │
│  │  - uint256 nextProposalId                        │     │
│  └──────────────────────────────────────────────────┘     │
│  ┌──────────────────────────────────────────────────┐     │
│  │  Core Functions:                                 │     │
│  │  1. donate() payable                             │     │
│  │  2. refund()                                     │     │
│  │  3. createProposal()                             │     │
│  │  4. vote()                                       │     │
│  │  5. executeProposal()                            │     │
│  └──────────────────────────────────────────────────┘     │
│  ┌──────────────────────────────────────────────────┐     │
│  │  Helper Functions (15):                          │     │
│  │  - isEnded(), isSuccessful()                     │     │
│  │  - getTimeRemaining(), getProgressPercentage()   │     │
│  │  - isDonor(), getContribution()                  │     │
│  │  - getDonors(), getProposalVoters()              │     │
│  │  - hasQuorum(), isProposalApproved()             │     │
│  │  - getProposalCount(), getCampaignSummary()      │     │
│  │  - getVoteWeight(), getBalance()                 │     │
│  └──────────────────────────────────────────────────┘     │
└────────────────────────────────────────────────────────────┘
```

### 3.2. State Machine Design

**Campaign Lifecycle States**:

```
┌─────────────┐
│   CREATED   │ (Deployed, no donations yet)
└──────┬──────┘
       │ donate()
       ↓
┌─────────────┐
│   ACTIVE    │ (Accepting donations, deadline not reached)
└──────┬──────┘
       │
       ├─── deadline reached & raised < target
       │    ↓
       │  ┌─────────────┐
       │  │   FAILED    │ (Can refund)
       │  └─────────────┘
       │
       └─── raised >= target
            ↓
          ┌─────────────┐
          │ SUCCESSFUL  │ (Can create proposals)
          └──────┬──────┘
                 │ createProposal()
                 ↓
          ┌─────────────┐
          │  GOVERNANCE │ (Voting on proposals)
          └──────┬──────┘
                 │ executeProposal()
                 ↓
          ┌─────────────┐
          │  EXECUTING  │ (Funds being used)
          └─────────────┘
```

**Proposal Lifecycle States**:

```
┌─────────────┐
│   CREATED   │ (Just created, no votes)
└──────┬──────┘
       │ vote()
       ↓
┌─────────────┐
│   VOTING    │ (Collecting votes)
└──────┬──────┘
       │
       ├─── quorum not reached
       │    ↓
       │  ┌─────────────┐
       │  │  REJECTED   │ (Not enough votes)
       │  └─────────────┘
       │
       ├─── quorum reached but voteNo > voteYes
       │    ↓
       │  ┌─────────────┐
       │  │  REJECTED   │ (Voted down)
       │  └─────────────┘
       │
       └─── quorum reached & voteYes > voteNo
            ↓
          ┌─────────────┐
          │  APPROVED   │ (Ready to execute)
          └──────┬──────┘
                 │ executeProposal()
                 ↓
          ┌─────────────┐
          │  EXECUTED   │ (Funds transferred)
          └─────────────┘
```

### 3.3. Data Structures

**Campaign State Variables**:

```solidity
contract Campaign {
    // Immutable configuration (set once in constructor)
    address payable public immutable owner;      // 20 bytes
    uint256 public immutable targetAmount;       // 32 bytes
    uint256 public immutable deadline;           // 32 bytes
    
    // Mutable state
    uint256 public totalRaised;                  // 32 bytes
    string public campaignDescription;           // Dynamic
    uint256 public createdAt;                    // 32 bytes
    uint256 public nextProposalId;               // 32 bytes
    
    // Dynamic arrays (gas-expensive to iterate)
    address[] public donors;                     // Array of addresses
    
    // Mappings (O(1) lookup, no iteration)
    mapping(address => uint256) public contributions;
    mapping(uint256 => Proposal) private proposals;
}
```

**Proposal Struct**:

```solidity
struct Proposal {
    uint256 id;                              // Proposal identifier
    string description;                      // What it's for
    uint256 amount;                          // How much ETH
    address payable recipient;               // Who receives
    uint256 voteYes;                         // Total YES weight
    uint256 voteNo;                          // Total NO weight
    bool executed;                           // Execution status
    address[] voters;                        // Who voted
    mapping(address => bool) voted;          // Prevent double-vote
}
```

**Memory Layout Optimization**:

```solidity
// ❌ BAD: Wastes storage slots
struct BadProposal {
    bool executed;        // 1 byte (wastes 31 bytes in slot)
    uint256 id;           // 32 bytes (new slot)
    address recipient;    // 20 bytes (wastes 12 bytes)
}

// ✅ GOOD: Packed efficiently
struct GoodProposal {
    uint256 id;           // 32 bytes (full slot)
    address recipient;    // 20 bytes
    bool executed;        // 1 byte (same slot, saves gas!)
    uint256 amount;       // 32 bytes (new slot)
}
```

### 3.4. Access Control & Modifiers

**Modifier Design**:

```solidity
// Owner-only actions
modifier onlyOwner() {
    require(msg.sender == owner, "Only owner can call this");
    _;
}

// Donor-only actions
modifier onlyDonor() {
    require(contributions[msg.sender] > 0, "Only donors can call this");
    _;
}

// Campaign state checks
modifier campaignActive() {
    require(block.timestamp < deadline, "Campaign has ended");
    _;
}

modifier campaignEnded() {
    require(block.timestamp >= deadline, "Campaign not ended yet");
    _;
}

modifier campaignSuccessful() {
    require(totalRaised >= targetAmount, "Campaign did not reach target");
    _;
}
```

**Access Control Matrix**:

| Function | Owner | Donor | Anyone |
|----------|-------|-------|--------|
| donate() | ✅ | ✅ | ✅ |
| refund() | ✅ (if donor) | ✅ | ❌ |
| createProposal() | ✅ | ❌ | ❌ |
| vote() | ✅ (if donor) | ✅ | ❌ |
| executeProposal() | ✅ | ✅ | ✅ |
| View functions | ✅ | ✅ | ✅ |

### 3.5. Event Design

**Events cho Logging & Indexing**:

```solidity
// Indexed parameters (up to 3) can be filtered
event Donated(
    address indexed donor,      // Can filter by donor
    uint256 amount              // Cannot filter, but logged
);

event ProposalCreated(
    uint256 indexed id,         // Can filter by ID
    string description,
    uint256 amount,
    address recipient
);

event Voted(
    address indexed voter,      // Can filter by voter
    uint256 indexed proposalId, // Can filter by proposal
    bool support,
    uint256 weight
);

event ProposalExecuted(
    uint256 indexed proposalId,
    uint256 amount,
    address recipient
);

event Refunded(
    address indexed donor,
    uint256 amount
);
```

**Event Usage in Frontend**:

```javascript
// Listen to specific events
campaign.on('Donated', (donor, amount, event) => {
  console.log(`${donor} donated ${formatEther(amount)} ETH`);
  updateUI();
});

// Filter past events
const filter = campaign.filters.Voted(null, proposalId);
const events = await campaign.queryFilter(filter, fromBlock, toBlock);
```

---

## 4. THIẾT KẾ FRONTEND

### 4.1. Component Architecture

**Atomic Design Methodology**:

```
Atoms (Smallest units)
├── Button.js
├── Input.js
├── Badge.js
├── Icon.js
└── Text.js

Molecules (Simple combinations)
├── FormField.js (Input + Label)
├── StatusBadge.js (Badge + Icon)
├── StatCard.js (Icon + Text + Value)
└── ProgressBar.js (Bar + Percentage)

Organisms (Complex combinations)
├── CampaignCard.js (Image + Stats + Buttons)
├── ProposalCard.js (Title + Votes + Actions)
├── DonationForm.js (Multiple FormFields + Button)
└── Header.js (Logo + Nav + WalletButton)

Templates (Page layouts)
├── MainLayout.js (Header + Content + Footer)
├── DetailLayout.js (Header + Grid + Sidebar)
└── EmptyState.js (Icon + Message + CTA)

Pages (Complete instances)
├── LandingPage.js
├── CampaignPage.js
├── CampaignDetailPage.js
└── StatisticsPage.js
```

### 4.2. State Management Architecture

**React Context API Strategy**:

```javascript
// 1. Create Context
const CampaignContext = createContext();

// 2. Provider Component
export const CampaignProvider = ({ children }) => {
  // Local state
  const [campaigns, setCampaigns] = useState([]);
  
  // Derived state
  const activeCampaigns = useMemo(
    () => campaigns.filter(c => c.status === 'active'),
    [campaigns]
  );
  
  // Actions
  const fetchCampaigns = useCallback(async () => {
    const data = await contractService.getAllCampaigns();
    setCampaigns(data);
  }, []);
  
  // Memoized context value
  const value = useMemo(() => ({
    campaigns,
    activeCampaigns,
    fetchCampaigns,
    // ... other values
  }), [campaigns, activeCampaigns, fetchCampaigns]);
  
  return (
    <CampaignContext.Provider value={value}>
      {children}
    </CampaignContext.Provider>
  );
};

// 3. Custom Hook
export const useCampaign = () => {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error('useCampaign must be used within CampaignProvider');
  }
  return context;
};
```

**Context Hierarchy**:

```jsx
<App>
  <AuthProvider>           {/* Level 1: Authentication */}
    <CampaignProvider>     {/* Level 2: Campaign data */}
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/campaigns" element={<CampaignPage />} />
          <Route path="/campaign/:address" element={
            <CampaignDetailPage />  {/* Can access both contexts */}
          } />
        </Routes>
        <Footer />
      </Router>
    </CampaignProvider>
  </AuthProvider>
</App>
```

### 4.3. Routing Architecture

**React Router v7 Configuration**:

```javascript
// App.js
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />
      },
      {
        path: 'campaigns',
        element: <CampaignPage />,
        loader: async () => {
          // Pre-fetch data before rendering
          return await contractService.getAllCampaigns();
        }
      },
      {
        path: 'campaign/:address',
        element: <CampaignDetailPage />,
        loader: async ({ params }) => {
          return await contractService.getCampaignDetails(params.address);
        },
        errorElement: <CampaignNotFound />
      },
      {
        path: 'statistics',
        element: <StatisticsPage />
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}
```

**Navigation Flow**:

```
User clicks link/button
         ↓
React Router updates URL
         ↓
Matches route pattern
         ↓
Calls loader (if defined)
         ↓
Fetches data
         ↓
Renders component with data
         ↓
Component mounts & useEffect runs
         ↓
Additional data fetching (if needed)
         ↓
UI fully rendered
```

### 4.4. Form Handling Architecture

**Form State Management**:

```javascript
const DonateForm = ({ campaignAddress, onClose }) => {
  // Form state
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  // Validation
  const validate = useCallback(() => {
    const errors = {};
    
    if (!amount || parseFloat(amount) <= 0) {
      errors.amount = 'Amount must be greater than 0';
    }
    
    if (parseFloat(amount) < 0.0001) {
      errors.amount = 'Minimum donation is 0.0001 ETH';
    }
    
    return errors;
  }, [amount]);
  
  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    try {
      setLoading(true);
      await contractService.donate(campaignAddress, amount);
      toast.success('Donation successful!');
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        disabled={loading}
      />
      {errors.amount && <span className="error">{errors.amount}</span>}
      <button type="submit" disabled={loading}>
        {loading ? 'Processing...' : 'Donate'}
      </button>
    </form>
  );
};
```

### 4.5. Error Handling Architecture

**Error Boundaries**:

```javascript
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}

// Usage
<ErrorBoundary>
  <CampaignDetailPage />
</ErrorBoundary>
```

**Async Error Handling**:

```javascript
// Contract service error parsing
parseError(error, operation) {
  // MetaMask user rejection
  if (error.code === 4001) {
    return 'Transaction cancelled by user';
  }
  
  // Insufficient funds
  if (error.message.includes('insufficient funds')) {
    return 'Insufficient ETH balance';
  }
  
  // Contract revert with reason
  if (error.reason) {
    return error.reason;
  }
  
  // Default
  return `Failed to ${operation}. Please try again.`;
}
```

---

## 5. LUỒNG DỮ LIỆU

### 5.1. Data Flow Architecture

**Unidirectional Data Flow**:

```
┌──────────────────────────────────────────────────────────┐
│                    USER ACTION                           │
│         (Click button, Submit form, etc.)                │
└────────────────────┬─────────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────────────┐
│                 EVENT HANDLER                            │
│            (onClick, onSubmit, etc.)                     │
└────────────────────┬─────────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────────────┐
│              VALIDATE INPUT                              │
│         (Check formats, ranges, etc.)                    │
└────────────────────┬─────────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────────────┐
│           CALL SERVICE FUNCTION                          │
│    (contractService.donate(address, amount))             │
└────────────────────┬─────────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────────────┐
│          PREPARE TRANSACTION                             │
│    (Parse amount, estimate gas, etc.)                    │
└────────────────────┬─────────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────────────┐
│         SEND TO METAMASK                                 │
│    (User sees confirmation popup)                        │
└────────────────────┬─────────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────────────┐
│        USER CONFIRMS IN METAMASK                         │
│    (Signs transaction with private key)                  │
└────────────────────┬─────────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────────────┐
│       BROADCAST TO BLOCKCHAIN                            │
│    (Transaction enters mempool)                          │
└────────────────────┬─────────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────────────┐
│         MINERS/VALIDATORS PROCESS                        │
│    (Transaction included in block)                       │
└────────────────────┬─────────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────────────┐
│      SMART CONTRACT EXECUTES                             │
│    (State changes, events emitted)                       │
└────────────────────┬─────────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────────────┐
│       RECEIVE TRANSACTION RECEIPT                        │
│    (Frontend gets confirmation)                          │
└────────────────────┬─────────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────────────┐
│         UPDATE UI STATE                                  │
│    (Re-fetch data, show success message)                 │
└────────────────────┬─────────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────────────┐
│            USER SEES RESULT                              │
│         (Updated UI with new data)                       │
└──────────────────────────────────────────────────────────┘
```

### 5.2. Detailed Flow: Create Campaign

```
Step 1: USER INPUT
├── User fills form:
│   ├── Owner address: 0x123...
│   ├── Target: 10 ETH
│   ├── Duration: 30 days
│   └── Description: "Help refugees"

Step 2: FRONTEND VALIDATION
├── Check address format (0x... with 40 hex chars)
├── Check target > 0
├── Check duration > 0
├── Check description length
└── If valid → proceed, else show errors

Step 3: CALL CONTRACT SERVICE
contractService.createCampaign(owner, target, duration, desc)
├── Convert target: ethers.parseEther("10")
├── Convert duration: 30 * 24 * 3600 seconds
├── Get factory contract instance
└── Prepare transaction

Step 4: SEND TRANSACTION
factoryContract.createCampaign(owner, targetWei, durationSec, desc)
├── MetaMask popup appears
├── Shows gas estimate: ~200,000 gas
├── User reviews and confirms
└── Transaction signed with private key

Step 5: BLOCKCHAIN PROCESSING
├── Transaction broadcast to network
├── Enters mempool
├── Validators pick up transaction
├── Execute CampaignFactory.createCampaign()
│   ├── new Campaign(owner, target, deadline, desc)
│   ├── Save to deployedCampaigns array
│   └── Emit CampaignCreated event
└── Block mined (12-15 seconds on Ethereum)

Step 6: CONFIRMATION
├── Frontend receives transaction receipt
├── Extract new campaign address from receipt
├── Show success toast
├── Redirect to /campaign/:address
└── Fetch campaign details

Step 7: UI UPDATE
├── Campaign appears in list
├── All details visible
├── Status: "Active"
└── Progress: 0%
```

### 5.3. Detailed Flow: Vote on Proposal

```
Step 1: USER ACTION
└── User clicks "Ủng hộ" on ProposalCard

Step 2: PERMISSION CHECK (Frontend)
├── Check: User is donor?
│   └── contributions[userAddress] > 0
├── Check: User hasn't voted?
│   └── !proposal.voted[userAddress]
└── If fail → Show error toast

Step 3: CALL CONTRACT
contractService.vote(campaignAddress, proposalId, true)
├── Get campaign contract
├── Call campaign.vote(proposalId, true)
└── MetaMask popup

Step 4: USER CONFIRMS
├── Review transaction details
├── Gas estimate: ~80,000 gas
└── Confirm

Step 5: SMART CONTRACT EXECUTION
vote(proposalId, true) {
  ├── Check: onlyDonor (contributions > 0) ✓
  ├── Check: campaignSuccessful ✓
  ├── Check: !proposal.voted[msg.sender] ✓
  ├── Check: !proposal.executed ✓
  ├── Calculate: weight = sqrt(contributions[msg.sender])
  ├── Update: proposal.voteYes += weight
  ├── Update: proposal.voted[msg.sender] = true
  ├── Update: proposal.voters.push(msg.sender)
  └── Emit: Voted(msg.sender, proposalId, true, weight)
}

Step 6: EVENT LISTENER (Frontend)
campaign.on('Voted', (voter, proposalId, support, weight) => {
  ├── Update local proposal data
  ├── Re-calculate vote percentages
  ├── Update progress bars
  └── Show notification
})

Step 7: UI UPDATE
├── Vote button disabled
├── Vote counts updated
├── Progress bars animated
├── "You voted: Ủng hộ" badge shown
└── Check if quorum reached → show execute button
```

---

## 6. THIẾT KẾ DATABASE & STATE

### 6.1. On-Chain Storage (Blockchain)

**Storage Layout**:

```
Campaign Contract Storage:
├── Slot 0: owner (20 bytes) + vacant (12 bytes)
├── Slot 1: targetAmount (32 bytes / uint256)
├── Slot 2: deadline (32 bytes / uint256)
├── Slot 3: totalRaised (32 bytes / uint256)
├── Slot 4: campaignDescription (string) → points to data location
├── Slot 5: createdAt (32 bytes / uint256)
├── Slot 6: nextProposalId (32 bytes / uint256)
├── Slot 7: donors array length
│   └── Slot keccak256(7): donors[0]
│   └── Slot keccak256(7)+1: donors[1]
│   └── ... (dynamic)
├── Slot 8: contributions mapping root
│   └── Slot keccak256(address, 8): contributions[address]
└── Slot 9: proposals mapping root
    └── Slot keccak256(proposalId, 9): proposals[proposalId]
        ├── Slot +0: id
        ├── Slot +1: description → points to data
        ├── Slot +2: amount
        ├── Slot +3: recipient (20 bytes) + executed (1 byte)
        ├── Slot +4: voteYes
        ├── Slot +5: voteNo
        ├── Slot +6: voters array length
        └── Slot +7: voted mapping root
```

**Storage Costs**:
```
Operation               | Gas Cost
------------------------|----------
Store uint256 (first)   | 20,000
Store uint256 (update)  | 5,000
Store address           | 20,000
Store string (per byte) | ~625
Read storage (SLOAD)    | 2,100
Delete storage (SSTORE) | -15,000 (refund)
```

**Optimization Strategies**:

```solidity
// ✅ Use events for data that doesn't need on-chain storage
event DonationReceived(address donor, uint256 amount, string message);
// Frontend can reconstruct history from events

// ✅ Pack multiple values in single slot
struct PackedData {
    uint128 amount;     // 16 bytes
    uint64 timestamp;   // 8 bytes
    uint32 id;          // 4 bytes
    bool active;        // 1 byte
    // Total: 29 bytes → fits in 32-byte slot
}

// ✅ Use immutable for constants
address payable public immutable owner;  // No storage, cheaper
uint256 public immutable targetAmount;   // Embedded in bytecode

// ❌ Avoid large arrays
address[] public allDonors;  // Expensive to iterate
// Better: Use events and build list off-chain
```

### 6.2. Off-Chain Storage (Frontend)

**Client-Side State Structure**:

```javascript
// Redux-like structure (using Context API)
{
  auth: {
    account: "0x123...",
    isConnected: true,
    chainId: 31337
  },
  
  campaigns: {
    list: [
      {
        address: "0xabc...",
        owner: "0x123...",
        targetAmount: "10",
        totalRaised: "7.5",
        deadline: 1702345678,
        status: "active",
        progressPercentage: 75,
        donorsCount: 42,
        // ... other fields
      }
    ],
    loading: false,
    error: null,
    lastFetched: 1702345678
  },
  
  campaignDetail: {
    data: { /* full campaign data */ },
    donors: [],
    proposals: [],
    events: [],
    loading: false
  },
  
  ui: {
    showDonateModal: false,
    showCreateProposalModal: false,
    activeTab: "overview",
    notifications: []
  }
}
```

**State Update Patterns**:

```javascript
// Optimistic Update
const handleDonate = async (amount) => {
  // 1. Optimistically update UI
  setLocalDonation(prev => prev + parseFloat(amount));
  
  try {
    // 2. Send transaction
    await contractService.donate(address, amount);
    
    // 3. Wait for confirmation
    // Real update will come from blockchain
  } catch (error) {
    // 4. Revert optimistic update on error
    setLocalDonation(prev => prev - parseFloat(amount));
    toast.error('Donation failed');
  }
};

// Polling for Updates
useEffect(() => {
  const interval = setInterval(() => {
    fetchCampaignDetails();
  }, 15000); // Poll every 15 seconds
  
  return () => clearInterval(interval);
}, []);

// Event-Driven Updates
useEffect(() => {
  const filter = campaign.filters.Donated();
  campaign.on(filter, (donor, amount) => {
    // Real-time update on new donation
    fetchCampaignDetails();
  });
  
  return () => campaign.removeAllListeners();
}, [campaign]);
```

### 6.3. Cache Strategy

**Multi-Level Caching**:

```
Level 1: Browser Memory (React State)
├── Duration: Until page refresh
├── Scope: Current component tree
└── Use: Immediate access

Level 2: Session Storage
├── Duration: Until tab closed
├── Scope: Current tab
└── Use: Persist across page navigations

Level 3: Local Storage
├── Duration: Persistent
├── Scope: Origin (domain)
└── Use: User preferences, recent campaigns

Level 4: Blockchain Node Cache
├── Duration: Blocks back
├── Scope: Network-wide
└── Use: Historical data queries
```

**Implementation**:

```javascript
// Cache service
class CacheService {
  constructor() {
    this.memoryCache = new Map();
    this.ttl = 60000; // 1 minute
  }
  
  set(key, value) {
    this.memoryCache.set(key, {
      value,
      timestamp: Date.now()
    });
  }
  
  get(key) {
    const cached = this.memoryCache.get(key);
    if (!cached) return null;
    
    const age = Date.now() - cached.timestamp;
    if (age > this.ttl) {
      this.memoryCache.delete(key);
      return null;
    }
    
    return cached.value;
  }
  
  invalidate(key) {
    this.memoryCache.delete(key);
  }
}

// Usage
const campaignCache = new CacheService();

async function getCampaignDetails(address) {
  // Check cache first
  const cached = campaignCache.get(address);
  if (cached) return cached;
  
  // Fetch from blockchain
  const data = await contract.getCampaignSummary();
  
  // Cache result
  campaignCache.set(address, data);
  
  return data;
}
```

---

*Đây là phần 1 của tài liệu. Tiếp tục với phần 2...*
