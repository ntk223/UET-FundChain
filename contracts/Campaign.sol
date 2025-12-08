// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Campaign (DAO-style Crowdfunding)
 * @dev Hợp đồng gây quỹ minh bạch với cơ chế bỏ phiếu phê duyệt chi tiêu.
 */
contract Campaign {
    // --- Biến Trạng thái (State Variables) ---
    address payable public immutable owner;   // Người hưởng thụ (người nhận tiền)
    uint256 public immutable targetAmount;          // Mục tiêu cần đạt
    uint256 public immutable deadline;              // Thời điểm kết thúc chiến dịch
    uint256 public totalRaised;                     // Tổng số tiền đã huy động
    string public campaignDescription;              // Mô tả chiến dịch
    uint256 public createdAt;                      // Thời điểm tạo chiến dịch
    

    // Danh sách người donate & số tiền họ đóng góp
    address[] public donors;
    mapping(address => uint256) public contributions;

    // --- Cấu trúc Đề xuất chi tiêu (Proposal Struct) ---
    struct Proposal {
        uint256 id;
        string description;          // Mô tả đề xuất
        uint256 amount;              // Số tiền cần chi
        address payable recipient;   // Người nhận tiền
        uint256 voteYes;             // Tổng số phiếu ủng hộ (tính theo số tiền donate)
        uint256 voteNo;              // Tổng số phiếu phản đối
        bool executed;               // Đề xuất đã được thực hiện hay chưa
        address[] voters;          // Danh sách người đã bỏ phiếu
        mapping(address => bool) voted; // Tránh double-vote
    }

    // Lưu các proposal
    mapping(uint256 => Proposal) private proposals;
    uint256 public nextProposalId;

    // --- Events ---
    event Donated(address indexed donor, uint256 amount);
    event Refunded(address indexed donor, uint256 amount);
    event ProposalCreated(uint256 id, string description, uint256 amount, address recipient);
    event Voted(address indexed voter, uint256 proposalId, bool support, uint256 weight);
    event ProposalExecuted(uint256 indexed proposalId, uint256 amount, address recipient);

    // --- Modifiers ---
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    modifier onlyDonor() {
        require(contributions[msg.sender] > 0, "Only donors can call this");
        _;
    }

    modifier campaignSuccessful() {
        require(totalRaised >= targetAmount, "Campaign did not reach target");
        _;
    }

    modifier campaignEnded() {
        require(block.timestamp >= deadline, "Campaign not ended yet");
        _;
    }

    modifier campaignActive() {
        require(block.timestamp < deadline, "Campaign has ended");
        _;
    }

    // --- Constructor ---
    constructor(
        address payable _owner,
        uint256 _target,
        uint256 _durationInSeconds,
        string  memory _campaignDescription
    ) {
        owner = _owner;
        targetAmount = _target;
        deadline = block.timestamp + _durationInSeconds;
        campaignDescription = _campaignDescription;
        createdAt = block.timestamp;
    }

    // --- 1. Donate ---
    function donate() external payable campaignActive {
        require(msg.value > 0, "Must send ETH");

        if (contributions[msg.sender] == 0) {
            donors.push(msg.sender);
        }
        contributions[msg.sender] += msg.value;
        totalRaised += msg.value;

        emit Donated(msg.sender, msg.value);
    }

    // --- 2. Hoàn tiền nếu thất bại ---
    function refund() external campaignEnded {
        require(totalRaised < targetAmount, "Campaign successful, cannot refund");
        
        uint256 amount = contributions[msg.sender];
        require(amount > 0, "Nothing to refund");

        contributions[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Refund failed");

        emit Refunded(msg.sender, amount);
    }

    // --- 3. Tạo đề xuất chi tiêu ---
    function createProposal(
        string calldata _description,
        uint256 _amount,
        address payable _recipient
    ) external onlyOwner campaignSuccessful {
        require(_amount > 0, "Amount must be greater than 0");
        require(_amount <= address(this).balance, "Not enough funds");
        require(_recipient != address(0), "Invalid recipient address");

        Proposal storage p = proposals[nextProposalId];
        p.id = nextProposalId;
        p.description = _description;
        p.amount = _amount;
        p.recipient = _recipient;

        emit ProposalCreated(nextProposalId, _description, _amount, _recipient);
        nextProposalId++;
    }

    // --- 4. Bỏ phiếu cho đề xuất ---
    function _sqrt(uint256 x) internal pure returns (uint256 y) {
        uint256 z = (x + 1) / 2;
        y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
    }
    function vote(uint256 proposalId, bool support) external onlyDonor campaignSuccessful {
        Proposal storage p = proposals[proposalId];

        require(proposalId < nextProposalId, "Proposal does not exist");
        require(!p.voted[msg.sender], "Already voted");
        require(!p.executed, "Proposal already executed");

        uint256 weight = _sqrt(contributions[msg.sender]);
        p.voted[msg.sender] = true;

        if (support) {
            p.voteYes += weight;
        } else {
            p.voteNo += weight;
        }
        p.voters.push(msg.sender);

        emit Voted(msg.sender, proposalId, support, weight);
    }

    // --- 5. Thực hiện đề xuất nếu được thông qua ---
    function executeProposal(uint256 proposalId) external campaignSuccessful {
        Proposal storage p = proposals[proposalId];
        require(proposalId < nextProposalId, "Proposal does not exist");
        require(!p.executed, "Already executed");
        require(p.voters.length > 0, "No votes cast");
        require(p.voters.length * 2 > donors.length, "Quorum not reached (need >50% donors)");
        require(p.voteYes > p.voteNo, "Proposal not approved (more No than Yes)");
        require(p.amount <= address(this).balance, "Insufficient funds");
        

        p.executed = true;

        (bool success, ) = p.recipient.call{value: p.amount}("");
        require(success, "Transfer failed");

        emit ProposalExecuted(proposalId, p.amount, p.recipient);
    }

    // --- View functions (tiện ích) ---
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function getDonorCount() external view returns (uint256) {
        return donors.length;
    }

    function getTotalUsed() external view returns (uint256) {
        return totalRaised - address(this).balance;
    }

    function getProposal(uint256 proposalId)
        external
        view
        returns (
            string memory description,
            uint256 amount,
            address recipient,
            uint256 voteYes,
            uint256 voteNo,
            bool executed
        )
    {
        Proposal storage p = proposals[proposalId];
        return (p.description, p.amount, p.recipient, p.voteYes, p.voteNo, p.executed);
    }

    function isVoted (uint256 proposalId, address voter) external view returns (bool) {
        Proposal storage p = proposals[proposalId];
        return p.voted[voter];
    }

    function getVoterCount(uint256 proposalId) external view returns (uint256) {
        Proposal storage p = proposals[proposalId];
        return p.voters.length;
    }

    // --- Helper Functions ---
    
    /**
     * @dev Kiểm tra campaign đã kết thúc chưa
     */
    function isEnded() external view returns (bool) {
        return block.timestamp >= deadline;
    }

    /**
     * @dev Kiểm tra campaign thành công (đạt target)
     */
    function isSuccessful() external view returns (bool) {
        return totalRaised >= targetAmount;
    }

    /**
     * @dev Lấy thời gian còn lại (seconds), trả về 0 nếu đã hết hạn
     */
    function getTimeRemaining() external view returns (uint256) {
        if (block.timestamp >= deadline) {
            return 0;
        }
        return deadline - block.timestamp;
    }

    /**
     * @dev Lấy phần trăm đã gây quỹ (x100 để tránh decimals)
     * Ví dụ: 7500 = 75.00%
     */
    function getProgressPercentage() external view returns (uint256) {
        if (targetAmount == 0) return 0;
        return (totalRaised * 10000) / targetAmount;
    }

    /**
     * @dev Kiểm tra địa chỉ có phải donor không
     */
    function isDonor(address addr) external view returns (bool) {
        return contributions[addr] > 0;
    }

    /**
     * @dev Lấy contribution của một address cụ thể
     */
    function getContribution(address addr) external view returns (uint256) {
        return contributions[addr];
    }

    /**
     * @dev Lấy danh sách tất cả donors
     */
    function getDonors() external view returns (address[] memory) {
        return donors;
    }

    /**
     * @dev Lấy danh sách voters của một proposal
     */
    function getProposalVoters(uint256 proposalId) external view returns (address[] memory) {
        require(proposalId < nextProposalId, "Proposal does not exist");
        Proposal storage p = proposals[proposalId];
        return p.voters;
    }

    /**
     * @dev Kiểm tra proposal có đủ quorum không (>50% donors voted)
     */
    function hasQuorum(uint256 proposalId) external view returns (bool) {
        require(proposalId < nextProposalId, "Proposal does not exist");
        Proposal storage p = proposals[proposalId];
        return p.voters.length * 2 > donors.length;
    }

    /**
     * @dev Kiểm tra proposal có được approved không (voteYes > voteNo)
     */
    function isProposalApproved(uint256 proposalId) external view returns (bool) {
        require(proposalId < nextProposalId, "Proposal does not exist");
        Proposal storage p = proposals[proposalId];
        return p.voteYes > p.voteNo;
    }

    /**
     * @dev Lấy tổng số proposals
     */
    function getProposalCount() external view returns (uint256) {
        return nextProposalId;
    }

    /**
     * @dev Lấy thông tin tổng quan campaign
     */
    function getCampaignSummary() external view returns (
        address campaignOwner,
        uint256 target,
        uint256 raised,
        uint256 balance,
        uint256 deadlineTimestamp,
        uint256 donorCount,
        uint256 proposalCount,
        bool ended,
        bool successful
    ) {
        return (
            owner,
            targetAmount,
            totalRaised,
            address(this).balance,
            deadline,
            donors.length,
            nextProposalId,
            block.timestamp >= deadline,
            totalRaised >= targetAmount
        );
    }

    /**
     * @dev Lấy vote weight của một donor (dùng cho display)
     */
    function getVoteWeight(address donor) external view returns (uint256) {
        return _sqrt(contributions[donor]);
    }
}
