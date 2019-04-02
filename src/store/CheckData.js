import { observable, action ,computed} from "mobx";
//import CookieManager from "react-native-cookiemanager";
import {AsyncStorage,DeviceEventEmitter} from 'react-native';


//import DateUtil from "../utils/DateUtil";

class CheckData {


    @observable data = {};

    @observable personData = [];

    @observable nationList = [];

    @observable countryList = [];

    @observable peopleTypeList = [];

    @action
    setNationList = (data) =>{
        this.nationList = data
    }

    @action
    setCountryList = (data) =>{
        this.countryList = data
    }

    @action
    setPeopleTypeList = (data) =>{
        this.peopleTypeList = data
    }


    @action
    updateData = (data) =>{
        this.data = data
    }

    @action
    updateByKey = (key,value)=>{
        console.log(key,value);
       this.data[key] = value
    }


    @action
    setPerson = (personList)=>{
        console.log('personList',personList)
        this.personData = personList
    }

    @action
    updatePerson = (index,person)=>{
        this.personData[index] = person
    }

    @action
    removePerson = (index)=>{
        this.personData.splice(index,1)
    }

    @action
    addPerson = ()=>{
        let person= {
                    nation:'',
                    roomerName:'',
                    userType:'',
                    phone:'',
                    cardNumber:'',
                    housePlace:'',
                    startTime:'',
                    endTime:'',
                    identyPhoto:'',
                    imgUrl:'',
                    identyPhoto1:'',
                    identyPhoto2:'',
                    isDelete:false,
                }
        this.personData.push(person)
    }

    @action
    updatePersonByKey =(index,key,value)=>{
        this.personData[index][key] = value
    }

}

export default new CheckData()