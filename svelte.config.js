import adapter from '@sveltejs/adapter-static';
import { relative, sep } from 'node:path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		runes: ({ filename }) => {
			const relativePath = relative(import.meta.dirname, filename);
			const pathSegments = relativePath.toLowerCase().split(sep);
			const isExternalLibrary = pathSegments.includes('node_modules');

			return isExternalLibrary ? undefined : true;
		},
		modernAst: true,
	},
	kit: {
		adapter: adapter({
			precompress: false,
			fallback: '404.html'
		}),
		experimental: {
			forkPreloads: true
		},
	}
};

export default config;
