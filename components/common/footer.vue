<template>
	<div class="footer">
		<Disclaimer v-if="!withoutDisclaimer" :fixed="true" />
		<p>Valminud 2024 Vidrik Toom Tabase bakalaureusetöö raames</p>
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
	bottom: $whitespace-sm;
	width: 100%;
	text-align: center;

	@media (min-width: $screen-md) {
		bottom: $whitespace-lg;
	}

	p {
		@include smaller-text;
	}
}
</style>
