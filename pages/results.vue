<template>
	<NuxtLayout name="default">
		<div class="results">
			<SearchForm
				:query="
					Object.keys(route.query).length > 0
						? route.query
						: undefined
				"
				@on-submit="onSubmit"
			/>
			<div class="results__container">
				<h4>Leitud koostoimed:</h4>
				<div class="results__container--results">
					<h5>Toimeaine 1 + Toimeaine 2</h5>
				</div>
			</div>

			<div class="results__button">
				<button v-if="!interactions" @click="fetchInteractions">
					Display Interaction
				</button>
				<div v-if="interactions">
					<p>
						<strong>Severity:</strong> {{ interactions.severity }}
					</p>
					<p v-if="interactions.situation_criterion">
						<strong>Situation Criterion:</strong>
						{{ interactions.situation_criterion }}
					</p>
					<p>
						<strong>Clinical Consequence:</strong>
						{{ interactions.clinical_consequence }}
					</p>
					<p v-if="interactions.instructions">
						<strong>Instructions:</strong>
						{{ interactions.instructions }}
					</p>
				</div>
			</div>
		</div>
	</NuxtLayout>
</template>

<script setup lang="ts">
const route = useRoute();

const interactions = ref();

onMounted(() => {
	if (Object.keys(route.query).length > 0) {
		fetchInteractions();
	}
});

const fetchInteractions = async () => {
	try {
		const response = await useFetch('/api/interactions', {
			query: { drugs: Object.values(route.query) },
		});

		if (response.data?.value) {
			interactions.value = response.data.value[0];
		}
	} catch (error) {
		console.error(error);
	}
};

const onSubmit = () => {
	fetchInteractions();
};
</script>

<style scoped lang="scss">
.results {
	margin: $whitespace-xl;

	&__button {
		display: flex;
		justify-content: center;
		margin-top: $whitespace-xl;

		div {
			max-width: 50vw;
		}

		p {
			margin-bottom: 10px;
		}
	}

	&__container {
		display: flex;
		flex-direction: column;
		width: 60vw;
		margin: $whitespace-xxxl auto;

		h4 {
			@include heading-4;
			color: $color-text;
			font-size: 28px;
			text-transform: uppercase;
		}

		&--results {
			display: flex;
			flex-direction: column;
			margin-top: $whitespace-xl;

			h5 {
				@include heading-4;
				color: $color-text;
				font-size: 20px;
			}
		}
	}
}
</style>
