import fetch from 'isomorphic-fetch'
import { endpoints } from '../../constants'

export default class SubscribeRequests {
    
    static subscribe(body) {
        return fetch( endpoints.SUBSCRIBE, { 
            method: 'post',
            body: JSON.stringify(body)
        })
    }

}