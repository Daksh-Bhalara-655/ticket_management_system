const { connect } = require('../util/db');
const Role = require('../Models/Role');

async function seed() {
  await connect();
  const roles = ['MANAGER', 'SUPPORT', 'USER'];
  for (const name of roles) {
    const exists = await Role.findOne({ name });
    if (!exists) {
      await Role.create({ name });
      console.log('Inserted role', name);
    } else {
      console.log('Role exists', name);
    }
  }
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
