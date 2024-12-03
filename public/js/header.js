const menuItems = document.querySelectorAll('header nav ul li');

menuItems.forEach(item => {
    if (window.location.pathname.includes(item.querySelector('a').getAttribute('href'))) {
        item.classList.add('active');
    } else {
        item.classList.remove('active');
    }
});