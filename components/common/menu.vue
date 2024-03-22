<template>
	<div class="menu">
		<NuxtLink to="/">Avaleht</NuxtLink>
		<NuxtLink to="/info">Abi</NuxtLink>
		<NuxtLink to="/results">Otsing</NuxtLink>
	</div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.menu {
	display: flex;
	align-items: center;
	padding-top: $whitespace-xxs;
	gap: $whitespace-lg;

	a {
		box-sizing: border-box;
		color: $color-text-2;
		font-family: $font-inter;
		font-weight: 500;
		text-decoration: none;
		user-select: none;

		&:not(:last-child) {
			position: relative;
			padding: 3px $whitespace-xs;
			transition: outline $transition;

			&:focus-visible {
				border-radius: $border-radius;
				outline: 0.15rem solid $color-primary;
			}

			&:after {
				content: '';
				display: block;
				position: absolute;
				bottom: 0;
				left: 50%;
				width: 0;
				border-bottom: 3px solid $color-secondary-3;
				transform: translateX(-50%);
				transition: all $transition;
			}

			&:hover:after,
			&:active:after,
			&[aria-current]:after {
				width: 100%;
			}

			&[aria-current] {
				pointer-events: none;
			}
		}

		&:last-child {
			@include button-primary;
			text-transform: uppercase;
			margin-left: $whitespace-xs;
		}
	}
}
</style>
