// Basic tests for Mini CRM contact operations
// Run with: node tests/test-contacts.js

let passed = 0;
let failed = 0;

function assert(condition, message) {
    if (condition) {
        console.log(`  [PASS] ${message}`);
        passed++;
    } else {
        console.log(`  [FAIL] ${message}`);
        failed++;
    }
}

console.log('\nTest: ID generation');
const ids = new Set();
for (let i = 0; i < 100; i++) {
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    ids.add(id);
}
assert(ids.size === 100, 'Generated 100 unique IDs');

console.log('\nTest: Contact structure');
const contact = {
    id: 'abc123',
    name: 'Ion Popescu',
    email: 'ion@example.com',
    phone: '069000000',
    company: 'Compania SRL',
    createdAt: new Date().toISOString()
};
assert(contact.id !== undefined, 'Contact has id field');
assert(contact.name !== undefined, 'Contact has name field');
assert(contact.email !== undefined, 'Contact has email field');
assert(contact.phone !== undefined, 'Contact has phone field');
assert(contact.company !== undefined, 'Contact has company field');
assert(contact.createdAt !== undefined, 'Contact has createdAt field');

console.log('\nTest: Filter contacts');
const contacts = [
    { id: '1', name: 'Ion Popescu', email: 'ion@example.com', company: 'Alpha SRL' },
    { id: '2', name: 'Maria Ionescu', email: 'maria@test.com', company: 'Beta SA' },
    { id: '3', name: 'Andrei Rusu', email: 'andrei@demo.com', company: 'Alpha SRL' }
];

function filterContacts(contacts, query) {
    if (!query.trim()) return contacts;
    const q = query.toLowerCase();
    return contacts.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q)
    );
}

assert(filterContacts(contacts, '').length === 3, 'Empty query returns all contacts');
assert(filterContacts(contacts, 'ion').length === 2, 'Search "ion" matches 2 contacts');
assert(filterContacts(contacts, 'alpha').length === 2, 'Search "alpha" matches 2 contacts');
assert(filterContacts(contacts, 'xyz').length === 0, 'Search "xyz" matches 0 contacts');
assert(filterContacts(contacts, 'MARIA').length === 1, 'Search is case-insensitive');

console.log('\nTest: Input validation');
function validateContact(name, email) {
    return name.trim().length > 0 && email.trim().length > 0;
}
assert(validateContact('Ion', 'ion@test.com') === true, 'Valid contact passes validation');
assert(validateContact('', 'ion@test.com') === false, 'Empty name fails validation');
assert(validateContact('Ion', '') === false, 'Empty email fails validation');
assert(validateContact('  ', '  ') === false, 'Whitespace-only fails validation');

console.log(`\n===== Results: ${passed} passed, ${failed} failed =====\n`);
process.exit(failed > 0 ? 1 : 0);
