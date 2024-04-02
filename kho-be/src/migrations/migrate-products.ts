import csvtojson from 'csvtojson';
import {KhoApplication} from '../application';
import {MigrationRepository, ProductsRepository} from '../repositories';

export async function migrateProducts(app: KhoApplication) {
    try {
        const csvFilePath = 'src/products.csv';
        const productsRepository = await app.getRepository(ProductsRepository);
        const migrationRepository = await app.getRepository(MigrationRepository);

        const jsonArray = await csvtojson().fromFile(csvFilePath);
        console.log('CSV content:', jsonArray);

        for (const row of jsonArray) {
            const productData = {
                name: row.name,
                quantity: Number(row.quantity),
                price: Number(row.price),
                expirationdate: new Date(row.expirationdate),
            };
            await productsRepository.create(productData);
        }

        console.log('Migration complete');

        const migrationData = {
            name: 'migrate-products.ts',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        await migrationRepository.create(migrationData);
    } catch (err) {
        console.error('Error migrating products:', err);
        throw err;
    }
}
