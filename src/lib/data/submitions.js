import { saveContact } from '$lib/data/database'; // Import the correct function for saving contacts

// Function to save a contact to the database
export async function save(contact) {
  try {
    // Save contact information to the database
    await saveContact(contact.name, contact.email, contact.message);
    console.log('Saved contact:', contact);
  } catch (error) {
    console.error('Failed to save contact:', error);
    throw new Error('Failed to save contact');
  }
}

export default {
  save
};
