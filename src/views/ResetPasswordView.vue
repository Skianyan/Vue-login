<template>
  <div class="login-page">
    <div class="login-card">

      <h1 class="card-title">Nueva contraseña</h1>

      <form @submit.prevent="handleReset">

        <input
          v-model="password"
          type="password"
          placeholder="Nueva contraseña"
          class="field-input"
        />

        <button class="btn-submit">
          Actualizar contraseña →
        </button>

      </form>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'vue-router'

const password = ref('')
const router = useRouter()

async function handleReset() {
  errorMsg.value = ''
  isLoading.value = true

  try {
    const { error } = await supabase.auth.updateUser({
      password: password.value
    })

    if (error) {
      errorMsg.value = error.message
      return
    }
    
    await supabase.auth.signOut()
    await router.replace('/login')

  } catch (err) {
    errorMsg.value = 'Error al actualizar contraseña.'
  } finally {
    isLoading.value = false
  }
}
</script>