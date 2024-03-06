import { resolve } from 'path';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },

	alias: {
		'@utils': resolve(__dirname, './utils'),
		'@styles': resolve(__dirname, './assets/scss'),
		'@assets': resolve(__dirname, './assets'),
		'@server': resolve(__dirname, './server'),
	},

	vite: {
		css: {
			preprocessorOptions: {
				scss: {
					additionalData:
						'@use "sass:math"; @import "@/assets/scss/_variables.scss"; @import "@/assets/scss/_components.scss";',
					includePaths: ['./assets/scss/*.scss'],
				},
			},
		},
		assetsInclude: '**/*.md',
	},
});
