<template>
	<div class="header">
		<div class="header__logo">
			<NuxtLink v-if="!withoutLogo" to="/">
				<h2>Ravimite koostoime<br />kontrollimine</h2>
			</NuxtLink>
		</div>
		<CommonMenu v-if="!isMobile" />
		<CommonMobileMenu v-if="isMobile" />
	</div>
</template>

<script setup lang="ts">
interface Props {
	withoutLogo?: boolean;
}

withDefaults(defineProps<Props>(), { withoutLogo: false });

const isMobile = ref(false);

onMounted(() => {
	const mediaQuery = window.matchMedia('(max-width: 768px)');
	isMobile.value = mediaQuery.matches;

	const resizeHandler = () => {
		isMobile.value = mediaQuery.matches;
	};
	mediaQuery.addEventListener('change', resizeHandler);

	onUnmounted(() => {
		mediaQuery.removeEventListener('change', resizeHandler);
	});
});
</script>

<style scoped lang="scss">
.header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	padding: $whitespace-md;

	@media (min-width: $screen-md) {
		padding: $whitespace-md $whitespace-xl;
		align-items: center;
	}

	&__logo {
		a {
			text-decoration: none;
			transition: all $transition;

			&:hover {
				filter: brightness(1.15);
			}
		}

		h2 {
			@include heading-3;
			font-size: 1rem;
			line-height: 1;

			@media (min-width: $screen-md) {
				text-align: center;
				font-size: 1.5rem;
				line-height: 1.2;
			}
		}
	}
}
</style>
