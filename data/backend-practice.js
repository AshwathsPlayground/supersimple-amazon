const xhr = new XMLHttpRequest();

xhr.addEventListener('load', () => {
    console.log(xhr.responseText);
});

xhr.open('GET', 'https://supersimplebackend.dev');
xhr.send(); // is a asyncronous request, it will not block the main thread