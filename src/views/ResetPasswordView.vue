<template>
	<div class="login-page">
		<div class="login-card">
			<h1 class="card-title">Nueva contraseña</h1>

			<Transition name="alert">
				<div v-if="errorMsg" class="alert-error" role="alert">
					<span>⚠</span> {{ errorMsg }}
				</div>
			</Transition>

			<form @submit.prevent="handleReset">
				<input
					v-model.trim="password"
					type="password"
					placeholder="Nueva contraseña"
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
import { ref, onMounted } from "vue";
import { supabase } from "@/lib/supabase";
import { useRouter } from "vue-router";

const router = useRouter();
const password = ref("");
const errorMsg = ref("");
const isLoading = ref(false);

onMounted(async () => {
	const { data, error } = await supabase.auth.getSession();

	if (error || !data.session) {
		errorMsg.value = "El enlace de recuperación es inválido o expiró.";
		setTimeout(() => router.replace("/login"), 1800);
	}
});

async function handleReset() {
	errorMsg.value = "";

	if (!password.value || password.value.length < 6) {
		errorMsg.value = "La contraseña debe tener al menos 6 caracteres.";
		return;
	}

	isLoading.value = true;

	try {
		const { error } = await supabase.auth.updateUser({
			password: password.value,
		});

		if (error) {
			errorMsg.value = error.message;
			return;
		}

		await supabase.auth.signOut();
		await router.replace("/login");
	} catch {
		errorMsg.value = "Error al actualizar contraseña.";
	} finally {
		isLoading.value = false;
	}
}
</script>
