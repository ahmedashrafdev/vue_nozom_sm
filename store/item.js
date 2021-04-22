import http from "../repositories/Repository.js";
export const state = () => ({
    loading :false,
    storeLaoding:false,
    
  })
  
export const mutations = {
    setLoading(state , payload){
        state.laoding = payload
    },
    setStoreLoading(state , payload){
        state.storeLaoding = payload
    },
   
    
}

  
export const getters = {
    loading(state) {
        return state.loading
    },
    storeLaoding(state) {
        return state.storeLaoding
    }
    
}
  

export const actions = {
    get({commit} , payload) {
        commit('setLoading' , true)
        return new Promise((resolve, reject) => {
            http
            .post("get-item" , payload)
            .then(res => {
                commit('setLoading' , false)
                resolve(res.data);
            })
            .catch(e => {
                commit('setLoading' , false)
                reject(e.response.data);
            })
        })
    },
    store({commit} , payload) {
        commit('setStoreLoading' , true)
        payload.DevNo = parseInt(localStorage.getItem('device'))
        return new Promise((resolve, reject) => {
            http
            .post("insert-item" , payload)
            .then(res => {
                commit('setStoreLoading' , false)
                resolve(res.data);
            })
            .catch(e => {
                commit('setStoreLoading' , false)
                reject(e.response.data);
            })
        })
    },
    
}