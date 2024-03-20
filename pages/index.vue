<template>
	<div class="index">
		<div class="index__header">
			<h1>Ravimite koostoime kontrollimine</h1>
		</div>
		<div class="index__disclaimer">
			<Disclaimer
				text="See <b>leht on teoreetiline</b> ning ükski saadud tulemus <b>ei ole lõplik meditsiiniline vastus</b>.<br/>Päris küsimuste ja probleemide korral pöörduge meditsiinilise kõrgharidusega spetsialisti juurde!"
			/>
		</div>
		<div class="index__button">
			<button v-if="!interaction" @click="fetchFirstInteraction">Display Interaction</button>
			<div v-if="interaction">
				<p><strong>Severity:</strong> {{ interaction.severity }}</p>
				<p v-if="interaction.situation_criterion">
					<strong>Situation Criterion:</strong>{{ interaction.situation_criterion }}
				</p>
				<p><strong>Clinical Consequence:</strong> {{ interaction.clinical_consequence }}</p>
				<p v-if="interaction.instructions">
					<strong>Instructions:</strong> {{ interaction.instructions }}
				</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
const interaction = ref();

async function fetchFirstInteraction() {
	try {
		const response = await useFetch('/api/interactions');
		const interactions = await response.data.value;
		if (interactions && interactions.length > 0) {
			interaction.value = interactions[2];
		}
	} catch (error) {
		console.error(error);
	}
}
</script>


<style lang="scss" scoped>
.index {
	margin-top: $whitespace-xxxl;

	&__header {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;

		h1 {
			@include heading;
			max-width: 1000px;
		}
	}

	&__disclaimer {
		display: flex;
		justify-content: center;
	}

	&__button {
		display: flex;
		justify-content: center;
		margin-top: 40px;

		div {
			max-width: 50vw;
		}

		p {
			margin-bottom: 10px;
		}
	}
}
</style>
