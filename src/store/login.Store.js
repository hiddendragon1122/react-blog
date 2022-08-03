import {makeAutoObservable} from 'mobx'
import { http, setToken, getToken, removeToken } from '../utils'

class LoginStore {
    token = getToken() || ''
    constructor(){
        makeAutoObservable(this)
    }
    getToken = async ({mobile,code}) => {
        //call登入接口
        const res = await http.post('http://geek.itheima.net/v1_0/authorizations',{
            mobile,code
        })
        //存入token
        this.token = res.data.token
        //存入localStorage
        setToken(this.token)
    }
    logout = () => {
        this.token = ''
        removeToken()
    }
}

export default LoginStore