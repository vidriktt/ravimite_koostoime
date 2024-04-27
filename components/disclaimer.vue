<template>
	<div class="disclaimer" :class="{ fixed }">
		<p v-if="!text">
			<IconsWarning />
			See <b>leht on teoreetiline</b> ning ükski saadud tulemus
			<b>ei ole lõplik meditsiiniline vastus</b>.<br />Oluliste küsimuste
			ja probleemide korral pöörduge meditsiinilise kõrgharidusega
			spetsialisti juurde!
		</p>
		<p v-if="text" v-html="text"></p>
	</div>
</template>

<script setup lang="ts">
interface Props {
	text?: string;
	fixed?: boolean;
}

withDefaults(defineProps<Props>(), { text: undefined, fixed: false });
</script>

<style lang="scss" scoped>
.disclaimer {
	display: flex;
	align-self: center;
	width: fit-content;
	margin-top: $whitespace-xxxl;
	padding: $whitespace-xs $whitespace-md;
	background-color: $color-error;
	color: $color-text-light;
	border-radius: $border-radius;
	text-align: center;

	svg {
		vertical-align: text-top;
		margin-right: $whitespace-step;
	}
}

.fixed {
	position: fixed;
	bottom: $whitespace-xxxl;
	left: 50%;
	transform: translateX(-50%);
	margin-top: 0;
	width: max-content;
}
</style>
