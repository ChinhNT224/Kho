import {KhoApplication} from '../application';
import {MigrationRepository} from '../repositories';
import {migrateProducts} from './migrate-products';

export async function migrations(app: KhoApplication) {
    const repos = await app.getRepository(MigrationRepository);

    const list: {name: string; migration: Function}[] = [
        {name: 'migrateProducts', migration: migrateProducts},

    ];

    for (const migration of list) {
        const migrationRecord = await repos.findOne({where: {name: migration.name}});

        if (!migrationRecord) {
            console.log(`Start migration ${migration.name}`);
            await migration.migration(app);
            await repos.create({name: migration.name, createdAt: new Date(), updatedAt: new Date()});
            console.log(`Done migration ${migration.name}`);
        }
    }
}
