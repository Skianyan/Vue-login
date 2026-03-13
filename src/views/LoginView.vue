<!-- src/views/LoginView.vue -->
<template>
  <div class="login-page">
    <!-- Fondo decorativo -->
    <div class="bg-grid" aria-hidden="true"></div>
    <div class="bg-glow" aria-hidden="true"></div>

    <div class="login-card">
      <!-- Encabezado -->
      <div class="card-header">
        <span class="card-icon">⬡</span>
        <h1 class="card-title">Bienvenido</h1>
        <p class="card-subtitle">Ingresa tus credenciales para continuar</p>
      </div>

      <!-- Alerta de error -->
      <Transition name="alert">
        <div v-if="errorMsg" class="alert-error" role="alert">
          <span>⚠</span> {{ errorMsg }}
        </div>
      </Transition>

      <!-- Formulario -->
      <form class="login-form" @submit.prevent="handleLogin" novalidate>

        <!-- Campo email -->
        <div class="field" :class="{ 'field--error': errors.email }">
          <label for="email" class="field-label">Correo electrónico</label>
          <div class="field-input-wrap">
            <span class="field-icon">✉</span>
            <input
              id="email"
              v-model.trim="form.email"
              type="email"
              class="field-input"
              placeholder="usuario@ejemplo.com"
              autocomplete="email"
              @blur="validateEmail"
            />
          </div>
          <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
        </div>

        <!-- Campo contraseña -->
        <div class="field" :class="{ 'field--error': errors.password }">
          <label for="password" class="field-label">Contraseña</label>
          <div class="field-input-wrap">
            <span class="field-icon">🔑</span>
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              class="field-input"
              placeholder="••••••••"
              autocomplete="current-password"
              @blur="validatePassword"
            />
            <button
              type="button"
              class="field-toggle"
              @click="showPassword = !showPassword"
              :aria-label="showPassword ? 'Ocultar contraseña' : 'Ver contraseña'"
            >
              {{ showPassword ? '🙈' : '👁' }}
            </button>
          </div>
          <span v-if="errors.password" class="field-error">{{ errors.password }}</span>
        </div>

        <!-- Credenciales de prueba -->
        <div class="hint-box">
          <span class="hint-label">Credenciales de prueba:</span>
          <code>admin@vue.com</code> / <code>vue1234</code>
        </div>

        <!-- Botón submit -->
        <button
          type="submit"
          class="btn-submit"
          :disabled="isLoading"
          :class="{ 'btn-submit--loading': isLoading }"
        >
          <span v-if="!isLoading">Iniciar sesión →</span>
          <span v-else class="spinner"></span>
        </button>
          <span class="hint-box">
          ¿No tienes cuenta?
          <RouterLink to="/signup"><code>Crear cuenta</code></RouterLink>
          </span>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { supabase } from '@/lib/supabase'

const router = useRouter()
const { login } = useAuth()

// ── Estado del formulario ──
const form = reactive({
  email: '',
  password: '',
})

const errors = reactive({
  email: '',
  password: '',
})

const showPassword = ref(false)
const isLoading = ref(false)
const errorMsg = ref('')

// ── Validaciones individuales ──
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

function isFormValid() {
  validateEmail()
  validatePassword()
  return !errors.email && !errors.password
}



// ── Login simulado ──
async function handleLogin() {
  errorMsg.value = ''

  if (!isFormValid()) return

  isLoading.value = true

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password
    })

    if (error) {
      errorMsg.value = error.message
      return
    }

    // login success
    login(data.user, data.session.access_token)

    await router.push('/dashboard')

  } catch (err) {
    errorMsg.value = 'Error inesperado al iniciar sesión.'
  } finally {
    isLoading.value = false
  }
}
</script>
