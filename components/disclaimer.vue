<template>
	<div class="disclaimer">
		<p v-if="!text">
			See <b>leht on teoreetiline</b> ning ükski saadud tulemus
			<b>ei ole lõplik meditsiiniline vastus</b>.<br />Päris küsimuste ja
			probleemide korral pöörduge meditsiinilise kõrgharidusega
			spetsialisti juurde!
		</p>
		<p v-if="text" v-html="text"></p>
	</div>
</template>

<script setup lang="ts">
interface Props {
	text?: string;
}

withDefaults(defineProps<Props>(), { text: undefined });
</script>

<style lang="scss" scoped>
.disclaimer {
	align-self: center;
	width: fit-content;
	margin-top: $whitespace-xxxl;
	padding: $whitespace-xs $whitespace-md;
	background-color: $color-error;
	color: $color-text-light;
	border-radius: $border-radius;
	text-align: center;
}
</style>
