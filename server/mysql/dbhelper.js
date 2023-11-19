import mysql from 'mysql';

// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'calkwalk',
//     password: 'abc123456',
//     database: 'estate'
// });

const db = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'calkwalk',
    password        : 'abc123456',
    database        : 'estate'
});

export default db;