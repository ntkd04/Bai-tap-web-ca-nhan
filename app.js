// app.js
import { projects } from './data.js';

const ul = document.querySelector('#project-list');
const tpl = document.querySelector('#project-card');
const bar = document.querySelector('#filters');
const searchBox = document.querySelector('#search');
const countEl = document.querySelector('#project-count');
const emptyMsg = document.querySelector('#empty-state');
const themeBtn = document.querySelector('#theme-toggle');
const form = document.querySelector('#contact-form');
const status = document.querySelector('#form-status');
const root = document.documentElement;

let activeTag = 'all';
let keyword = '';

function render(list) {
    ul.textContent = '';

    countEl.textContent = `Hiển thị ${list.length} / ${projects.length} dự án`;

    if (list.length === 0) {
        emptyMsg.hidden = false;
        return;
    }
    emptyMsg.hidden = true;

    for (const p of list) {
        const li = tpl.content.cloneNode(true);
        li.querySelector('h3').textContent = p.title;
        li.querySelector('.card-meta').textContent = 'Năm ' + p.year;

        const tagWrap = li.querySelector('.card-tags');
        for (const tag of p.tags) {
            const span = document.createElement('span');
            span.textContent = tag;
            tagWrap.appendChild(span);
        }
        ul.appendChild(li);
    }
}

const tags = [...new Set(projects.flatMap((p) => p.tags))];

for (const tag of ['all', ...tags]) {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = tag === 'all' ? 'Tất cả' : tag;
    b.dataset.tag = tag;
    if (tag === 'all') {
        b.classList.add('active');
    }
    bar.appendChild(b);
}

function filterProjects() {
    let result = projects;

    // Lọc theo tag
    if (activeTag !== 'all') {
        result = result.filter((p) => p.tags.includes(activeTag));
    }

    // Lọc theo từ khoá 
    if (keyword !== '') {
        const q = keyword.toLowerCase();
        result = result.filter((p) => p.title.toLowerCase().includes(q));
    }

    render(result);
}

bar.addEventListener('click', (e) => {
    const tag = e.target.dataset.tag;
    if (!tag) return;

    activeTag = tag;

    const buttons = bar.querySelectorAll('button');
    buttons.forEach((b) => {
        b.classList.toggle('active', b === e.target);
    });

    filterProjects();
});

searchBox.addEventListener('input', (e) => {
    keyword = e.target.value;
    filterProjects();
});

function setTheme(isDark) {
    if (isDark) {
        root.classList.add('dark');
        themeBtn.textContent = '☀️';
    } else {
        root.classList.remove('dark');
        themeBtn.textContent = '🌙';
    }
}

if (localStorage.getItem('theme') === 'dark') {
    setTheme(true);
}

themeBtn.addEventListener('click', () => {
    const isDark = root.classList.toggle('dark');
    themeBtn.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.querySelector('#name');

    if (!form.checkValidity()) {
        status.textContent = 'Vui lòng điền đầy đủ và đúng định dạng.';
        status.className = 'form-status error';
        return;
    }

    status.textContent = 'Cảm ơn ' + nameInput.value + ', mình sẽ phản hồi sớm!';
    status.className = 'form-status success';
    form.reset();
});

render(projects);