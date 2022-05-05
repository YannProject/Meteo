const weatherIcons = {
    "Rain" : "wi wi-day-rain",
    "Clouds" : "wi wi-day-cloudy",
    "Clear" : "wi wi-day-sunny",
    "Snow" : "wi wi-day-snow",
    "Mist" : "wi wi-day-fog",
    "Drizzle" : "wi wi-day-sleet",
}

function capitalize(str){
    return str[0].toUpperCase() + str.slice(1);
}

async function main(withIP = true){
    let ville;
    if(withIP){
// Await = donne moi ce que tu as trouvé une fois que tu l'a fait ( attend que tout ca soit fini une fois fait c'est bon)
// Asynchrone permet de faire des tâches en parallèle
// Fonction fetch permet d'aller récupérer des informations sur un autre serveur/ de l'AJAX 
//1. Choper l'adresse IP du PC qui ouvre la page : https://api.ipify.org?format=json
// a tester en dehors de l'entreprise ... car IP pas normal 
        const ip = await fetch('https://api.ipify.org?format=json')
            .then(resultat => resultat.json())
            .then(json => json.ip);
            
        ville = await fetch ("https://freegeoip.app/json/" + ip) /*TEST : ("https://api.ipstack.com/" + ip + "?access_key=19e49ba74324681734a7940e19ef2a2b") - "https://ip-api.com/"*/
            .then(resultat => resultat.json())
            .then(json => json.city);
            
    } else{
        ville = document.querySelector('#ville').textContent;
    }

    const meteo = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${ville}&appid=aa5031fee8175b3801b195a4a885f30e&Lang=fr&units=metric`)
        .then(resultat => resultat.json())
        .then(json => json);

            
//4. Afficher les informations sur la page
    displayWeatherInfos(meteo)
}
function displayWeatherInfos (data){
    const name = data.name;
    const temperature = data.main.temp;
    const conditions = data.weather[0].main;
    const description = data.weather[0].description;
    const humidity = data.main.humidity;

    document.querySelector('#ville').textContent = name;
    document.querySelector('#temperature').textContent = Math.round(temperature);
    document.querySelector('#conditions').textContent = capitalize(description);
    document.querySelector('#humidity').textContent = humidity;

    document.querySelector('i.wi').className = weatherIcons[conditions];
    document.body.className = conditions.toLowerCase();
}

const ville = document.querySelector('#ville');

ville.addEventListener('click', () => {
    ville.contentEditable = true;
});
ville.addEventListener('keydown', (e) => {
    if(e.keyCode === 13){ // si la touche entrée est presser alors fait ca ... 13 === entrée
        e.preventDefault(); // evite d'aller a la ligne comportement par default de la touche entrée
        ville.contentEditable = false;
        main(false);
    }
})
main();