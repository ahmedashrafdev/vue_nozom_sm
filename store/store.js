import http from "../repositories/Repository.js";

export const state = () => ({
    loading :false,
    stores:[],
  })
  
export const mutations = {
    setLoading(state , payload){
        state.laoding = payload
    },
    setStores(state , payload){
        state.stores = payload
    },
    
}

  
export const getters = {
    loading(state) {
        return state.loading
    },
    stores(state) {
        return state.stores
    },
}
  

export const actions = {
    get({commit}) {
        commit('setLoading' , true)
        return new Promise((resolve, reject) => {
            http
            .get("cashtry/stores")
            .then(res => {
                commit('setStores' , res.data)
                commit('setLoading' , false)
                resolve(res.data);
            })
            .catch(e => {
                commit('setLoading' , false)
                reject(e.response.data);
            })
        })
    },
}