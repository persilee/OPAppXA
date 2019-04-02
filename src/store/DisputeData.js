import { observable, action ,computed} from "mobx";



class DisputeData {
    @observable data = {};

    //纠纷照片
    @observable disputeImages = {};

    //涉事人员照片
    @observable dPeopleImgList = {};

    @action
    clean = ()=>{
        this.data = {};
        this.disputeImages = {}
        this.dPeopleImgList = {}
    }

    @action
    updateDisputeImagesByKey = (key,value)=>{
        console.log(key,value);
        this.disputeImages[key] = value
    }

    @action
    updateDisputePeopleImagesByKey = (index,key,value)=>{
        console.log(key,value);
        if(this.dPeopleImgList[index]==null){
            this.dPeopleImgList[index] = {};
        }
        this.dPeopleImgList[index][key] = value
    }

}









export default new DisputeData()