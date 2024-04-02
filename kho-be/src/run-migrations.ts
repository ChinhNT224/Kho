import { KhoApplication } from './application';
import { migrations } from './migrations/migrations';

async function runMigrations() {
    try {
        const app = new KhoApplication();
        await app.boot();
        await migrations(app);
        console.log('Migration complete');
        process.exit(0);
    } catch (err) {
        console.error('Cannot migrate database schema', err);
        process.exit(1);
    }
}

runMigrations();
