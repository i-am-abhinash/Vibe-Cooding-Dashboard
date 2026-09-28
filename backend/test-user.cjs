const { db } = require('./src/firebase');

async function test() {
  const snap = await db.collection('vibe_users').where('email', '==', 'lead@demo.com').get();
  if (snap.empty) {
    console.log("NOT FOUND");
  } else {
    console.log("FOUND", snap.docs[0].data());
  }
}

test().then(() => process.exit(0)).catch(console.error);
