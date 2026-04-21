<template>
  <div class="login-page">
    <div class="bg-grid" aria-hidden="true"></div>
    <div class="bg-glow" aria-hidden="true"></div>

    <div class="login-card">
      <div class="card-header">
        <span class="card-icon">🔐</span>
        <h1 class="card-title">Nueva contraseña</h1>
        <p class="card-subtitle">Elige una contraseña segura para tu cuenta</p>
      </div>

      <Transition name="alert">
        <div v-if="errorMsg" class="alert-error" role="alert">
          <span>⚠</span> {{ errorMsg }}
        </div>
      </Transition>

      <form class="login-form" @submit.prevent="handleReset">
        <label for="new-password" class="field-label">Nueva contraseña</label>
        <input
          id="new-password"
          v-model.trim="password"
          type="password"
          placeholder="Mínimo 6 caracteres"
          class="field-input"
          autocomplete="new-password"
          :disabled="isLoading"
        />

        <button class="btn-submit" :disabled="isLoading">
          <span v-if="!isLoading">Actualizar contraseña →</span>
          <span v-else class="spinner"></span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'vue-router'

const router = useRouter()
const password = ref('')
const errorMsg = ref('')
const isLoading = ref(false)

onMounted(async () => {
  const { data, error } = await supabase.auth.getSession()

  if (error || !data.session) {
    errorMsg.value = 'El enlace de recuperación es inválido o expiró.'
    setTimeout(() => router.replace('/login'), 1800)
  }
})

async function handleReset() {
  errorMsg.value = ''

  if (!password.value || password.value.length < 6) {
    errorMsg.value = 'La contraseña debe tener al menos 6 caracteres.'
    return
  }

  isLoading.value = true

  try {
    const { error } = await supabase.auth.updateUser({
      password: password.value,
    })

    if (error) {
      errorMsg.value = error.message
      return
    }

    await supabase.auth.signOut()
    await router.replace('/login')
  } catch {
    errorMsg.value = 'Error al actualizar contraseña.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: calc(100vh - 120px);
  display: grid;
  place-items: center;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
}

.bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  mask-image: radial-gradient(circle at center, black 25%, transparent 90%);
  pointer-events: none;
}

.bg-glow {
  position: absolute;
  width: 360px;
  height: 360px;
  border-radius: 9999px;
  background: radial-gradient(circle, rgba(200, 169, 110, 0.22) 0%, rgba(200, 169, 110, 0) 70%);
  filter: blur(6px);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.login-card {
  position: relative;
  z-index: 1;
  width: min(460px, 100%);
  background: rgba(20, 20, 23, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 1.6rem;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.35);
}

.card-header {
  margin-bottom: 1rem;
  text-align: center;
}

.card-icon {
  display: inline-block;
  margin-bottom: 0.35rem;
  font-size: 1.35rem;
}

.card-title {
  color: #f5f2ea;
  margin-bottom: 0.35rem;
}

.card-subtitle {
  color: #b8b0a4;
  font-size: 0.92rem;
}

.login-form {
  display: grid;
  gap: 0.8rem;
}

.field-label {
  color: #c9c1b6;
  font-size: 0.86rem;
  font-weight: 600;
}

.field-input {
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.05);
  color: #f5f2ea;
  border-radius: 10px;
  padding: 0.72rem 0.82rem;
  font-size: 0.95rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.field-input::placeholder {
  color: #8f877d;
}

.field-input:focus {
  outline: none;
  border-color: rgba(200, 169, 110, 0.85);
  box-shadow: 0 0 0 3px rgba(200, 169, 110, 0.18);
}

.btn-submit {
  margin-top: 0.4rem;
  width: 100%;
  border: none;
  border-radius: 10px;
  padding: 0.78rem 1rem;
  font-size: 0.95rem;
  font-weight: 700;
  color: #161616;
  background: linear-gradient(135deg, #d8bc87, #b89459);
  cursor: pointer;
  transition: transform 0.18s ease, filter 0.2s ease;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-1px);
  filter: brightness(1.03);
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(0, 0, 0, 0.18);
  border-top-color: rgba(0, 0, 0, 0.75);
  border-radius: 9999px;
  animation: spin 0.75s linear infinite;
}

.alert-error {
  margin-bottom: 0.8rem;
  padding: 0.7rem 0.8rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 110, 110, 0.45);
  background: rgba(255, 110, 110, 0.12);
  color: #ffc1c1;
  display: flex;
  gap: 0.45rem;
  align-items: center;
}

.alert-enter-active,
.alert-leave-active {
  transition: all 0.2s ease;
}

.alert-enter-from,
.alert-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
