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
			<router-link
				class="index__example-btn"
				to="/results?field1=ruksolitiniib&field2=botsepreviir"
			>
				Näidispäring
			</router-link>
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

	&__example-btn {
		@include button-primary;
		display: flex;
		justify-content: center;
		width: fit-content;
		margin: $whitespace-xxxl auto 0;
	}
}
</style>
