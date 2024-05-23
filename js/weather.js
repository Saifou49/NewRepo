// I will create a global p tag for the clock
var clockPTag = document.createElement('p');
clockPTag.setAttribute('id', 'clock_Value');

var temperatureTag = document.createElement('p');
temperatureTag.setAttribute('id', 'temperature_value');


// I have also to create a global variable to be able to clear the interval of the clock
var intervalID = '';


function main()
{
    var enteredCityName = document.getElementById('city_name_input').value;// Take the value of the input field
    var displayedCityName = document.getElementById('entered_city_name').innerHTML;// Take the already displayed city name if exist
    var enteredCityNameCapitalize = enteredCityName.charAt(0).toUpperCase() + enteredCityName.slice(1);


    // Now i will add the create p tag for clock in his div. This line of code has to here
    // Otherwise every time that the button is clicked a new p tag will be added to the div
    // This way only the content will change dinamically
    document.getElementById('clock_Value').appendChild(clockPTag);


    // I have to check if the input fied is empty or not
    if(enteredCityNameCapitalize == '')
    {
        alert('Please enter a city name');
    }
    else if(enteredCityNameCapitalize == displayedCityName)
    {
        alert('Please enter an other city');
    }
    else
    {
        //By displaying the new name i will automatically clear the already existed interval for the clock
        clearInterval(intervalID);
        // This function call his self and displays the entered city name with the first letter in UpperCase:
        const  displayEnteredCityName = (() => {

            document.getElementById('entered_city_name').innerHTML = enteredCityNameCapitalize;
            document.getElementById('city_name_input').value = ''; // this line of code cleans the input field automatically
        })();

        // This function call his self and displays the text for the clock:
        const displayClockText = (() => {
            document.getElementById('time_in_city').innerHTML = `The time in ${enteredCityNameCapitalize} is`;
        })();

        // This function call his self and displays the text for the temperature:
        const displayTemperatureText = (() => {
            document.getElementById('temperature_text').innerHTML = `The temperature in ${enteredCityNameCapitalize} is`;
        })();

        takeTheTimeAndDisplayIt(); // I call the function which display the time
        
        displayTemperature(); // I call the function which display the temperature


    }



    //This function take the time from the weather API online and display it
    async function takeTheTimeAndDisplayIt() 
    {
        const myApiKey = '49b162e65c11ba46a61f1793c30c4b26';
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${enteredCityNameCapitalize}&appid=${myApiKey}`;

        // https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`

       
        var currentTime = '';

        try
        {
            const response = await fetch(apiUrl);
            const data = await response.json();
            
            

            if(response.ok)
            {
               var timeZoneOffset = data.timezone;

                function keepDisplayingTheTime () {
                    var utcDate = new Date();
                    currentTime = new Date(Date.now() + (timeZoneOffset) * 1000); // This is the formul how to determin the time
                                                                            // of a given city without knowing the timeOffSet;
                    //Now i will determine the exact hour, minutes and seconds
                    var hour = currentTime.getHours() -2;// I extract the hour
                    var minutes = currentTime.getMinutes();// I extract the minutes
                    var seconds = currentTime.getSeconds();// I extract the seconds

                    var clock = `${hour}:${minutes}:${seconds}`;

                    clockPTag.innerHTML = `${clock}`; // I Add the clock to the create p tag for the clock

                };
                // This interval change every second the time and so we have a reel time of the city
                intervalID = setInterval(keepDisplayingTheTime, 1000);
        
            }
            else
            {
                clockPTag.innerHTML = 'Error fetching data';
            }

        }
        catch(error)
        {
            clockPTag.innerHTML = 'Error', error;
        }



    }

    //This function take the temperature from the weather API online and dispay it

    async function displayTemperature()
    {
        const myApiKey = '49b162e65c11ba46a61f1793c30c4b26';
        const temperatureURL = `https://api.openweathermap.org/data/2.5/weather?q=${enteredCityNameCapitalize}&appid=${myApiKey}&units=metric`;
        
        try
        {
            const response = await fetch(temperatureURL); //request data from the API
            const data = await response.json();// convert the received data in a json file

            if(response.ok)
            {
                var temperature = data.main.temp;

                temperatureTag.innerHTML = `${temperature}°C`;

                document.getElementById('temperature_value').appendChild(temperatureTag);

                const displayWeatherStatus = () => {

                    if(temperature <=10)
                    {
                        return document.getElementById('status_value').innerHTML = `It's very cold in ${enteredCityNameCapitalize} now`;
                    }
                    else if(temperature > 10 && temperature <= 20)
                    {
                        return document.getElementById('status_value').innerHTML = `It's cold in ${enteredCityNameCapitalize} now`;
                    }
                    else if(temperature > 20 && temperature <= 25)
                    {
                        return document.getElementById('status_value').innerHTML = `It's warm in ${enteredCityNameCapitalize} now`;
                    }
                    else
                    {
                        return document.getElementById('status_value').innerHTML = `It's very warm in ${enteredCityNameCapitalize} now`;
                    }
                }; 
                displayWeatherStatus();

            }
            else
            {
                temperatureTag.innerHTML = 'Error';
            }
        }
        catch(error)
        {
            temperatureTag.innerHTML = 'Error ';
        }

    }

    


    

}