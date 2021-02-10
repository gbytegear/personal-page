const nav_button = document.querySelector('nav>.nav-open'),
      nav = document.querySelector('nav');

nav_button.addEventListener("click",
    ()=>nav.classList.contains("open")?nav.classList.remove("open"):nav.classList.add("open")
);

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});