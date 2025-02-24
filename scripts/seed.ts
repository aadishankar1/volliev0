import { seedDevData, cleanupDevData } from './seed-dev-data.js';

async function main() {
  const args = process.argv.slice(2);
  const shouldCleanup = args.includes('--cleanup');

  if (shouldCleanup) {
    console.log('Cleaning up development data...');
    await cleanupDevData();
  } else {
    console.log('Seeding development data...');
    await seedDevData();
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  }); 