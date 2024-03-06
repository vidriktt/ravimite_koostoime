<template>
	<div class="disclaimer">
		<p v-html="text"></p>
	</div>
</template>

<script setup lang="ts">
interface Props {
	text?: string;
}

defineProps<Props>();
</script>

<style lang="scss" scoped>
.disclaimer {
	width: fit-content;
	margin-top: $whitespace-xxxl;
	padding: $whitespace-xs $whitespace-md;
	background-color: $error-color;
	color: $text-color-light;
	border-radius: $border-radius;
	text-align: center;
}
</style>
