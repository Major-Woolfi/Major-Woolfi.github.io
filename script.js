document.addEventListener('DOMContentLoaded', function () {
    const fadeEls = document.querySelectorAll('.fade-in');
    const onScroll = () => {
        fadeEls.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 40) {
                el.style.animationPlayState = 'running';
            }
        });
    };
    onScroll();
    window.addEventListener('scroll', onScroll);

    const track = document.getElementById('reviews-track');
    const marquee = document.getElementById('reviews-marquee');
    if (track && marquee) {
        let speed = 0.7;
        let pos = 0;
        let isPointerDown = false;
        let pointerStartX = 0;
        let pointerStartPos = 0;
        let pauseUntil = 0;

        function setupMarquee() {
            const clones = track.querySelectorAll('.review-card.clone');
            clones.forEach(clone => clone.remove());

            let totalWidth = 0;
            const cards = track.querySelectorAll('.review-card:not(.clone)');
            cards.forEach(card => totalWidth += card.offsetWidth + 48);

            let cloneWidth = 0;
            let i = 0;
            while (cloneWidth < marquee.offsetWidth * 3) {
                const clone = cards[i % cards.length].cloneNode(true);
                clone.classList.add('clone');
                track.appendChild(clone);
                cloneWidth += clone.offsetWidth + 48;
                i++;
            }
            track.style.width = (totalWidth + cloneWidth) + 'px';
        }

        function normalizePosition() {
            let guard = 0;
            while (guard < 300) {
                const firstCard = track.querySelector('.review-card');
                if (!firstCard) break;
                const cardWidth = firstCard.offsetWidth + 48;
                if (-pos >= cardWidth) {
                    track.appendChild(firstCard);
                    pos += cardWidth;
                    guard++;
                    continue;
                }
                if (pos > 0) {
                    const cardsAll = track.querySelectorAll('.review-card');
                    const lastCard = cardsAll[cardsAll.length - 1];
                    if (!lastCard) break;
                    const lastWidth = lastCard.offsetWidth + 48;
                    track.insertBefore(lastCard, track.firstChild);
                    pos -= lastWidth;
                    guard++;
                    continue;
                }
                break;
            }
        }

        function animate() {
            const now = Date.now();
            if (now >= pauseUntil && !isPointerDown) {
                pos -= speed;
            }
            if (!isPointerDown) normalizePosition();
            track.style.transform = `translateX(${pos}px)`;
            requestAnimationFrame(animate);
        }

        setupMarquee();
        window.addEventListener('resize', setupMarquee);
        requestAnimationFrame(animate);

        marquee.addEventListener('pointerdown', function (e) {
            isPointerDown = true;
            pointerStartX = e.clientX;
            pointerStartPos = pos;
            try { marquee.setPointerCapture(e.pointerId); } catch (err) { }
            marquee.classList.add('dragging');
            e.preventDefault();
        });

        marquee.addEventListener('pointermove', function (e) {
            if (!isPointerDown) return;
            const delta = e.clientX - pointerStartX;
            pos = pointerStartPos + delta;
            track.style.transform = `translateX(${pos}px)`;
        });

        function endPointer(e) {
            if (!isPointerDown) return;
            isPointerDown = false;
            try { marquee.releasePointerCapture(e.pointerId); } catch (err) { }
            marquee.classList.remove('dragging');
            normalizePosition();
            pauseUntil = Date.now() + 3000;
        }

        marquee.addEventListener('pointerup', endPointer);
        marquee.addEventListener('pointercancel', endPointer);

        marquee.addEventListener('wheel', function (e) {
            const delta = e.deltaX !== 0 ? -e.deltaX : -e.deltaY;
            pos += delta;
            normalizePosition();
            track.style.transform = `translateX(${pos}px)`;
            pauseUntil = Date.now() + 3000;
            e.preventDefault();
        }, { passive: false });
    }

    const navLogo = document.getElementById('nav-logo');
    const sideNav = document.querySelector('.side-nav');
    if (navLogo && sideNav) {
        const overlay = document.getElementById('nav-overlay');
        const toggle = (open) => {
            if (open) {
                sideNav.classList.add('open');
                if (overlay) overlay.classList.add('open');
                navLogo.setAttribute('aria-expanded', 'true');
                if (overlay) overlay.setAttribute('aria-hidden', 'false');
            } else {
                sideNav.classList.remove('open');
                if (overlay) overlay.classList.remove('open');
                navLogo.setAttribute('aria-expanded', 'false');
                if (overlay) overlay.setAttribute('aria-hidden', 'true');
            }
        };

        navLogo.addEventListener('click', (e) => {
            e.preventDefault();
            toggle(!sideNav.classList.contains('open'));
        });

        if (overlay) {
            overlay.addEventListener('click', (e) => {
                toggle(false);
            });
        }

        document.addEventListener('click', (e) => {
            if (!sideNav.classList.contains('open')) return;
            if (sideNav.contains(e.target) || navLogo.contains(e.target)) return;
            toggle(false);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sideNav.classList.contains('open')) toggle(false);
        });
    }
});