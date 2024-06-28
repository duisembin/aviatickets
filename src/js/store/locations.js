import api from '../services/apiService';
import { formatDate, getMillisecondsFromDate } from "../helpers/date";
import tickets from "../views/tickets";

class Locations {
    constructor(api, helpers) {
        this.api = api;
        this.countries = null;
        this.cities = null;
        this.shortCitiesList = null;
        this.airlines = {};
        this.formatDate = helpers.formatDate;
        this.getMillisecondsFromDate = helpers.getMillisecondsFromDate;
    }
    async init(){
        const response = await Promise.all([
            this.api.countries(),
            this.api.cities(),
            this.api.airlines()
        ]);
        const [countries, cities, airlines] = response;
        this.countries = this.serializeCountries(countries);
        this.cities = this.serializeCities(cities);
        this.shortCitiesList = this.createShortCities(this.cities);
        this.airlines = this.serializeAirlines(airlines);
        return response;
    }

    getCityCodeByKey(key) {
        const city = Object.values(this.cities).find(
            item => item.full_name === key,
        );
        return city.code;
    }

    getCityNameByCode(code) {
        return this.cities[code].name;
    }

    getAirlineNameByCode(code) {
        return this.airlines[code] ? this.airlines[code].name : '';
    }

    getAirlineLogoByCode(code) {
        return this.airlines[code] ? this.airlines[code].logo : '';
    }

    createShortCities(cities) {
        return Object.entries(cities).reduce((acc, [, city]) => {
            acc[city.full_name] = null;
            return acc;
        }, {});
    }

    serializeAirlines(airlines) {
        return airlines.reduce((acc, item) => {
            item.logo = `http://pics.avs.io/200/200/${item.code}.png`;
            item.name = item.name || item.name_translations.en;
            acc[item.code] = item;
            return acc;
        }, {});
    }

    serializeCountries(countries) {
        return countries.reduce((acc, country) => {
            acc[country.code] = country;
            return acc;
        },{})
    }

    serializeCities(cities) {
        return cities.reduce((acc, city) => {
            const country_name = this.countries[city.country_code].name;
            city.name = city.name || city.name_translations.en;
            const full_name = `${city.name},${country_name}`;
            acc[city.code] = {
                ...city,
                country_name,
                full_name,
            };
            return acc;
        }, {});
    }



    getCountryNameByCode(code) {
        return this.countries[code].name;
    }

    async fetchTickets(params) {
        const response = await this.api.prices(params);
        this.lastSearch = this.serializeTickets(response.data);

        console.log('res:',this.lastSearch);
        //this.lastSearch = response.data;
        // серилизовать поиск так что бы внури были название города и страны
    }

    serializeTickets(tickets) {
        return Object.values(tickets).map(ticket => {
            return {
                ...ticket,
                origin_name: this.getCityNameByCode(ticket.origin),
                destination_name: this.getCityNameByCode(ticket.destination),
                airline_logo: this.getAirlineLogoByCode(ticket.airline),
                airline_name: this.getAirlineNameByCode(ticket.airline),
                flightId: ticket.airline+'-'+ticket.flight_number+'-'+this.getMillisecondsFromDate(ticket.departure_at),
                departure_at: this.formatDate(ticket.departure_at, 'dd MMM yyyy hh:mm'),
                return_at: this.formatDate(ticket.return_at, 'dd MMM yyyy hh:mm'),
            };
        });
    }

    getTicketByFlightId (flightId) {
        let [ticket] = this.lastSearch.filter(ticket => ticket.flightId === flightId);
        return ticket;
    }

}

const locations = new Locations(api, { formatDate, getMillisecondsFromDate });

export default locations;

//
