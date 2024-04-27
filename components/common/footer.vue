<template>
	<div class="footer">
		<Disclaimer v-if="!withoutDisclaimer" :fixed="true" />
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
	position: absolute;
	bottom: $whitespace-lg;
	text-align: center;
	width: 100%;

	p {
		@include smaller-text;
	}
}
</style>
