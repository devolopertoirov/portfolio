window.addEventListener('load', () => {
    const $ = s => document.querySelector(s);
    const sleep = ms => new Promise(r => setTimeout(r, ms));

    // ====== MA'LUMOTLAR (shu yerni o'zingiz tahrirlang) ======
    // [nom, bot username, tavsif, ishlayaptimi (1 = ha, 0 = kod tayyor)]
    const PROJECTS = [
        ['SafeApkGuardBot', 'SafeApkGuardBot', "Chatga kelgan xavfli .apk fayllarni aniqlaydi, o'chiradi va sizni ogohlantiradi.", 0],
        ['ProSavedFBot', 'ProSavedFBot', "Instagram va TikTok videolarini asl sifatida yuklab beradi.", 0],
        ['Ob-havo bot', 'OB_HAVO_KUNDALIK_BOT', "Har kuni 07:00 da ob-havo: harorat, yomg'ir, qor. O'zbek, Rus, Ingliz tillarida.", 0],
        ['Quiz bot', 'Quiz_pul_bot', "10 ta savolga to'g'ri javob bering va yutuq oling.", 0],
        ['Kino bot', 'KINOLAR_N1_UZ_BOT', "Kino, serial va multfilmlar. Premium obuna tizimi bilan.", 0],
        ['Ovoz → matn bot', 'Voice_to_tex_uz_bot', "Video yoki ovozli xabarni matnga aylantiradi.", 0],
        ['Valyuta kalkulyator', 'DOLLARKALKULATORBOT', "Dollar, rubl va so'm o'rtasida tezkor hisoblash.", 0],
        ['Tarjima bot', '', "Ingliz, Rus, Koreys, Arab va 20+ tilda tarjima.", 0],
        ['AI chatbot va boshqalar', '', "Buyurtma bo'yicha: AI chatbot, to'lov tizimi (Click, Payme), admin panel.", 0],
    ];
    const SKILLS = ['Python', 'Telegram Bot API', 'Telegram Mini Apps', 'HTML / CSS / JS', 'AI chatbot', 'Click / Payme', 'Kali Linux', 'Kiberxavfsizlik'];
    const INTRO = ['Wake up, Diyorbek...', 'The Matrix has you...', 'Follow the green rain.'];
    const PHRASES = ['Full stack dasturchi', 'Telegram botlar', 'Web saytlar', 'Telegram mini applar'];

    // ====== RANGLAR ======
    const themes = { green: '0,255,0', blue: '0,180,255', red: '255,40,60' };
    let col = themes.green, cur = 'green';
    function setColor(n) {
        if (!themes[n]) return false;
        cur = n; col = themes[n];
        document.documentElement.style.setProperty('--c', col);
        return true;
    }
    $('#theme').onclick = () => {
        const k = Object.keys(themes);
        setColor(k[(k.indexOf(cur) + 1) % k.length]);
    };

    // ====== MATRIX YOMG'IRI ======
    const cv = $('#matrixCanvas'), ctx = cv.getContext('2d');
    const chars = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
    const fs = 16;
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
    setInterval(draw, 30);

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
            const p = PHRASES[k++ % PHRASES.length];
            for (let j = 1; j <= p.length; j++) { el.innerHTML = p.slice(0, j) + '<span class="cursor">|</span>'; await sleep(70); }
            await sleep(1400);
            for (let j = p.length; j >= 0; j--) { el.innerHTML = p.slice(0, j) + '<span class="cursor">|</span>'; await sleep(35); }
        }
    }

    // ====== KIRISH (INTRO) ======
    (async () => {
        const intro = $('#intro');
        let seen = 0, skip = 0;
        try { seen = sessionStorage.getItem('seen'); sessionStorage.setItem('seen', 1); } catch (e) {}
        intro.onclick = () => skip = 1;
        if (!seen) {
            for (const l of INTRO) {
                intro.textContent = '';
                for (const ch of l) { if (skip) break; intro.textContent += ch; await sleep(60); }
                if (skip) break;
                await sleep(700);
            }
        }
        intro.classList.add('off');
        setTimeout(() => intro.remove(), 800);
        typeLoop();
    })();

    // ====== KO'NIKMALAR VA LOYIHALAR ======
    $('#tags').innerHTML = SKILLS.map(s => `<span>${s}</span>`).join('');
    $('#grid').innerHTML = PROJECTS.map(([name, user, desc, live]) => `
        <a class="card" href="https://t.me/${user || 'devoloper_toirov'}" target="_blank" rel="noopener">
            <h3>${name}</h3><p>${desc}</p>
            <small class="${live ? 'live' : ''}">${live ? '● Ishlamoqda' : 'Kod tayyor'}${user ? ' · @' + user : ''}</small>
        </a>`).join('');
    document.querySelectorAll('.card').forEach(c => {
        c.onmousemove = e => {
            const b = c.getBoundingClientRect(), x = (e.clientX - b.left) / b.width - 0.5, y = (e.clientY - b.top) / b.height - 0.5;
            c.style.transform = `perspective(600px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg)`;
        };
        c.onmouseleave = () => c.style.transform = '';
    });

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
    const CMD = {
        help: () => 'help, about, skills, projects, contact, color <green|blue|red>, clear',
        about: () => "Toirov Diyorbek: full stack dasturchi. Telegram botlar, web saytlar va mini applar yasayman.",
        skills: () => SKILLS.join(', '),
        projects: () => PROJECTS.map(p => '- ' + p[0]).join('\n'),
        contact: () => 'Telegram: @devoloper_toirov',
    };
    inp.onkeydown = e => {
        if (e.key !== 'Enter') return;
        const v = inp.value.trim(), [c, a] = v.split(' ');
        inp.value = '';
        if (c === 'clear') { out.textContent = ''; return; }
        let r = '';
        if (c === 'color') r = setColor(a) ? 'Rang almashtirildi.' : 'green, blue yoki red yozing.';
        else if (CMD[c]) r = CMD[c]();
        else if (v) r = `Noma'lum buyruq: ${v}. "help" deb yozing.`;
        out.textContent += `$ ${v}\n` + (r ? r + '\n' : '');
        out.scrollTop = out.scrollHeight;
    };

    // ====== YASHIRIN SIR: Konami kodi ======
    const KONAMI = 'ArrowUp,ArrowUp,ArrowDown,ArrowDown,ArrowLeft,ArrowRight,ArrowLeft,ArrowRight,b,a';
    let keys = [];
    addEventListener('keydown', e => {
        if (e.target === inp) return;
        keys = [...keys, e.key].slice(-10);
        if (keys.join() === KONAMI) { setColor('red'); speed = 5; }
    });
});
