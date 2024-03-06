<template>
	<div>
		<NuxtLayout name="default">
			<NuxtPage />
		</NuxtLayout>
	</div>
</template>

<script setup lang="ts"></script>

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
	font-family:
		'Inter',
		-apple-system,
		BlinkMacSystemFont,
		Arial,
		sans-serif;
	font-size: 16px;
	line-height: 1.5;
	color: $text-color;
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
	outline-color: $primary-color;
}

::selection {
	color: $primary-color-2;
	background-color: $secondary-color-3;
}

::-moz-selection {
	color: $primary-color-2;
	background-color: $secondary-color-3;
}
</style>
