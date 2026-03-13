<template>
  <div class="login-page">
    <div class="bg-grid" aria-hidden="true"></div>
    <div class="bg-glow" aria-hidden="true"></div>

    <div class="login-card">

      <div class="card-header">
        <span class="card-icon">⬡</span>
        <h1 class="card-title">Crear cuenta</h1>
        <p class="card-subtitle">Regístrate para comenzar</p>
      </div>

      <Transition name="alert">
        <div v-if="errorMsg" class="alert-error" role="alert">
          <span>⚠</span> {{ errorMsg }}
        </div>
      </Transition>

      <form class="login-form" @submit.prevent="handleSignup" novalidate>

        <!-- Email -->
        <div class="field" :class="{ 'field--error': errors.email }">
          <label class="field-label">Correo electrónico</label>
          <div class="field-input-wrap">
            <span class="field-icon">✉</span>
            <input
              v-model.trim="form.email"
              type="email"
              class="field-input"
              placeholder="usuario@ejemplo.com"
              @blur="validateEmail"
            />
          </div>
          <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
        </div>

        <!-- Password -->
        <div class="field" :class="{ 'field--error': errors.password }">
          <label class="field-label">Contraseña</label>
          <div class="field-input-wrap">
            <span class="field-icon">🔑</span>
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              class="field-input"
              placeholder="••••••••"
              @blur="validatePassword"
            />
            <button
              type="button"
              class="field-toggle"
              @click="showPassword = !showPassword"
            >
              {{ showPassword ? '🙈' : '👁' }}
            </button>
          </div>
          <span v-if="errors.password" class="field-error">{{ errors.password }}</span>
        </div>

        <!-- Confirm Password -->
        <div class="field" :class="{ 'field--error': errors.confirm }">
          <label class="field-label">Confirmar contraseña</label>
          <div class="field-input-wrap">
            <span class="field-icon">🔒</span>
            <input
              v-model="form.confirm"
              :type="showPassword ? 'text' : 'password'"
              class="field-input"
              placeholder="••••••••"
              @blur="validateConfirm"
            />
          </div>
          <span v-if="errors.confirm" class="field-error">{{ errors.confirm }}</span>
        </div>

        <!-- Submit -->
        <button
          type="submit"
          class="btn-submit"
          :disabled="isLoading"
          :class="{ 'btn-submit--loading': isLoading }"
        >
          <span v-if="!isLoading">Crear cuenta →</span>
          <span v-else class="spinner"></span>
        </button>

        <!-- Link -->
        <div class="hint-box">
          ¿Ya tienes cuenta?
          <RouterLink to="/login"><code>Iniciar sesión</code></RouterLink>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'

const router = useRouter()

const form = reactive({
  email: '',
  password: '',
  confirm: ''
})

const errors = reactive({
  email: '',
  password: '',
  confirm: ''
})

const showPassword = ref(false)
const isLoading = ref(false)
const errorMsg = ref('')

function validateEmail() {
  if (!form.email) {
    errors.email = 'El correo es obligatorio.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Ingresa un correo válido.'
  } else {
    errors.email = ''
  }
}

function validatePassword() {
  if (!form.password) {
    errors.password = 'La contraseña es obligatoria.'
  } else if (form.password.length < 6) {
    errors.password = 'Mínimo 6 caracteres.'
  } else {
    errors.password = ''
  }
}

function validateConfirm() {
  if (form.confirm !== form.password) {
    errors.confirm = 'Las contraseñas no coinciden.'
  } else {
    errors.confirm = ''
  }
}

function isFormValid() {
  validateEmail()
  validatePassword()
  validateConfirm()

  return !errors.email && !errors.password && !errors.confirm
}

async function handleSignup() {
  errorMsg.value = ''

  if (!isFormValid()) return

  isLoading.value = true

  try {
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password
    })

    if (error) {
      errorMsg.value = error.message
      return
    }

    await router.push('/login')

  } catch (err) {
    errorMsg.value = 'Error al crear la cuenta.'
  } finally {
    isLoading.value = false
  }
}
</script>