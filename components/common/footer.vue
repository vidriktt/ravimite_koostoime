<template>
	<div class="footer">
		<Disclaimer v-if="!withoutDisclaimer" />
		<p>Valminud 2024 praktilise lõputöö raames</p>
	</div>
</template>

<script setup lang="ts">
interface Props {
	withoutDisclaimer?: boolean;
}

withDefaults(defineProps<Props>(), { withoutDisclaimer: false });
</script>

<style lang="scss" scoped>
.footer {
	position: fixed;
	bottom: $whitespace-xl;
	display: flex;
	flex-direction: column;
	text-align: center;
	width: 100%;
	gap: $whitespace-md;

	p {
		@include smaller-text;
	}
}
</style>
