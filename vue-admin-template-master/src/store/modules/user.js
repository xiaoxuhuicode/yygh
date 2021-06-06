import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    Login({ commit }) {
      const data = {
        'token': 'admin'
      }
      setToken(data.token)// 将token存储在cookie中
      commit('SET_TOKEN', data.token)
    },

    GetInfo({ commit }) {
      const data = {
        'roles': [
          'admin'
        ],
        'name': 'admin',
        'avatar': 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
      }
      if (data.roles &&data.roles.length >0) { // 验证返回的roles是否是一个非空数组
        commit('SET_ROLES', data.roles)
      }
      commit('SET_NAME', data.name)
      commit('SET_AVATAR', data.avatar)
    },

// 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resolve()
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
