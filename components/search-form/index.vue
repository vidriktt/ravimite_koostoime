<template>
	<form class="search-form" @submit.prevent="onSubmit">
		<SearchFormInputField
			v-for="(_, index) in formFields"
			:key="index"
			:placeholder="'Toimeaine ' + (index + 1)"
			:index="index"
			:form-fields="formFields"
			:field-invalid="fieldInvalid"
			:autocomplete-values="autocompleteValues"
			@focus-field="onFocus"
			@update-form-field="updateFormField"
			@update-field-invalid="updateFieldInvalid"
		/>
		<button
			v-if="formFields.length < 4"
			class="search-form__add-field"
			@click.prevent="addField"
		>
			+
		</button>
		<button class="search-form__submit" type="submit">
			Otsi {{ query && 'uuesti' }}
		</button>
	</form>
</template>

<script setup lang="ts">
interface Props {
	query?: Record<string, string>;
}

const props = withDefaults(defineProps<Props>(), { query: undefined });
const emit = defineEmits(['on-submit']);

const formFields = ref<string[]>([]);
const fieldInvalid = ref<boolean[]>([]);
const autocompleteValues = ref<string[]>([]);

onMounted(() => {
	formFields.value = props.query ? Object.values(props.query) : ['', ''];
	fieldInvalid.value = Array(formFields.value.length).fill(false);
});

const fetchDrugs = async () => {
	try {
		const response = await useFetch('/api/drug-list');
		const drugsResponse = response.data.value;

		if (drugsResponse) {
			autocompleteValues.value = drugsResponse;
		}
	} catch (error) {
		console.error(error);
	}
};

const onFocus = () => {
	if (!autocompleteValues.value.length) {
		fetchDrugs();
	}
};

const addField = () => {
	if (formFields.value.length < 4) {
		formFields.value.push('');
		fieldInvalid.value.push(false);
	}
};

const validateForm = () => {
	fieldInvalid.value = formFields.value.map((field) => field.trim() === '');

	if (fieldInvalid.value.some((invalid) => invalid)) {
		return false;
	}

	const uniqueValues = new Set(formFields.value.map((field) => field.trim()));

	if (uniqueValues.size !== formFields.value.length) {
		formFields.value.forEach((field, index) => {
			fieldInvalid.value[index] =
				formFields.value.indexOf(field) !== index;
		});

		return false;
	}

	return true;
};

const updateFormField = ({
	index,
	value,
}: {
	index: number;
	value: string;
}) => {
	formFields.value[index] = value;
};

const updateFieldInvalid = ({
	index,
	value,
}: {
	index: number;
	value: boolean;
}) => {
	fieldInvalid.value[index] = value;
};

const onSubmit = async () => {
	if (!validateForm()) {
		return;
	}

	const queryParams: Record<string, string> = {};

	formFields.value.forEach((field, index) => {
		queryParams[`field${index + 1}`] = field;
	});

	emit('on-submit');

	await navigateTo({
		path: '/results',
		query: queryParams,
	});
};
</script>

<style scoped lang="scss">
.search-form {
	display: flex;
	gap: $whitespace-sm;

	&__add-field {
		@include input(true);
	}

	&__submit {
		@include button-primary(true);
	}
}
</style>
