import { defineConfig } from 'vitepress';

export default defineConfig({
	rewrites: {
		'README.md': 'index.md',
		'(.*)/README.md': '(.*)/index.md',
	},
	base: './',
	title: 'AirMash Extensions',
	description: 'Some extensions for AirMash.',
	themeConfig: {
		nav: [{ text: 'parsehex on GitHub', link: 'https://github.com/parsehex' }],

		sidebar: undefined,

		socialLinks: [
			{
				icon: 'github',
				link: 'https://github.com/parsehex/airmash-extensions',
			},
		],
	},
});
