<template>
	<div class="mobile-menu">
		<button class="mobile-menu__btn" @click="openMenu">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
			>
				<path
					fill="currentColor"
					d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"
				></path>
			</svg>
		</button>
		<nav ref="nav" class="mobile-menu__nav">
			<NuxtLink to="/">Avaleht</NuxtLink>
			<NuxtLink to="/info">Abi</NuxtLink>
			<NuxtLink to="/results">Otsing</NuxtLink>
		</nav>
	</div>
</template>

<script setup lang="ts">
const nav = ref();
const menuOpen = ref(false);

const openMenu = () => {
	menuOpen.value = !menuOpen.value;

	if (menuOpen.value) {
		setTimeout(() => {
			if (nav.value) {
				nav.value.style.display = 'flex';
				setTimeout(() => {
					nav.value.classList.add('mobile-menu__nav--open');
				}, 100);
			}
		}, 10);
	} else if (nav.value) {
		nav.value.classList.remove('mobile-menu__nav--open');
		setTimeout(() => {
			nav.value.style.display = 'none';
		}, 300);
	}
};
</script>

<style scoped lang="scss">
.mobile-menu {
	position: relative;
	width: 100%;
	z-index: 100;

	&__btn {
		all: unset;
		position: absolute;
		top: $whitespace-xxs;
		right: $whitespace-xxs;
	}

	&__nav {
		position: fixed;
		display: none;
		visibility: hidden;
		opacity: 0;
		scale: 0.9;
		left: calc(2 * $whitespace-md);
		flex-direction: column;
		align-items: center;
		gap: $whitespace-md;
		height: fit-content;
		width: calc(100% - 4 * $whitespace-md);
		margin-top: 0;
		padding: $whitespace-md;
		background: #fff;
		box-shadow: 0 4px 64px rgba(0, 0, 0, 0.25);
		border-radius: $border-radius;
		transition: all $transition;

		&--open {
			visibility: visible;
			opacity: 1;
			scale: 1;
			margin-top: $whitespace-xxl;
		}

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
			}
		}
	}
}
</style>
