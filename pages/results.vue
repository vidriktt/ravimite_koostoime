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
			<div v-if="fetching" class="results__loading">
				<CommonLoader />
				<p>Otsing võib võtta hetke aega.</p>
			</div>
			<div v-else class="results__container">
				<h1 v-if="Object.keys(route.query).length > 0">
					{{
						interactionsList && interactionsList.length > 0
							? 'Leitud koostoimed:'
							: 'Koostoimed puuduvad'
					}}
				</h1>
				<div v-if="interactionsList && interactionsList.length > 0">
					<Interaction
						v-for="(interaction, index) in interactionsList"
						:key="index"
						:interaction="interaction"
						:ravimiregister-pdf-fetching="ravimiregisterPdfFetching"
					/>
				</div>
			</div>
		</div>
	</NuxtLayout>
</template>

<script setup lang="ts">
import type { interactions } from '@prisma/client';

const route = useRoute();
const fetching = ref<boolean>();
const ravimiregisterPdfFetching = ref<boolean>(false);
const interactionsList = ref<
	(interactions & { ravimiregister?: { text: string; url: string } })[]
>([]);

onMounted(async () => {
	if (Object.keys(route.query).length > 0) {
		await onSubmit();
	}
});

onUpdated(() => {
	if (Object.keys(route.query).length === 0) {
		fetching.value = false;
		interactionsList.value = [];
	}
});

const onSubmit = async () => {
	fetching.value = true;
	await fetchInteractions();
};

const fetchInteractions = async () => {
	const { error, data } = await useFetch('/api/interactions', {
		query: { drugs: Object.values(route.query) },
	});

	if (error?.value) {
		console.error(error.value); // eslint-disable-line no-console
	}

	if (!data?.value) {
		console.warn('Interactions not found.'); // eslint-disable-line no-console
		fetching.value = false;
		return;
	}

	interactionsList.value = data.value;
	await fetchTranslations();

	fetching.value = false;
	ravimiregisterPdfFetching.value = true;

	await fetchRavimiregisterData();

	ravimiregisterPdfFetching.value = false;
};

const fetchTranslations = async () => {
	try {
		const translationTexts: {
			text: string;
			field: string;
			index: number;
		}[] = [];

		interactionsList.value.forEach((interaction, interactionIndex) => {
			if (interaction.situation_criterion) {
				translationTexts.push({
					text: interaction.situation_criterion,
					field: 'situation_criterion',
					index: interactionIndex,
				});
			}
			if (interaction.clinical_consequence) {
				translationTexts.push({
					text: interaction.clinical_consequence,
					field: 'clinical_consequence',
					index: interactionIndex,
				});
			}
			if (interaction.instructions) {
				translationTexts.push({
					text: interaction.instructions,
					field: 'instructions',
					index: interactionIndex,
				});
			}
		});

		const translationResponses = await Promise.all(
			translationTexts.map(({ text, field }) =>
				useFetch('/api/translate', {
					query: {
						text,
						source: 'no',
						target: 'et',
					},
				}).then((response) => ({ response, field })),
			),
		);

		translationResponses.forEach(({ response, field }) => {
			const translatedText = response.data?.value;

			if (translatedText !== undefined) {
				const { index } = translationTexts.find(
					({ field: f }) => f === field,
				) || { index: -1 };
				if (index !== -1) {
					(interactionsList.value[index] as any)[field] =
						translatedText;
				}
			}
		});
	} catch (error) {
		console.error(error); // eslint-disable-line no-console
	}
};

const fetchRavimiregisterData = async () => {
	for (const interaction of interactionsList.value) {
		const { error, data } = await useFetch('/api/ravimiregister-pdf', {
			query: {
				// @ts-ignore
				atcCodes: interaction.drugs.map((drug) => drug.atc),
				// @ts-ignore
				drugNames: interaction.drugs.map((drug) => drug.toimeaine),
			},
		});

		if (error?.value) {
			console.error(error.value); // eslint-disable-line no-console
		}

		if (data?.value) {
			interaction.ravimiregister = data.value;
		} else {
			console.warn('No Ravimiregister match found.'); // eslint-disable-line no-console
		}
	}
};

if (process.client) {
	if (Object.keys(route.query).length > 0) {
		onSubmit();
	}
}
</script>

<style scoped lang="scss">
.results {
	margin: $whitespace-lg $whitespace-sm 200px;

	@media (min-width: $screen-md) {
		margin: $whitespace-xl $whitespace-xl 220px;
	}

	&__container {
		display: flex;
		flex-direction: column;
		width: 100%;
		margin: $whitespace-xxxl auto;

		@media (min-width: $screen-md) {
			width: 55vw;
		}

		h1 {
			@include heading-4;
			color: $color-text;
			text-transform: uppercase;

			@media (min-width: $screen-md) {
				font-size: 28px;
			}
		}
	}

	&__loading {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin: $whitespace-xxxl;

		div {
			margin: 0 auto;
		}

		p {
			margin-top: $whitespace-md;
			text-align: center;
		}
	}
}
</style>
