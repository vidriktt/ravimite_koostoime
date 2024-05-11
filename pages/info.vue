<template>
	<NuxtLayout name="default">
		<div class="info">
			<h1>Siit leiad tekkinud<br />küsimustele vastuseid</h1>
			<h2>
				Lisaks informaatseid ja abistavaid viiteid välistele lehtedele
			</h2>
			<div class="info__block">
				<p>
					See veebirakendus on valminud 2024 bakalauresetöö raames.<br />
					Autor Vidrik Toom Tabas.<br class="br-smaller" />
					Juhendaja Lidia Feklistova.
				</p>
				<p>
					Rakendus ning otsingutulemused on tervenisti
					eestikeelsed.<br />
					Andmed pärinevad Norra riikliku meditsiinivahendite ameti
					<a
						href="https://www.dmp.no/om-oss/distribusjon-av-legemiddeldata"
						target="_blank"
					>
						NOMA
					</a>
					(Norwegian Medical Products Agency) andmebaasist. Kasutatud
					andmed on algselt norrakeelsed, seetõttu võib esineda
					mõningaid tõlkevigu.<br />
					Ravimiameti
					<a href="https://ravimiregister.ee" target="_blank">
						Ravimiregistrist
					</a>
					on saadud eestikeelsed toimeaine nimetused ning pakendite
					infolehed.
				</p>
				<a
					href="https://github.com/vidriktt/ravimite_koostoime"
					target="_blank"
				>
					Koodibaas GitHub'is
				</a>
			</div>
			<div class="info__content">
				<h3>Ravimite koostoimest</h3>
				<p>
					Ükski ravim pole lõplikult ohutu. Igal toimeainel on
					organismile mõju ning seetõttu on väga oluline ravimite õige
					kasutamine. Ravimite koostoime on erinevate toimeainete
					omavaheline vastastikmõju. Mitmete erinevate ravimite
					samaaegsel kasutamisel suureneb tõenäosus koos- ja
					kõrvaltoimete esinemisele. Need koostoimed võivad põhjustada
					mitmesuguseid soovimatuid tagajärgi, sealhulgas ühe või
					mitme ravimi terapeutiliste mõjude võimendumist või
					nõrgenemist, kõrvaltoimete suurenenud riski või ravimite
					toime muutust organismis. Ravimite tarvitajad peavad olema
					valvsad potentsiaalsete koostoimete tuvastamisel ja
					ettevaatusabinõude rakendamisel, et saavutada soovitud
					tulemused ravimite võtmisel ning tagada ohutus.<br />
					<a
						href="https://www.ravimiamet.ee/ravimid-ja-ohutus/ravimiohutus/korvaltoimed"
						target="_blank"
					>
						Ravimiameti artikkel kõrvaltoimete kohta
					</a>
				</p>
				<h3>Rakendus</h3>
				<p>
					Ravimite koostoime kontrollimiseks peate sisestama
					otsingusse vähemalt kaks toimeaine nimetust või ATC koodi
					ning vajutada "Otsi".<br class="br-smaller" />
					Leitud ravimite koostoimed kuvatakse eraldi sektsioonidena,
					kus iga sektsioon sisaldab kahe ravimi koostoimet.
					<br class="br-smaller" />
					Tulemus annab esimesena hinnangu koostoime kliinilisele
					tähtsusele kategooriaga, mis on üks järgnevatest:
				</p>
				<div class="info__content--grid">
					<div>
						<p><strong>Tuleks vältida</strong></p>
						<p>
							Kõrge kliinilise tähtsusega.
							<br class="br-smaller" />
							Suur koostoime risk. Arst peaks olukorda
							regulaarselt jälgima, vajadusel kaaluda
							alternatiivset ravimit.
						</p>
					</div>
					<div>
						<p>
							<strong>
								Tuleks rakendada ettevaatusabinõusid
							</strong>
						</p>
						<p>
							Mõõduka kliinilise tähtsusega.
							<br class="br-smaller" />
							Võimalusel hoiduda kombinatsioonest, kasutades neid
							ainult erijuhtudel. Arsti jälgimine on tungivalt
							soovitatav.
						</p>
					</div>
					<div>
						<p><strong>Kliiniliselt ohutu koostoime</strong></p>
						<p>
							Minimaalse kliinilise tähtsusega.
							<br class="br-smaller" />
							Koostoime on ebatõenäoline, väike või ebaoluline.
						</p>
					</div>
				</div>
				<p>
					Iga ravimi koostoime sektsioon sisaldab välja "Kliiniline
					tagajärg" ning võimalikke väljasid "Olukorra kriteerium" ja
					"Abinõu".<br />
					Lisaks on välja toodud info Ravimiregistri pakendi
					infolehelt ravimite koostoime kohta, kui see eksisteerib.
					Edasise huvi ja ohutuse tarvis on lisatud link tervele
					pakendi infolehele.
				</p>
			</div>
		</div>
	</NuxtLayout>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.info {
	max-width: 1000px;
	margin: $whitespace-xl auto 200px;
	padding: 0 $whitespace-md;

	@media (min-width: $screen-md) {
		margin-bottom: 220px;
	}

	h1 {
		@include heading-4;
		margin: $whitespace-sm 0;
		color: $color-text;
		line-height: 22px;
		text-transform: uppercase;
	}

	h2 {
		@include heading-5;
	}

	h3 {
		@include supporting-heading;
		margin: $whitespace-lg 0 $whitespace-xs;
	}

	a {
		@include button-link(false);
	}

	br {
		display: block;
		content: '';
		margin: $whitespace-xxs 0;

		&.br-smaller {
			margin: $whitespace-step 0;
		}
	}

	&__block {
		display: flex;
		flex-direction: column;
		gap: $whitespace-lg;
		margin: $whitespace-xl 0;
		padding: $whitespace-sm;
		border: 1px solid $color-border;
		border-radius: $border-radius;
		line-height: 1.3;

		@media (min-width: $screen-md) {
			padding: $whitespace-md;
		}

		a {
			width: fit-content;
		}
	}

	&__content {
		&--grid {
			display: grid;
			grid-template-columns: repeat(auto-fill, 1fr);
			gap: $whitespace-lg;
			margin: $whitespace-md;
			padding: $whitespace-md;
			border: 1px solid $color-border;
			border-radius: $border-radius;
			line-height: 1.3;

			@media (min-width: $screen-md) {
				grid-template-columns: repeat(3, 1fr);
				margin: $whitespace-md $whitespace-xxl;
			}

			p:first-child {
				margin-bottom: $whitespace-sm;
			}
		}
	}
}
</style>
