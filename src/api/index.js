import {baseUrl,additionUrl,newUrl} from '../config/index'

export default  {
    login:`${additionUrl}/api/appserver/auth/login`,
    getHouseList:`${baseUrl}/mqi/pageOrData/45268bd540d147e6ad3bfca27958f3d6`,
    getHouseUnitInfo:`${baseUrl}/mqi/pageOrData/c6d2af1c2b9e4e4fb92cd77815d3881d`,  //实有房屋单元信息
    getHouseUnitEmphasisInfo:`${baseUrl}/mqi/pageOrData/00806c1d869749c781a749e1ee31dbfc`,//重点关注人员房屋
    getHousePersonDetail:`${baseUrl}/mqi/pageOrData/f8ba05a25d584f3387ed5b05b0ac1332`,//实有房屋单元信息人员详情
    getHouseColor:`${baseUrl}/mqi/pageOrData/e91eb7150e964e0cb1c652b33684511f`,//实有房屋单元信息颜色对应接口
    getPopulaceDistribution:`${baseUrl}/mqi/pageOrData/51dd63c14739418396b20224db5b9fe7`, //实有人口统计
    getPopulaceList:`${baseUrl}/mqi/pageOrData/1d52e595b9ba4ac7b6a4b16bd29a15b5`,//居民人员列表
    getPopulaceDetail:`${baseUrl}/mqi/pageOrData/60ad02f6fe464383b263f5e526523718`,//居民信息详情
    getWaitCheckList:`${baseUrl}/mqi/pageOrData/f06730824b32451b9c36cea394fe7269`,//待核查任务列表
    getCheckTaskDetail:`${baseUrl}/mqi/pageOrData/fe326a60fd014ecd9bfcdb29535ff65b`,//获取待核查任务详细信息
    getCheckTaskInfo:`${baseUrl}/mqi/pageOrData/9ba2b184921b4516b203fa4aef8db67f`,//立即处理核查任务
    getCheckTaskPersonList:`${baseUrl}/mqi/pageOrData/1a215bf121d14869ab26190d48016ad6`,//获取核查任务的住户信息
    getCheckTaskAreaList:`${baseUrl}/mqi/pageOrData/8c615beddec446e599365c6f2e580aa3`,//获取小区列表
    getCheckTaskBuildList:`${baseUrl}/mqi/pageOrData/c7857a8ee6af4eeb8c785474f4a89edc`,//获取楼栋列表
    getCheckTaskUnitList:`${baseUrl}/mqi/pageOrData/abb458d0395b40d4a2b9836c011729c7`,//获取楼栋列表
    getCheckTaskRoomList:`${baseUrl}/mqi/pageOrData/73891eafff0a4932bfe4db4e3b04f814`,//获取房间列表
    getCheckTaskFilterType:`${baseUrl}/mqi/pageOrData/1571eeec5946406c8cd12d603a605a01`,
    getDoneCheckList:`${baseUrl}/mqi/pageOrData/14111dbd05d94c909ec5aa74ef44fd17`,//获取已完成任务列表
    dealCheckTask:`${additionUrl}/api/appserver/task/update`,//立即处理任务
    saveCheckTask:`${additionUrl}/api/appserver/roomtask/update`,//提交核查任务
    getDictList:`${baseUrl}/mqi/pageOrData/f76eab9d20db4b4e931bf86b7622792f`,//获取字典值
    getCheckTaskResultPersonList:`${baseUrl}/mqi/pageOrData/80c7c259ee1e4db486031762e4c48443`,//获取字典值
    getHousePersonDetail:`${baseUrl}/mqi/pageOrData/f8ba05a25d584f3387ed5b05b0ac1332`,//实有房屋单元信息人员详情
    imageUpload:`${additionUrl}/api/appserver/obs/fileUpload`,
    idCardUploadOcr:`${additionUrl}/api/appserver/obs/idCardUploadOcr`,
    taskperson:`${additionUrl}/api/appserver/taskperson/update`,
    getHomeAlarmList:`${baseUrl}/mqi/pageOrData/a52d3efd7eeb479c8e56625be28a60f8`, //首页报警列表
    getNotifAlarmData: `${newUrl}/api/alarm/push`, //首页报警通知栏信息
    getRealUnitList: `${baseUrl}/mqi/pageOrData/c50fd0e93e4d4deca21f20a36450204d`,//获取使用单位列表
    getVehicleRegional:`${baseUrl}/mqi/pageOrData/6e48b45d8454446b9c2fe3506900b4af`,//车辆归属统计
    getVehicleDetails:`${baseUrl}/mqi/pageOrData/d600fa5cb8d347f69f87da8439f5890c`,//车辆详情列表
    getEmployeeByUnitId: `${baseUrl}/mqi/pageOrData/c0493afcff0f463d9ea1a9cd2662675e`,//根据实有单位的Id获取对应从业人员
    getRealUnitTypeData: `${baseUrl}/mqi/pageOrData/5a0c22a3855644e4bbcaa42d35b2f55b`,//实有单位类型下拉数据
    getQuickSearchList:`${baseUrl}/mqi/pageOrData/273c01377bca474bbc9de1b1e0f9638e`,//快搜列表
    getQuickSearchSpecialList:`${baseUrl}/mqi/pageOrData/3e7e12c6a4f74b3f85b7481c63a618f4`,//快搜特定条件查询
    getControlDetail:`${baseUrl}/mqi/pageOrData/6058421c17f4432b9825e9042351ed76`,//布控详情
    updateControlDetailStatus:`${additionUrl}/api/appserver/taskperson/update`,//布控已读未读
    getWaitDisputeList: `${baseUrl}/mqi/pageOrData/f06730824b32451b9c36cea394fe7269`,//纠处理纷待
    getWaitDispute: `${baseUrl}/mqi/pageOrData/fc3e5d744038479dae75f051af88fda3`,//纠处理纷待详情
    getSuccessDisputeList:`${baseUrl}/mqi/pageOrData/b0a04eea6e9745f8bcf5948ad8ed8fb8`,//已处理纠纷列表
    disputeUpdate: `${additionUrl}/api/appserver/taskdispute/update`,//纠纷处理
    disputeAdd: `${additionUrl}/api/appserver/taskdispute/add`,//纠纷登记
    disputeHistory: `${baseUrl}/mqi/pageOrData/39825d044c5944859edccb46c258bd7f`,//j纠纷历史
    disputePeople: `${baseUrl}/mqi/pageOrData/7575349594504a27b5fca32061c57949`,//涉事人员信息
    loginOut:`${additionUrl}/api/appserver/auth/loginOut`,//退出登录
    getHistoryList:`${baseUrl}/mqi/pageOrData/d60f42195e7d4e77abf55880d838fa3f`,//我的任务清单list
    getHouseCheckPoliceList:`${baseUrl}/mqi/pageOrData/c9d1baf216c24dc6ac349105f58d6cf4`,//房屋核查警察list
    addHouseCheck:`${additionUrl}/api/appserver/roomtask/add`,//添加房屋核查任务
    getHouseCheckOwnerInfo:`${baseUrl}/mqi/pageOrData/8bb0ad2690d14a24aa3a9d2e26740911`,//房屋核查房主信息
}