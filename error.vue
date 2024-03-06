<template>
	<NuxtLayout name="default">404</NuxtLayout>
</template>

<script setup lang="ts">
onUnmounted(() => clearError());
</script>

<style lang="scss" scoped>
.error-layout {
	display: flex;
	flex-direction: column;
	flex-grow: 1;
}
</style>
