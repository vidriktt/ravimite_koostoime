<template>
	<div class="layout-default">
		<CommonHeader :without-logo="withoutLogo" />
		<slot />
		<CommonFooter :without-disclaimer="withoutDisclaimer" />
	</div>
</template>

<script setup lang="ts">
interface Props {
	withoutLogo?: boolean;
	withoutDisclaimer?: boolean;
}

withDefaults(defineProps<Props>(), {
	withoutLogo: false,
	withoutDisclaimer: false,
});
</script>

<style lang="scss" scoped>
.layout-default {
	min-height: calc(100vh - $whitespace-xxxl);
	margin-bottom: $whitespace-xxxl;
}
</style>
