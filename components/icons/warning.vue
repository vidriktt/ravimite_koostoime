<template>
	<svg
		width="21"
		height="21"
		viewBox="0 0 24 24"
		:fill="fill"
		xmlns="http://www.w3.org/2000/svg"
	>
		<g :fill="fill">
			<path
				d="m12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm-10 8c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10-10-4.477-10-10z"
			/>
			<path
				d="m12 14a1 1 0 0 1 -1-1v-6a1 1 0 1 1 2 0v6a1 1 0 0 1 -1 1zm-1.5 2.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1 -3 0z"
			/>
		</g>
	</svg>
</template>

<script setup lang="ts">
interface Props {
	fill?: string;
}

withDefaults(defineProps<Props>(), { fill: '#fff' });
</script>
