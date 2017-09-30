const config_handler = require("../src/config_handler")
const fs = require('fs-extra');

test("loadConfig", async () => {
  let TestConfig = JSON.stringify({
    PGUSER: 'postgres',
    PGHOST: 'localhost',
    PGPORT: 5050,
    PGPASSWORD: 'test123',
    PGDATABASE: 'gitbot'
  });
  await fs.writeFile('config_test.json', TestConfig);
  let _ = await config_handler.loadConfig('config_test.json');
  if(process.env['PGUSER'] !== 'postgres'){

    throw new Error('Flamingo');
  }
  if(process.env['PGHOST'] !== 'localhost'){
    throw new Error('Flamingo');
  }
  if(process.env['PGPORT'] !== '5050') {
    throw new Error('Flamingo');
  }
  if(process.env['PGPASSWORD'] !== 'test123') {
    throw new Error('Flamingo');
  }
  if(process.env['PGDATABASE'] !== 'gitbot') {
    throw new Error('Flamingo');
  }
})
