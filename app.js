window.addEventListener('load', () => {
    const canvas = document.getElementById('matrixCanvas');
    const ctx = canvas.getContext('2d');

    let ripples = [];
    let lastMousePos = { x: null, y: null };

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    window.addEventListener('mousemove', (e) => {
        const currentMousePos = { x: e.clientX, y: e.clientY };

        if (ripples.length === 0 || Math.getDistance(ripples[ripples.length - 1], currentMousePos) > 40) {
            ripples.push({
                x: e.clientX,
                y: e.clientY,
                radius: 1,
                alpha: 0.8
            });
        }
        lastMousePos = currentMousePos;
    });

    Math.getDistance = function(p1, p2) {
        return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    };

    const katakana = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const alphabet = katakana.split("");

    const fontSize = 16;
    let columns = canvas.width / fontSize;

    let rainDrops = [];
    for (let x = 0; x < columns; x++) {
        rainDrops[x] = 1;
    }

    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'rgba(0, 180, 0, 0.75)';
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < rainDrops.length; i++) {
            const text = alphabet[Math.floor(Math.random() * alphabet.length)];
            ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

            if (rainDrops[i] * fontSize > canvas.height && Math.random() * 100 > 97.5) {
                rainDrops[i] = 0;
            }
            rainDrops[i]++;
        }

        for (let r = ripples.length - 1; r >= 0; r--) {
            let ripple = ripples[r];
            ctx.strokeStyle = `rgba(0, 255, 0, ${ripple.alpha})`;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
            ctx.stroke();

            ripple.radius += 2.5;
            ripple.alpha -= 0.02;

            if (ripple.alpha <= 0) {
                ripples.splice(r, 1);
            }
        }
    }

    setInterval(draw, 30);

    const textElement = document.getElementById("i");
    const fullText = "Full stack dasturchi, Telegram botlar, Web saytlar, Telegram mini applar";
    let index = 0;

    function typeText() {
        if (index < fullText.length) {
            textElement.innerHTML = fullText.substring(0, index + 1) + '<span class="cursor">|</span>';
            index++;
            setTimeout(typeText, 68);
        } else {
            const cursorSpan = textElement.querySelector('.cursor');
            if (cursorSpan) {
                cursorSpan.remove();
            }
        }
    }
    typeText();
});
