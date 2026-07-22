// ==========================================
// School ERP Landing Page
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    setGreeting();

    animateStatistics();

    revealOnScroll();

    setupParallax();

    setupNavbar();

});


// ==========================================
// Greeting
// ==========================================

function setGreeting() {

    const greeting = document.getElementById("greeting");

    const hour = new Date().getHours();

    let message = "";

    if (hour < 12) {

        message = "🌞 Good Morning";

    }

    else if (hour < 17) {

        message = "☀️ Good Afternoon";

    }

    else {

        message = "🌙 Good Evening";

    }

    greeting.innerHTML = message;

}



// ==========================================
// Animated Counter
// ==========================================

function animateStatistics() {

    const counters = document.querySelectorAll("#statistics h2");

    counters.forEach(counter => {

        const text = counter.innerText;

        const number = parseInt(text);

        if (isNaN(number)) return;

        let current = 0;

        const increment = Math.ceil(number / 70);

        const timer = setInterval(() => {

            current += increment;

            if (current >= number) {

                current = number;

                clearInterval(timer);

            }

            if (text.includes("%")) {

                counter.innerText = current + "%";

            }

            else if (text.includes("+")) {

                counter.innerText = current + "+";

            }

            else {

                counter.innerText = current;

            }

        }, 25);

    });

}



// ==========================================
// Scroll Reveal
// ==========================================

function revealOnScroll() {

    const cards = document.querySelectorAll(".glass-card");

    const observer = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.style.opacity = "1";

                entry.target.style.transform = "translateY(0px)";

            }

        });

    }, {

        threshold: .15

    });

    cards.forEach(card => {

        card.style.opacity = "0";

        card.style.transform = "translateY(60px)";

        card.style.transition = ".8s";

        observer.observe(card);

    });

}



// ==========================================
// Mouse Parallax
// ==========================================

function setupParallax() {

    const blobs = document.querySelectorAll(".blob");

    document.addEventListener("mousemove", e => {

        const x = e.clientX / window.innerWidth;

        const y = e.clientY / window.innerHeight;

        blobs.forEach((blob, index) => {

            const speed = (index + 1) * 15;

            blob.style.transform =
                `translate(${x * speed}px, ${y * speed}px)`;

        });

    });

}



// ==========================================
// Navbar Blur on Scroll
// ==========================================

function setupNavbar() {

    const navbar = document.querySelector(".navbar");

    window.addEventListener("scroll", () => {

        if (window.scrollY > 40) {

            navbar.style.background = "rgba(2,6,23,.85)";

            navbar.style.backdropFilter = "blur(25px)";

        }

        else {

            navbar.style.background = "rgba(255,255,255,.05)";

        }

    });

}