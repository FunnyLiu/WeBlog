const state = {
    count:0
}

const actions = {
    addNumberAction(context){
        context.commit('addNumber')
    }
}

const mutations = {
    addNumber(state,payload){
        state.count += payload;
    }
}

export default{
    namespaced:true,
    state,
    actions,
    mutations
}