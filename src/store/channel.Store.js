import { makeAutoObservable } from "mobx";
import { http } from '../utils/http'

class ChannelStore {
    channelList = []
    constructor(){
        makeAutoObservable(this)
    }
    //article publish both need it ==> layout
    loadChannelList = async () => {
        const res = await http.get('/channels')
        this.channelList = res.data.channels
    }
}

export default ChannelStore