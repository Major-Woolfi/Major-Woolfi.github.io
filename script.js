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
    let speed = 0.7;
    let pos = 0;

    function setupMarquee() {
        const clones = track.querySelectorAll('.review-card.clone');
        clones.forEach(clone => clone.remove());

        let totalWidth = 0;
        const cards = track.querySelectorAll('.review-card:not(.clone)');
        cards.forEach(card => totalWidth += card.offsetWidth + 48);

        let cloneWidth = 0;
        let i = 0;
        while (cloneWidth < marquee.offsetWidth) {
            const clone = cards[i % cards.length].cloneNode(true);
            clone.classList.add('clone');
            track.appendChild(clone);
            cloneWidth += clone.offsetWidth + 48;
            i++;
        }
        track.style.width = (totalWidth + cloneWidth) + 'px';
    }

    function animate() {
        pos -= speed;
        const firstCard = track.querySelector('.review-card');
        if (firstCard) {
            const cardWidth = firstCard.offsetWidth + 48;
            if (-pos >= cardWidth) {
                track.appendChild(firstCard);
                pos += cardWidth;
            }
        }
        track.style.transform = `translateX(${pos}px)`;
        requestAnimationFrame(animate);
    }

    setupMarquee();
    window.addEventListener('resize', setupMarquee);
    requestAnimationFrame(animate);
});