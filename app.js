window.addEventListener('load', () => {
    const $ = s => document.querySelector(s);
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const track = n => { try { window.umami?.track(n); window.plausible?.(n); } catch (e) {} };

    const { PROJECTS, SKILLS, INTRO, SVC, ART, PROC, PKG, FAQ, FORM_URL, T } = SITE;
    let status = {}, lang = 'uz';
    try { lang = localStorage.getItem('lang') || (/^ru/.test(navigator.language) ? 'ru' : /^en/.test(navigator.language) ? 'en' : 'uz'); } catch (e) {}
    const t = k => T[lang][k];
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ====== RANGLAR ======
    const themes = { green: '0,255,0', blue: '0,180,255', red: '255,40,60' };
    let col = themes.green, cur = 'green';
    function setColor(n) {
        if (!Object.hasOwn(themes, n)) return false;
        cur = n; col = themes[n]; try { localStorage.setItem('col', n); } catch (e) {}
        document.documentElement.style.setProperty('--c', col);
        return true;
    }
    $('#theme').onclick = () => {
        const k = Object.keys(themes);
        setColor(k[(k.indexOf(cur) + 1) % k.length]);
    };

    try { setColor(localStorage.getItem('col')); } catch (e) {}
    // ====== MATRIX YOMG'IRI ======
    const cv = $('#matrixCanvas'), ctx = cv.getContext('2d');
    const chars = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
    const fs = innerWidth < 600 ? 20 : 16;
    let drops = [], ripples = [], speed = 1, mx = -999, my = -999;

    function resize() {
        cv.width = innerWidth; cv.height = innerHeight;
        const n = Math.ceil(cv.width / fs);
        while (drops.length < n) drops.push(Math.random() * -40);
        drops.length = n;
    }
    resize();
    addEventListener('resize', resize);

    function draw() {
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.fillRect(0, 0, cv.width, cv.height);
        ctx.font = fs + 'px monospace';
        for (let i = 0; i < drops.length; i++) {
            const x = i * fs, y = drops[i] * fs;
            // sichqoncha yaqinidagi harflar oq bo'lib porlaydi
            ctx.fillStyle = Math.hypot(x - mx, y - my) < 90 ? '#fff' : `rgba(${col},0.7)`;
            ctx.fillText(chars[Math.random() * chars.length | 0], x, y);
            if (y > cv.height && Math.random() > 0.975) drops[i] = 0;
            drops[i] += speed;
        }
        if (speed > 1) speed = Math.max(1, speed - 0.05);
        for (let r = ripples.length - 1; r >= 0; r--) {
            const p = ripples[r];
            ctx.strokeStyle = `rgba(${col},${p.a})`;
            ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.stroke();
            p.r += p.big ? 6 : 2.5; p.a -= p.big ? 0.015 : 0.02;
            if (p.a <= 0) ripples.splice(r, 1);
        }
    }
    setInterval(() => { if (!document.hidden && !reduce) draw(); }, 30);

    // ====== KURSOR, SICHQONCHA VA TOUCH ======
    const dot = $('#dot'), ring = $('#ring');
    let rx = 0, ry = 0;
    function move(x, y) {
        mx = x; my = y;
        dot.style.opacity = ring.style.opacity = 1;
        dot.style.transform = `translate(${x}px,${y}px)`;
        const l = ripples[ripples.length - 1];
        if (!l || Math.hypot(l.x - x, l.y - y) > 40) ripples.push({ x, y, r: 1, a: 0.8 });
    }
    addEventListener('mousemove', e => move(e.clientX, e.clientY));
    addEventListener('touchmove', e => move(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
    addEventListener('click', e => { ripples.push({ x: e.clientX, y: e.clientY, r: 1, a: 1, big: 1 }); speed = 3; });
    (function follow() {
        rx += (mx - rx) * 0.15; ry += (my - ry) * 0.15;
        ring.style.transform = `translate(${rx}px,${ry}px)`;
        requestAnimationFrame(follow);
    })();

    // ====== ISMGA GLITCH ======
    const nm = $('#name'), orig = nm.dataset.v, junk = '01#@$%&*';
    let gt;
    nm.onmouseenter = () => {
        let n = 0; clearInterval(gt);
        gt = setInterval(() => {
            nm.textContent = [...orig].map((c, i) => i < n || c === ' ' ? c : junk[Math.random() * junk.length | 0]).join('');
            if (n++ >= orig.length) { clearInterval(gt); nm.textContent = orig; }
        }, 40);
    };

    // ====== ALMASHIB YOZILADIGAN MATN ======
    const el = $('#i');
    async function typeLoop() {
        let k = 0;
        for (;;) {
            const ph = t('ph'), p = ph[k++ % ph.length];
            for (let j = 1; j <= p.length; j++) { el.innerHTML = p.slice(0, j) + '<span class="cursor">|</span>'; await sleep(70); }
            await sleep(1400);
            for (let j = p.length; j >= 0; j--) { el.innerHTML = p.slice(0, j) + '<span class="cursor">|</span>'; await sleep(35); }
        }
    }

    // ====== KIRISH (INTRO) ======
    (async () => {
        const intro = $('#intro');
        let seen = 0, skip = 0;
        try { const s = +localStorage.getItem('seen'); seen = s && Date.now() - s < 6048e5; if (!seen) localStorage.setItem('seen', Date.now()); } catch (e) {}
        intro.onclick = () => skip = 1;
        addEventListener('keydown', () => skip = 1);
        if (!seen && !reduce) {
            const tx = document.createElement('span'), hint = document.createElement('small');
            hint.textContent = t('skip'); intro.append(tx, hint);
            for (const l of INTRO) {
                tx.textContent = '';
                for (const ch of l) { if (skip) break; tx.textContent += ch; await sleep(35); }
                if (skip) break;
                await sleep(400);
            }
        }
        intro.classList.add('off');
        setTimeout(() => intro.remove(), 800);
        typeLoop();
    })();

    // ====== KONTENT (til yoki status o'zgarsa qayta chiziladi) ======
    function tilt(c) {
        c.onmousemove = e => {
            const b = c.getBoundingClientRect(), x = (e.clientX - b.left) / b.width - 0.5, y = (e.clientY - b.top) / b.height - 0.5;
            c.style.transform = `perspective(600px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg)`;
        };
        c.onmouseleave = () => c.style.transform = '';
    }
    function render() {
        const i = ['uz', 'ru', 'en'].indexOf(lang);
        document.documentElement.lang = lang;
        document.querySelectorAll('[data-i]').forEach(e => e.textContent = t(e.dataset.i));
        document.querySelectorAll('[data-p]').forEach(e => { e.placeholder = t(e.dataset.p); e.setAttribute('aria-label', t(e.dataset.p)); });
        document.title = t('ttl'); $('meta[name=description]').content = t('dsc');
        $('#proc').innerHTML = PROC.map(x => `<div class="card"><h3>${x[i][0]}</h3><p>${x[i][1]}</p></div>`).join('');
        $('#pkg').innerHTML = PKG.map(x => `<div class="card"><h3>${x[i][0]}</h3><p class="price">${x[i][1]}</p><p>${x[i][2]}</p></div>`).join('');
        $('#faq').innerHTML = FAQ.map(a => `<details><summary>${a[i][0]}</summary><p>${a[i][1]}</p></details>`).join('');
        $('#tags').innerHTML = SKILLS.map(s => `<span>${s}</span>`).join('');
        $('#grid').innerHTML = PROJECTS.map(([name, user, desc, live0]) => {
            const live = status[user] ?? live0;
            return `<a class="card" href="https://t.me/${user || 'devoloper_toirov'}" target="_blank" rel="noopener">
                <h3>${name}</h3><p>${desc[i]}</p>
                <small class="${live ? 'live' : ''}">${live ? '● ' + t('live') : t('code')}${user ? ' · @' + user : ''}</small></a>`;
        }).join('');
        $('#svc').innerHTML = SVC.map(x => `<div class="card"><h3>${x[i][0]}</h3><p>${x[i][1]}</p></div>`).join('');
        $('#art').innerHTML = ART.map(a => `<details><summary>${a[i][0]}</summary><p>${a[i][1]}</p></details>`).join('');
        document.querySelectorAll('#grid .card').forEach(tilt);
        document.querySelectorAll('.lang button').forEach(b => b.classList.toggle('on', b.dataset.l === lang));
    }
    document.querySelectorAll('.lang button').forEach(b => b.onclick = () => {
        lang = b.dataset.l;
        try { localStorage.setItem('lang', lang); } catch (e) {}
        render();
    });
    render();
    // Bot holati: status.json faylida {"BotUsername": 1} yozing
    fetch('status.json').then(r => r.json()).then(j => { status = j; render(); }).catch(() => {});

    // ====== RAQAMLAR SANALISHI ======
    const io = new IntersectionObserver(es => es.forEach(e => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        const t = +e.target.dataset.t, s = e.target.dataset.s || '';
        let v = 0;
        const id = setInterval(() => {
            v = Math.min(t, v + Math.ceil(t / 25));
            e.target.textContent = v + s;
            if (v >= t) clearInterval(id);
        }, 50);
    }));
    document.querySelectorAll('.n').forEach(n => io.observe(n));

    // ====== TERMINAL ======
    const out = $('#out'), inp = $('#cmd');
    const li = () => ['uz', 'ru', 'en'].indexOf(lang), hist = []; let hp = 0;
    const CMD = Object.assign(Object.create(null), {
        help: () => 'help, about, skills, projects, services, price, order, youtube, github, contact, lang <uz|ru|en>, color <green|blue|red>, clear',
        about: () => t('about'),
        skills: () => SKILLS.join(', '),
        projects: () => PROJECTS.map(p => '- ' + p[0]).join('\n'),
        services: () => SVC.map(x => '- ' + x[li()][0]).join('\n'),
        price: () => t('note'),
        order: () => { track('term_order'); open('https://t.me/devoloper_toirov', '_blank', 'noopener'); return 'Telegram...'; },
        youtube: () => 'https://www.youtube.com/@DEVELOPER_TOIROV',
        github: () => 'https://github.com/devolopertoirov',
        contact: () => 'Telegram: @devoloper_toirov',
    });
    inp.onkeydown = e => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
            hp = Math.min(hist.length, Math.max(0, hp + (e.key === 'ArrowUp' ? -1 : 1)));
            inp.value = hist[hp] || '';
            return;
        }
        if (e.key !== 'Enter') return;
        const v = inp.value.trim(), [c = '', a] = v.toLowerCase().split(' ');
        inp.value = '';
        if (v) hist.push(v);
        hp = hist.length;
        if (c === 'clear') { out.textContent = ''; return; }
        let r = '';
        if (c === 'color') r = setColor(a) ? 'Rang almashtirildi.' : 'green, blue yoki red yozing.';
        else if (c === 'lang') {
            if (['uz', 'ru', 'en'].includes(a)) { lang = a; try { localStorage.setItem('lang', a); } catch (x) {} render(); r = 'OK'; }
            else r = 'lang uz | ru | en';
        }
        else if (CMD[c]) r = CMD[c]();
        else if (v) r = `Noma'lum buyruq: ${v}. "help" deb yozing.`;
        out.textContent += `$ ${v}\n` + (r ? r + '\n' : '');
        out.scrollTop = out.scrollHeight;
    };

    // ====== BOG'LANISH FORMASI ======
    $('#form').onsubmit = async e => {
        e.preventDefault();
        const f = e.target.elements, d = { name: f.n.value, contact: f.c.value, msg: f.m.value, w: f.w.value }, st = $('#fstat');
        if (d.w) return;
        track('form_submit');
        try {
            if (!FORM_URL) throw 0;
            const r = await fetch(FORM_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d) });
            if (!r.ok) throw 0;
            st.textContent = t('sent'); e.target.reset();
        } catch (x) {
            open('https://t.me/devoloper_toirov?text=' + encodeURIComponent(`${d.name} (${d.contact}): ${d.msg}`), '_blank');
            st.textContent = t('fb');
        }
    };

    // ====== SUZUVCHI TUGMA VA STATISTIKA ======
    const fab = $('#fab');
    addEventListener('scroll', () => fab.classList.toggle('show', scrollY > innerHeight * 0.8), { passive: true });
    document.addEventListener('click', e => { const a = e.target.closest('[data-track]'); if (a) track(a.dataset.track); });

    // ====== YASHIRIN SIR: Konami kodi ======
    const KONAMI = 'ArrowUp,ArrowUp,ArrowDown,ArrowDown,ArrowLeft,ArrowRight,ArrowLeft,ArrowRight,b,a';
    let keys = [];
    addEventListener('keydown', e => {
        if (e.target === inp) return;
        keys = [...keys, e.key].slice(-10);
        if (keys.join() === KONAMI) { setColor('red'); speed = 5; }
    });
});
