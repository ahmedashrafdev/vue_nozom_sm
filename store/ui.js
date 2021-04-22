export const state = () => ({
    buyModal: false,
    buyReturnModal:false,
    inventoryModal:false,
    sellModal:false,
    sellReturnModal:false,
    pageTitle:'',
  })
  
export const mutations = {
    buyModal(state , payload){
        state.buyModal = payload
    },
    buyReturnModal(state , payload){
        state.buyReturnModal = payload
    },
    inventoryModal(state , payload){
        state.inventoryModal = payload
    },
    sellModal(state , payload){
        state.sellModal = payload
    },
    sellReturnModal(state , payload){
        state.sellReturnModal = payload
    },
    pageTitle(state , payload){
        state.pageTitle = payload
    },
    
}

  
export const getters = {
    buyModal(state) {
        return state.buyModal
    },
    buyReturnModal(state) {
        return state.buyReturnModal
    },
    inventoryModal(state) {
        return state.inventoryModal
    },
    sellModal(state) {
        return state.sellModal
    },
    sellReturnModal(state) {
        return state.sellReturnModal
    },
    pageTitle(state) {
        return state.pageTitle
    },
}
  