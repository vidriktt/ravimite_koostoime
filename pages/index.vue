<template>
	<NuxtLayout name="default" :without-logo="true" :without-disclaimer="true">
		<div class="index">
			<div class="index__header">
				<h1>Ravimite koostoime kontrollimine</h1>
			</div>
			<div class="index__disclaimer">
				<Disclaimer />
			</div>
			<SearchForm />
		</div>
	</NuxtLayout>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.index {
	margin-top: $whitespace-xxl;

	&__header {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;

		h1 {
			@include heading;
			max-width: $screen-xl;
		}
	}

	&__disclaimer {
		display: flex;
		justify-content: center;
		margin-top: $whitespace-xl;
	}

	form {
		display: flex;
		justify-content: center;
		margin-top: $whitespace-xxl;
	}
}
</style>
