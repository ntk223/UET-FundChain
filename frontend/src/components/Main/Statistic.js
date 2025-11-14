
const Statistic = ({stats}) => {
    return (
        <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card text-center">
            <div className="text-2xl font-bold text-gray-800">{stats.totalCampaigns}</div>
            <div className="text-gray-600">Tổng campaigns</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-green-600">{stats.activeCampaigns}</div>
            <div className="text-gray-600">Đang hoạt động</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.successfulCampaigns}</div>
            <div className="text-gray-600">Thành công</div>
          </div>
          <div className="card text-center">
            {/* <div className="text-2xl font-bold text-purple-600">{stats.totalRaised.toFixed(2)}</div> */}
            <div className="text-gray-600">ETH đã huy động</div>
          </div>
        </div>
        </>
    )
}

export default Statistic;