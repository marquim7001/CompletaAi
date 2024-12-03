document.querySelectorAll('.event-image').forEach((element) => {
    const category = element.getAttribute('data-category');
    switch (category) {
        case "Esportes":
            element.style.backgroundImage = "url('https://cdn.builder.io/api/v1/image/assets/TEMP/5ce4302ab4a0177d69ca788d99c832fa69dd128fbd5be049ea85b94769c968b6?placeholderIfAbsent=true&apiKey=a45041b1ff1c4ddc9b879ac51c79d14c')";
            break;
        case "Entretenimento":
            element.style.backgroundImage = "url('https://cdn.builder.io/api/v1/image/assets/TEMP/a7791d5e14e7a96a04801d1fb27786cceb480bf14cb68aa01605f16bbc3737db?placeholderIfAbsent=true&apiKey=a45041b1ff1c4ddc9b879ac51c79d14c')";
            break;
        case "Tecnologia":
            element.style.backgroundImage = "url('https://cdn.builder.io/api/v1/image/assets/TEMP/b20ae47328cd18b54511a959228724d0f1c044d8d8cfc0ad46628716c5ce0232?placeholderIfAbsent=true&apiKey=a45041b1ff1c4ddc9b879ac51c79d14c')";
            break;
        case "Educação":
            element.style.backgroundImage = "url('https://cdn.builder.io/api/v1/image/assets/TEMP/4bdfc13b92b366c2b8014ad2342dd1049b566081a89de03853fb2515fbe2992a?placeholderIfAbsent=true&apiKey=a45041b1ff1c4ddc9b879ac51c79d14c')";
            break;
        case "Jogos":
            element.style.backgroundImage = "url('https://cdn.builder.io/api/v1/image/assets/TEMP/6f257ea2924d02a456e57941a759024ce94ce0640e2189cd8049eb0aafe84549?placeholderIfAbsent=true&apiKey=a45041b1ff1c4ddc9b879ac51c79d14c')";
            break;
        default:
            console.warn(`Categoria não reconhecida: ${category}`);
    }
});
