<template>
	<div class="layout-default">
		<CommonHeader :without-logo="withoutLogo" />
		<CommonMobileMenu />
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
