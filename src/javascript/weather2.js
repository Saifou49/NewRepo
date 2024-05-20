var intervalId = ''; // I made this variable global to be able to clear the inverval outside of the function

var dateAndTimeTag = document.createElement('p');// I made those two lines of code global to avoid creating them every the function is trigered
dateAndTimeTag.setAttribute('id', 'time_text');

var temperatureTag = document.createElement('p');// I made those two lines of code global to avoid creating them every the function is trigered
temperatureTag.setAttribute('id', 'temperature_value');

// This function is the main function of all functions
function getTheCityName() {
 
    var nameCityOriginal = document.getElementById('city_name').value; // I get value of the entered text in the input field
    var firstLetter = nameCityOriginal.charAt(0).toUpperCase();// extract the first letter if the entered city name to convert it to Uppercase
    var nameCity = firstLetter + nameCityOriginal.slice(1);// Here i add the converted first letter in uppercase to the rest of the string to always have capitalized string
    var cityNameText = document.getElementById('entered_city_name').innerHTML;// I get the content of the p tag to be able 
                                                                        // to compare it with the entered city name

    if(nameCity == '')// I check if the input field is empty
    {
        alert('Please enter a city name first');
    }
    else if(nameCity != cityNameText) // I check if the entered name exist allready to avoid fetching data for the same city
    {
        clearInterval(intervalId);// stop the current interval of the time to be able to add new one without collision

        displayTheEnteredCityName(); // I display the entered city name with this function
        getTheTemperature(); // I display the temperature of the city with this function
        displayTheClock(); // I display the time of the city with this function
        displayTemperatureText();// I display the temperature  text of the city with this function
        displayTheTimeText(); // I display the time text of the city with this function  
    }

    //With this function i display the text of the temperature
    function displayTemperatureText()
    {// take the p tag where to display the temperature text and the value dinamically to it
        document.getElementById('temperature_text').innerHTML = `The temperature in ${nameCity}`; 
    }

    //With this function i display the temperature of the entered city
    async function getTheTemperature()
    {
        const myApiKey = '49b162e65c11ba46a61f1793c30c4b26'; // This is my api key. It's allow to make request to the weather api
        //This is the url. In the url have the name of the city and key which are dinamically changeable. However the apikey can be fix
        //because it's will not change. But i prefer it this way
        const theApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${nameCity}&appid=${myApiKey}&units=metric`; 

        var temperature = 0; // I made the variable global i give the function displayStatus the right to acces to the current temperature value

        try {
            const response = await fetch(theApiUrl);// I send the request to the api
            const data = await response.json(); // I convert the received data in json format

            if(response.ok)// I check if the reponse is Okay
            {
                temperature = data.main.temp;
                temperatureTag.textContent = `${temperature} °c`;
                document.getElementById('temperature_value').appendChild(temperatureTag);
            }
            else
            {
                alert('Error: ', data.message);
                temperatureTag.textContent = 'Error fetching data';
            }

        }catch(error)
        {
            alert('Error: ', error);
            temperatureTag.textContent = 'Error fetching data';
        }

        // with this function i display a status of the weather in relation with the temparature
        var displayTheStatus = (() =>
        {
            if(temperature <= 10)
            {
                document.getElementById('status_value').innerHTML = `${nameCity} is very cold now`;
            }
            else if(temperature > 10 && temperature <= 20)
            {
                document.getElementById('status_value').innerHTML = `${nameCity} is cold now`;
            }
            else if(temperature > 20  && temperature < 26)
            {
                document.getElementById('status_value').innerHTML = `${nameCity} is warm now`;
            }
            else
            {
                document.getElementById('status_value').innerHTML = `${nameCity} is very warm now`;
            }
        })();
    }

    // This function display the text for the time of the entered city.
    function displayTheTimeText()
    {
        var timeText = document.getElementById('time_in_city');
        timeText.innerHTML = `The time in ${nameCity} is`;
        // document.getElementById('clock_text').appendChild(timeText);
    }

     // With this function i display the time
    async function displayTheClock()
    {
        const myApiKey = '49b162e65c11ba46a61f1793c30c4b26';
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${nameCity}&appid=${myApiKey}`;
        
        var currentTime = '';

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (response.ok) {
                
                const timeZoneOffset = data.timezone;

                function keepDisplayingTime()
                {
                    currentTime = new Date(Date.now() + timeZoneOffset * 1000);
                    var hour = currentTime.getHours()
                    var minutes = currentTime.getMinutes()
                    var seconde = currentTime.getSeconds()

                    TheTimeInHour = `${hour}:${minutes}:${seconde}`;

                    dateAndTimeTag.innerHTML = `${TheTimeInHour}`;
                        
                }
                
                intervalId = setInterval(keepDisplayingTime, 1000);    
                document.getElementById('clock_area').appendChild(dateAndTimeTag); // I add the time to the parent root. Here the function will not
                
            } else 
            {
                console.error('Error:', data.error_message);
                dateAndTimeTag.innerHTML  = 'Error fetching data';
            }
        } catch (error) 
        {
            dateAndTimeTag.innerHTML = ('Error:', error);
            dateAndTimeTag.innerHTML  = 'Error fetching data';
        }
    }

    //This function display the entered city name
    function displayTheEnteredCityName()
    {
        document.getElementById('entered_city_name').innerHTML = nameCity;
        document.getElementById('city_name').value = '';
    }

}




