'use strict';

const STORAGE_KEY = 'minicrm_contacts';

function loadContacts() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
        return [];
    }
}

function saveContacts(contacts) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

let contacts = loadContacts();
let searchQuery = '';

const form = document.getElementById('contactForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const companyInput = document.getElementById('company');
const searchInput = document.getElementById('searchInput');
const contactList = document.getElementById('contactList');
const emptyMessage = document.getElementById('emptyMessage');
const contactCount = document.getElementById('contactCount');

function addContact(name, email, phone, company) {
    if (!name.trim() || !email.trim()) {
        alert('Numele si email-ul sunt obligatorii!');
        return false;
    }
    const contact = {
        id: generateId(),
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        company: company.trim(),
        createdAt: new Date().toISOString()
    };
    contacts.push(contact);
    saveContacts(contacts);
    return true;
}

function deleteContact(id) {
    if (!confirm('Sigur doriti sa stergeti acest contact?')) return;
    contacts = contacts.filter(c => c.id !== id);
    saveContacts(contacts);
    renderContacts();
}

function filterContacts(query) {
    if (!query.trim()) return contacts;
    const q = query.toLowerCase();
    return contacts.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q)
    );
}

function getInitials(name) {
    return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

function renderContactCard(contact) {
    const card = document.createElement('div');
    card.className = 'contact-card';
    card.innerHTML = `
        <div class="contact-avatar">${getInitials(contact.name)}</div>
        <div class="contact-name">${escapeHtml(contact.name)}</div>
        ${contact.company ? `<div class="contact-company">${escapeHtml(contact.company)}</div>` : ''}
        <div class="contact-info">&#9993; ${escapeHtml(contact.email)}</div>
        ${contact.phone ? `<div class="contact-info">&#9742; ${escapeHtml(contact.phone)}</div>` : ''}
        <button class="btn-delete" data-id="${contact.id}">Sterge</button>
    `;
    card.querySelector('.btn-delete').addEventListener('click', () => deleteContact(contact.id));
    return card;
}

function renderContacts() {
    const filtered = filterContacts(searchQuery);
    contactList.innerHTML = '';

    if (filtered.length === 0) {
        emptyMessage.style.display = 'block';
        contactCount.textContent = '0 contacte';
        return;
    }

    emptyMessage.style.display = 'none';
    contactCount.textContent = `${filtered.length} contact${filtered.length !== 1 ? 'e' : ''}`;

    const fragment = document.createDocumentFragment();
    filtered.forEach(contact => fragment.appendChild(renderContactCard(contact)));
    contactList.appendChild(fragment);
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const success = addContact(nameInput.value, emailInput.value, phoneInput.value, companyInput.value);
    if (success) {
        form.reset();
        renderContacts();
    }
});

searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderContacts();
});

renderContacts();
