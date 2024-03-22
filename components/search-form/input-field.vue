<template>
	<div class="search-form__field" :class="{ invalid: isInvalid }">
		<input
			v-model="inputValue"
			:placeholder="placeholder"
			type="text"
			@focus="onFocus"
			@input="filterAutocomplete"
			@blur="hideAutocomplete"
		/>
		<transition name="fade">
			<ul
				v-show="showAutocomplete"
				class="search-form__field--autocomplete"
			>
				<li v-if="filteredOptions.length === 0" class="no-matches">
					Ravimit ei leitud
				</li>
				<li
					v-for="(option, i) in filteredOptions"
					v-else
					:key="i"
					@click="selectOption(option)"
				>
					{{ option }}
				</li>
			</ul>
		</transition>
	</div>
</template>

<script setup lang="ts">
interface Props {
	placeholder: string;
	index: number;
	formFields: string[];
	fieldInvalid: boolean[];
	autocompleteValues: string[];
}

const props = defineProps<Props>();
const emit = defineEmits([
	'focusField',
	'updateFormField',
	'updateFieldInvalid',
]);

const inputValue = ref<string>(props.formFields[props.index]);
const showAutocomplete = ref<boolean>(false);
const filteredOptions = ref<string[]>([]);

const isInvalid = computed(() => props.fieldInvalid[props.index]);

const filterAutocomplete = () => {
	const inputValueTrimmed = inputValue.value.trim().toLowerCase();

	filteredOptions.value = props.autocompleteValues.filter((option) =>
		option.toLowerCase().includes(inputValueTrimmed),
	);

	showAutocomplete.value = !!inputValueTrimmed;
};

const onFocus = () => {
	emit('focusField');
	removeInvalid();
};

const removeInvalid = () => {
	if (inputValue.value.trim() === '') {
		emit('updateFieldInvalid', { index: props.index, value: false });
	}
};

const selectOption = (option: string) => {
	inputValue.value = option;
	showAutocomplete.value = false;

	emit('updateFormField', { index: props.index, value: option });
};

const hideAutocomplete = () => {
	setTimeout(() => {
		showAutocomplete.value = false;
	}, 100);
};
</script>

<style scoped lang="scss">
.search-form__field {
	position: relative;

	input {
		@include input;
	}

	&--autocomplete {
		position: absolute;
		width: 100%;
		max-height: 200px;
		margin: 0;
		padding: $whitespace-xxs 0;
		background-color: #fff;
		border: 1px solid $color-border;
		border-radius: $border-radius;
		list-style: none;
		overflow-y: auto;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

		li {
			padding: $whitespace-xxs $whitespace-sm;
			cursor: pointer;
			transition: all $transition;

			&:hover {
				background-color: $color-secondary-light;
			}
		}

		.no-matches {
			padding: $whitespace-step $whitespace-sm;

			&:hover {
				cursor: default;
				background-color: #fff;
			}
		}
	}

	&.invalid input:not(:focus-visible) {
		outline: 2px solid $color-error;
	}
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity $transition-short;
}

.fade-enter,
.fade-leave-to {
	opacity: 0;
}
</style>
