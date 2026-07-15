// Always open the page at the top after a reload
if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
}

window.addEventListener("load", () => {
    window.scrollTo(0, 0);
});

const nav = document.querySelector("nav");
const hamburger = document.querySelector(".hamburger");
const menu = document.querySelector(".menu");
const menuOverlay = document.querySelector(".menu-overlay");
const loader = document.getElementById("loader");
const hero = document.querySelector(".hero");

function updateNav() {
    nav?.classList.toggle("scrolled", window.scrollY > 100);
}

function setMenu(open) {
    if (!hamburger || !menu || !menuOverlay) return;

    hamburger.classList.toggle("active", open);
    menu.classList.toggle("active", open);
    menuOverlay.classList.toggle("active", open);
    document.body.classList.toggle("menu-open", open);

    hamburger.setAttribute("aria-expanded", String(open));
    hamburger.setAttribute(
        "aria-label",
        open ? "Close navigation menu" : "Open navigation menu"
    );
}

window.addEventListener("scroll", updateNav, { passive: true });
window.addEventListener("resize", () => {
    if (window.innerWidth > 800) setMenu(false);
});

updateNav();

hamburger?.addEventListener("click", () => {
    setMenu(!menu?.classList.contains("active"));
});

menuOverlay?.addEventListener("click", () => setMenu(false));

document.querySelectorAll('.menu a[href^="#"]').forEach(link => {
    link.addEventListener("click", () => {
        setMenu(false);
    });
});


/* LIGHTBOX */
const images = [...document.querySelectorAll(".gallery img")];
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const closeBtn = document.getElementById("close");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");

let currentIndex = 0;
let touchStartX = 0;

function showImage(index) {
    if (!images.length || !lightboxImg) return;

    currentIndex = (index + images.length) % images.length;
    lightboxImg.src = images[currentIndex].src;
    lightboxImg.alt = images[currentIndex].alt;
}

function openLightbox(index) {
    if (!lightbox) return;

    showImage(index);
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeLightbox() {
    if (!lightbox) return;

    lightbox.classList.remove("active");
    document.body.style.overflow = "";
}

images.forEach((img, index) => {
    img.addEventListener("click", () => openLightbox(index));
});

closeBtn?.addEventListener("click", closeLightbox);

nextBtn?.addEventListener("click", event => {
    event.stopPropagation();
    showImage(currentIndex + 1);
});

prevBtn?.addEventListener("click", event => {
    event.stopPropagation();
    showImage(currentIndex - 1);
});

lightbox?.addEventListener("click", event => {
    if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        if (menu?.classList.contains("active")) {
            setMenu(false);
        } else if (lightbox?.classList.contains("active")) {
            closeLightbox();
        }
    }

    if (!lightbox?.classList.contains("active")) return;

    if (event.key === "ArrowRight") showImage(currentIndex + 1);
    if (event.key === "ArrowLeft") showImage(currentIndex - 1);
});

lightbox?.addEventListener(
    "touchstart",
    event => {
        touchStartX = event.changedTouches[0].screenX;
    },
    { passive: true }
);

lightbox?.addEventListener(
    "touchend",
    event => {
        const distance = event.changedTouches[0].screenX - touchStartX;

        if (Math.abs(distance) > 50) {
            showImage(currentIndex + (distance < 0 ? 1 : -1));
        }
    },
    { passive: true }
);

/* IMAGE PROTECTION */
document.addEventListener("contextmenu", event => {
    if (event.target.closest("img, .hero, .gallery, #lightbox")) {
        event.preventDefault();
    }
});

document.querySelectorAll("img").forEach(img => {
    img.draggable = false;
    img.addEventListener("dragstart", event => event.preventDefault());
    img.addEventListener("auxclick", event => event.preventDefault());
});

document.addEventListener("keydown", event => {
    const key = event.key.toLowerCase();

    if ((event.ctrlKey || event.metaKey) && (key === "s" || key === "u")) {
        event.preventDefault();
    }
});

/* LOADER */
const startTime = Date.now();
const heroImage = new Image();
let heroRevealed = false;

function revealHero() {
    if (heroRevealed) return;
    heroRevealed = true;

    const remaining = Math.max(0, 650 - (Date.now() - startTime));

    window.setTimeout(() => {
        hero?.classList.add("loaded");
        loader?.classList.add("hidden");
    }, remaining);
}

heroImage.addEventListener("load", revealHero, { once: true });
heroImage.addEventListener("error", revealHero, { once: true });
heroImage.src = "images/hero.jpg";

if (heroImage.complete) revealHero();
