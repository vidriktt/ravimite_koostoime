<template>
	<div class="interaction">
		<div class="interaction__header">
			<h2>
				{{
					// @ts-ignore
					interaction.drugs[0].toimeaine
				}}
				&nbsp;<IconsInteractionArrows />&nbsp;
				{{
					// @ts-ignore
					interaction.drugs[1].toimeaine
				}}
			</h2>
			<CommonTooltip
				:tooltip-text="
					interaction.severity_value === '2'
						? 'Kõrge kliinilise tähtsusega.<br>Suur koostoime risk. Arst peaks olukorda regulaarselt jälgima, vajadusel kaaluda alternatiivset ravimit.'
						: interaction.severity_value === '2'
							? 'Mõõduka kliinilise tähtsusega.<br>Võimalusel hoiduda kombinatsioonest, kasutades neid ainult erijuhtudel. Arsti jälgimine on tungivalt soovitatav.'
							: 'Minimaalse kliinilise tähtsusega.<br>Koostoime on ebatõenäoline, väike või ebaoluline.'
				"
			>
				<div
					class="interaction__header--severity"
					:class="
						interaction.severity_value === '2'
							? 'high'
							: interaction.severity_value === '2'
								? 'medium'
								: 'low'
					"
				>
					{{
						interaction.severity_value === '2'
							? 'Tuleks vältida'
							: interaction.severity_value === '2'
								? 'Tuleks rakendada ettevaatusabinõusid'
								: 'Kliiniliselt ohutu koostoime'
					}}
				</div>
			</CommonTooltip>
		</div>
		<div class="interaction__content">
			<template v-if="interaction.clinical_consequence">
				<h3>Kliiniline tagajärg</h3>
				<p>{{ interaction.clinical_consequence }}</p>
			</template>
			<hr v-if="interaction.situation_criterion" />
			<template v-if="interaction.situation_criterion">
				<h3>Olukorra kriteerium</h3>
				<p>{{ interaction.situation_criterion }}</p>
			</template>
			<hr v-if="interaction.instructions" />
			<template v-if="interaction.instructions">
				<h3>Abinõu</h3>
				<p>
					<span
						v-for="(instruction, index) in formatInstructions(
							interaction.instructions,
						)"
						:key="index"
					>
						{{ instruction }}
					</span>
				</p>
			</template>
			<div
				v-if="ravimiregisterPdfFetching"
				class="interaction__content--loading"
			>
				<CommonLoader />
			</div>
			<hr v-if="interaction.ravimiregister" />
			<template v-if="interaction.ravimiregister">
				<h3>
					{{
						interaction.ravimiregister.text
							? 'Koostoime Ravimi&shy;registri pakendi infolehelt'
							: 'Ravimi&shy;registri pakendi infoleht'
					}}
				</h3>
				<p class="interaction__content--ravimiregister">
					{{ interaction.ravimiregister.text }}
					<template v-if="interaction.ravimiregister.text">
						<br /><br />
					</template>
					<a :href="interaction.ravimiregister.url" target="_blank">
						Link pakendi infolehele
					</a>
				</p>
			</template>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { interactions } from '@prisma/client';

interface Props {
	interaction: interactions & {
		ravimiregister?: { text: string; url: string };
	};
	ravimiregisterPdfFetching: boolean;
}

defineProps<Props>();

const formatInstructions = (instruction: string) => {
	const match = instruction.match(/\.(?:\s*\w+){1,4}:/);

	if (match && match.index) {
		return [
			instruction.substring(0, match.index + 1).trim(),
			instruction.substring(match.index + 1).trim(),
		];
	}

	return [instruction];
};
</script>

<style scoped lang="scss">
.interaction {
	display: flex;
	flex-direction: column;
	margin-top: $whitespace-md;
	padding: $whitespace-lg $whitespace-sm $whitespace-xs;
	border: 1px solid $color-border;
	border-radius: $border-radius;

	@media (min-width: $screen-md) {
		margin-top: $whitespace-xl;
		padding: $whitespace-lg $whitespace-xl $whitespace-xs;
	}

	&__header {
		display: flex;
		flex-direction: column;
		align-self: center;
		align-items: center;
		gap: $whitespace-md;
		width: fit-content;
		margin-bottom: $whitespace-md;
		text-align: center;

		h2 {
			@include heading-5(false);
			display: flex;
			align-items: center;

			@media (min-width: $screen-md) {
				font-size: 22px;
				line-height: 22px;
			}

			svg {
				margin: 0 $whitespace-sm;

				@media (min-width: $screen-md) {
					width: 25px;
					height: 25px;
				}
			}
		}

		&--severity {
			width: fit-content;
			padding: 3px $whitespace-xs;
			border: 2px solid;
			border-radius: 20px;
			font-size: 18px;
			font-weight: 600;
			letter-spacing: 0.04rem;
			cursor: help;

			&.high {
				border-color: $color-error;
				color: $color-error;
			}

			&.medium {
				border-color: $color-warning;
				color: $color-warning;
			}

			&.low {
				border-color: $color-secondary-5;
				color: $color-secondary-5;
			}
		}
	}

	&__content {
		display: grid;
		grid-template-columns: 105px auto;
		grid-column-gap: $whitespace-step;

		@media (min-width: $screen-md) {
			grid-template-columns: 140px auto;
		}

		h3 {
			@include heading-5;
			padding: $whitespace-xs;
			font-size: 18px;
			line-height: 18px;
			hyphens: manual;

			@media (min-width: $screen-md) {
				padding: $whitespace-md;
				hyphens: none;
			}
		}

		p {
			padding: $whitespace-xs;
			line-height: 20px;

			@media (min-width: $screen-md) {
				padding: $whitespace-md;
			}

			span:not(:first-child) {
				display: block;
				padding-top: $whitespace-xxs;
			}
		}

		hr {
			grid-column: 1 / span 2;
			border: none;
			border-top: 1px solid $color-border;
		}

		&--loading {
			display: flex;
			justify-content: center;
			align-items: center;
			grid-column: 1 / span 2;
			margin: $whitespace-md 0;
		}

		&--ravimiregister {
			white-space: break-spaces;

			a {
				@include button-link(false);
			}
		}
	}
}
</style>
