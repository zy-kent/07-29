import low from 'lowdb';
import LocalStorage from 'lowdb/adapters/LocalStorage';

const adapter = new LocalStorage(`mgsgw-${process.env.VUE_APP_VERSION}`);
const db = low(adapter);

db.defaults({
    sys: {},
    database: {}
}).write();

export default db;
