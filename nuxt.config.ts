import { resolve } from 'path';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },

	app: {
		head: {
			charset: 'utf-8',
			viewport: 'width=device-width, initial-scale=1',
			title: 'Ravimite koostoime',
			htmlAttrs: {
				lang: 'et',
			},
			link: [
				{
					rel: 'icon',
					type: 'image/png',
					sizes: 'any',
					href: '/favicon.png',
				},
				{
					rel: 'mask-icon',
					color: '#386fa4',
					href: '/favicon.png',
				},
				{
					rel: 'apple-touch-icon',
					sizes: '180x180',
					href: '/favicon.png',
				},
			],
		},
	},

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
