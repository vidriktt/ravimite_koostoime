<template>
	<div class="header">
		<div class="header__logo">
			<NuxtLink v-if="!withoutLogo" to="/">
				<h2>Ravimite koostoime<br />kontrollimine</h2>
			</NuxtLink>
		</div>
		<CommonMenu />
	</div>
</template>

<script setup lang="ts">
interface Props {
	withoutLogo?: boolean;
}

withDefaults(defineProps<Props>(), { withoutLogo: false });
</script>

<style scoped lang="scss">
.header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	padding: $whitespace-md $whitespace-xl;

	&__logo {
		min-height: 72px;

		a {
			text-decoration: none;
			transition: all $transition;

			&:hover {
				filter: brightness(1.15);
			}
		}

		h2 {
			@include heading-3;
			text-align: center;
			font-size: 1.5rem;
			line-height: 1.5;
		}
	}
}
</style>
