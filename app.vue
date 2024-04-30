<template>
	<div>
		<NuxtPage />
	</div>
</template>

<script setup lang="ts">
useHead({
	title: 'Ravimite koostoime',
	meta: [
		{
			name: 'description',
			content:
				'Eestikeelne ravimite koostoime kontrollimise veebirakendus. Valminud 2024 praktilise raames lõputöö, autor Vidrik Toom Tabas.',
		},
	],
});
</script>

<style lang="scss">
@font-face {
	font-family: 'Inter';
	src:
		url('assets/fonts/source-sans-3-regular/font.woff2') format('woff2'),
		url('assets/fonts/source-sans-3-regular/font.woff') format('woff');
	font-display: swap;
}

@font-face {
	font-family: 'Lato';
	src:
		url('assets/fonts/montserrat-semibold/font.woff2') format('woff2'),
		url('assets/fonts/montserrat-semibold/font.woff') format('woff');
	font-display: swap;
}

html {
	position: relative;
	font-family:
		'Inter',
		-apple-system,
		BlinkMacSystemFont,
		Arial,
		sans-serif;
	font-size: 16px;
	line-height: 1.5;
	color: $color-text;
	-ms-text-size-adjust: 100%;
	-webkit-text-size-adjust: 100%;
	-moz-osx-font-smoothing: grayscale;
	-webkit-font-smoothing: antialiased;
	box-sizing: border-box;
	scroll-behavior: smooth;
}

*,
*::before,
*::after {
	box-sizing: border-box;
	margin: 0;
}

*:focus,
*:focus-visible {
	outline: $color-primary;
}

::selection {
	color: $color-primary-2;
	background: $color-secondary-3;
}

::-moz-selection {
	color: $color-primary-2;
	background: $color-secondary-3;
}
</style>
