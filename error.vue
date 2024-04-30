<template>
	<NuxtLayout name="default">
		<div class="error-container">
			<h1>404</h1>
			<h2>Lehte ei leitud</h2>
			<p>Vabandame, kuid otsitud lehekülge ei eksisteeri.</p>
		</div>
	</NuxtLayout>
</template>

<script setup lang="ts">
onUnmounted(() => clearError());
</script>

<style lang="scss" scoped>
.error-container {
	display: flex;
	flex-direction: column;
	gap: $whitespace-sm;
	margin: $whitespace-xxl;
	text-align: center;

	h1 {
		@include heading-2;
		color: $color-text;
	}

	h2 {
		@include heading-3;
		color: $color-text;
	}

	p {
		margin-top: $whitespace-md;
	}
}
</style>
