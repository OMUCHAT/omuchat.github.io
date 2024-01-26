import fs from 'node:fs/promises';

async function registerApps() {
	const apps = [];
	for (const dir of await fs.readdir('src/routes/apps', { withFileTypes: true })) {
		if (!dir.isDirectory()) continue;
		if (!(await fs.stat(`src/routes/apps/${dir.name}/+page.svelte`).catch(() => false))) {
			console.warn(`App ${dir.name} does not have a +page.svelte file. Skipping...`);
			continue;
		}
		const app = {
			name: dir.name,
			url: `/apps/${dir.name}`
		};
		if (await fs.stat(`src/routes/apps/${dir.name}/icon.png`).catch(() => false)) {
			app.icon = `apps/${dir.name}/icon.png`;
		}
		apps.push(app);
	}
	await fs.writeFile('src/routes/apps/apps.json', JSON.stringify(apps, null, 4));
}

await registerApps();

if (process.argv.includes('--watch')) {
	const watcher = fs.watch('src/routes/apps');
	for await (const event of watcher) {
		if (event.eventType === 'rename') {
			await registerApps();
		}
	}
}
