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
	</div>
</template>

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
}
</style>
