const dns = require('dns');
dns.lookup('db.qoaatefboljbleqvysra.supabase.co', (err, address, family) => {
    console.log('address: %j family: IPv%s', address, family);
    if (err) console.error(err);
});
