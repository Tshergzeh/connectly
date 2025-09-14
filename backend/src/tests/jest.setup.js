const { execSync } = require('child_process');

beforeAll(() => {
    console.log('Running migrations for test database...');
    execSync(
        'npx cross-env NODE_ENV=test npx node-pg-migrate up pg-migrate.config.cjs', 
        { stdio: 'inherit' }
    );
});
