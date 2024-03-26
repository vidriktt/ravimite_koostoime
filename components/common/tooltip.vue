<template>
	<div class="tooltip" @mouseenter="showTooltip" @mouseleave="hideTooltip">
		<slot></slot>
		<div
			v-if="isTooltipVisible"
			class="tooltip__container"
			v-html="tooltipText"
		/>
	</div>
</template>

<script setup lang="ts">
interface Props {
	tooltipText?: string;
}

withDefaults(defineProps<Props>(), { tooltipText: '' });

const isTooltipVisible = ref(false);

const showTooltip = () => {
	isTooltipVisible.value = true;
};

const hideTooltip = () => {
	isTooltipVisible.value = false;
};
</script>

<style scoped lang="scss">
$tooltip-size: 6px;

.tooltip {
	position: relative;

	&__container {
		position: absolute;
		top: calc(100% + $whitespace-xxs);
		left: 50%;
		transform: translateX(-50%);
		padding: $whitespace-xs;
		background-color: $color-secondary-dark;
		color: $color-text-light;
		border-radius: $border-radius-sharp;
		font-size: 14px;
		white-space: nowrap;
		z-index: 99;
		opacity: 0;
		transition: opacity $transition;

		&::before {
			content: '';
			position: absolute;
			top: -$tooltip-size;
			left: 50%;
			transform: translateX(-50%);
			border-width: 0 $tooltip-size $tooltip-size $tooltip-size;
			border-style: solid;
			border-color: transparent transparent $color-secondary-dark
				transparent;
		}
	}

	&:hover .tooltip__container {
		opacity: 1;
	}
}
</style>
