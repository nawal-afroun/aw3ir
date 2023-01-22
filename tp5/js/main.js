var app;
window.onload = function () {

    app = new Vue({
        el: '#weatherApp', // cible l'�lement HTML o� nous pourrons utiliser toutes les variables ci-dessous
        data: {
            // sera utilis� comme indicateur de chargement de l'application
            loaded: false,

            // cityName, variable utilis� dans le formulaire via v-model
            formCityName: '',

            message: 'WebApp Loaded.',
            messageForm: '',

            // liste des villes saisies, initialiser avec Paris
            cityList: [{
                name: 'Paris'
            }],

            // cityWeather contiendra les donn�es m�t�o re�us par openWeatherMap
            cityWeather: null,

            // indicateur de chargement
            cityWeatherLoading: false
        },

        // 'mounted' est ex�cut� une fois l'application VUE totalement disponible
        // Plus d'info. sur le cycle de vie d'une app VUE : 
        // https://vuejs.org/v2/guide/instance.html#Lifecycle-Diagram
        mounted: function () {
            this.loaded = true;
            this.readData();
        },

        // ici, on d�finit les methodes qui vont traiter les donn�es d�crites dans DATA
        methods: {
            readData: function (event) {
                console.log('JSON.stringify(this.cityList)', JSON.stringify(this.cityList)); // va afficher la liste des villes
                // JSON.stringify permet transfomer une liste en chaine de caract�re

                console.log('this.loaded:', this.loaded); // va afficher 'this.loaded: true'
            },
            addCity: function (event) {
                event.preventDefault(); // pour ne pas recharger la page � la soumission du formulaire

                console.log('formCityName:', this.formCityName);
                // A compl�ter dans la suite du TP  
                this.cityList.push({ name: this.formCityName });

                // remise � zero du message affich� sous le formulaire
                this.messageForm = '';

                // remise � zero du champ de saisie
                this.formCityName = '';
                //Si la ville existe d�j� dans la liste cityList, afficher un message via la variable this.messageForm = 'existe d�j�';
                this.messageForm = 'existe d�j�';

                //}
            },
            isCityExist: function (_cityName) {

                // la m�thode 'filter' retourne une liste contenant tous les items ayant un nom �gale � _cityName
                // doc. sur filter : https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Array/filter
                if (this.cityList.filter(item =>
                    item.name.toUpperCase() == _cityName.toUpperCase()
                ).length > 0) {
                    return true;
                } else {
                    return false;
                }
            },
            remove: function (_city) {
                // on utilise 'filter' pour retourne une liste avec tous les items ayant un nom diff�rent de _city.name
                this.cityList = this.cityList.filter(item => item.name != _city.name);
            },
            meteo: function (_city) {
                this.cityWeatherLoading = true;

                // appel AJAX avec fetch
                fetch('https://api.openweathermap.org/data/2.5/weather?q=' + _city.name + '&units=metric&lang=fr&apikey=a02d32f5fadec22653571ded0dcb343f')
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (json) {
                        app.cityWeatherLoading = false;

                        // test du code retour
                        // 200 = OK
                        // 404 = city not found 
                        if (json.cod === 200) {
                            // on met la r�ponse du webservice dans la variable cityWeather
                            app.cityWeather = json;
                            app.message = null;
                        } else {
                            app.cityWeather = null;
                            app.message = 'M�t�o introuvable pour ' + _city.name
                                + ' (' + json.message + ')';
                        }
                    });

            }
        }
    });
}

