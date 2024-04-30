<template>
	<div class="loader"></div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.loader {
	width: 50px;
	height: 40px;
	color: $color-secondary;
	display: grid;
	border-radius: 50%;

	&:before,
	&:after {
		content: '';
		background:
			linear-gradient(90deg, currentColor calc(100% - 10px), #0000 0) 0
				50%/100% 4px,
			conic-gradient(
					from -136deg at 8px 50%,
					#0000,
					currentColor 1deg 90deg,
					#0000 91deg
				)
				35px 0/100% 100%;
		background-repeat: repeat-x;
		animation: l6 1s infinite;
	}

	&:after {
		transform: scaleX(-1);
	}

	@keyframes l6 {
		80%,
		100% {
			background-position:
				50px 50%,
				85px 0;
		}
	}
}
</style>
