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
				<h4 v-if="Object.keys(route.query).length > 0">
					{{
						interactionsList && interactionsList.length > 0
							? 'Leitud koostoimed:'
							: 'Koostoimed puuduvad'
					}}
				</h4>
				<div v-if="interactionsList && interactionsList.length > 0">
					<Interaction
						v-for="(interaction, index) in interactionsList"
						:key="index"
						:interaction="interaction"
					/>
				</div>
			</div>
		</div>
	</NuxtLayout>
</template>

<script setup lang="ts">
import type { interactions } from '@prisma/client';

const route = useRoute();
const interactionsList = ref<interactions[]>([]);

onMounted(async () => {
	if (Object.keys(route.query).length > 0) {
		await fetchInteractions();
	}
});

const onSubmit = () => {
	fetchInteractions();
};

const fetchInteractions = async () => {
	try {
		const response = await useFetch('/api/interactions', {
			query: { drugs: Object.values(route.query) },
		});

		if (response.data?.value) {
			interactionsList.value = response.data.value;
			await fetchTranslations();
		}
	} catch (error) {
		console.error(error); // eslint-disable-line no-console
	}
};

const fetchTranslations = async () => {
	try {
		const textsToTranslate: {
			text: string;
			field: string;
			index: number;
		}[] = [];

		interactionsList.value.forEach((interaction, interactionIndex) => {
			if (interaction.situation_criterion) {
				textsToTranslate.push({
					text: interaction.situation_criterion,
					field: 'situation_criterion',
					index: interactionIndex,
				});
			}
			if (interaction.clinical_consequence) {
				textsToTranslate.push({
					text: interaction.clinical_consequence,
					field: 'clinical_consequence',
					index: interactionIndex,
				});
			}
			if (interaction.instructions) {
				textsToTranslate.push({
					text: interaction.instructions,
					field: 'instructions',
					index: interactionIndex,
				});
			}
		});

		const translationResponses = await Promise.all(
			textsToTranslate.map(({ text, field }) =>
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
				const { index } = textsToTranslate.find(
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
</script>

<style scoped lang="scss">
.results {
	margin: $whitespace-xl;

	&__container {
		display: flex;
		flex-direction: column;
		width: 55vw;
		margin: $whitespace-xxxl auto;

		h4 {
			@include heading-4;
			color: $color-text;
			font-size: 28px;
			text-transform: uppercase;
		}
	}
}
</style>
