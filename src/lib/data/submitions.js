import database from '$lib/data/database';
const contacts = [];

// Fake save function to simulate saving data
export async function save(contact) {
  contacts.push(contact);
  console.log('Saved contact:', contact);
}

export default {
  save
};
