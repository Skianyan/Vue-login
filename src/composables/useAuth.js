import { ref, computed } from 'vue'

const user = ref(JSON.parse(localStorage.getItem('user')))
const token = ref(localStorage.getItem('token'))

export function useAuth() {

  const isAuthenticated = computed(() => !!user.value)

  function login(u, t) {
    user.value = u
    token.value = t

    localStorage.setItem('user', JSON.stringify(u))
    localStorage.setItem('token', t)
  }

  function logout() {
    user.value = null
    token.value = null

    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  return {
    user,
    token,
    isAuthenticated, // 🔥 THIS WAS MISSING
    login,
    logout
  }
}