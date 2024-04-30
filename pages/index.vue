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
				to="/results?field1=flukonasool&field2=krisotiniib"
			>
				Näidispäring
			</router-link>
		</div>
	</NuxtLayout>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.index {
	margin-top: $whitespace-lg;
	padding: 0 $whitespace-sm;

	@media (min-width: $screen-md) {
		margin-top: $whitespace-xxl;
	}

	&__header {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;

		h1 {
			@include heading-2;
			max-width: $screen-xl;
			font-size: 36px;
			line-height: 36px;

			@media (min-width: $screen-md) {
				@include heading;
			}
		}
	}

	&__disclaimer {
		display: flex;
		justify-content: center;
		margin-top: $whitespace-xxs;

		@media (min-width: $screen-md) {
			margin-top: $whitespace-xl;
		}
	}

	form {
		display: flex;
		justify-content: center;
		margin-top: $whitespace-xl;

		@media (min-width: $screen-md) {
			margin-top: $whitespace-xxl;
		}
	}

	&__example-btn {
		@include button-primary;
		display: flex;
		justify-content: center;
		width: fit-content;
		margin: $whitespace-xl auto 0;

		@media (min-width: $screen-md) {
			margin-top: $whitespace-xxxl;
		}
	}
}
</style>
