import locations from "./store/locations";
import './plugins';
import  '../css/style.css';
import formUI from "./views/form";
import tickets from "./views/tickets";
import currencyUI from "./views/currency";
import ticketsUI from "./views/tickets";
import favoritesDropdownUI from "./views/favoritesDropdown";

document.addEventListener('DOMContentLoaded', () => {
    initApp();
    const form = formUI.form;
    //const selectedTicket = ticketsUI.selectedTicket;

    //Events
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        onFormSubmit();
    })

    /*selectedTicket.addEventListener('click',(e) => {
        //e.preventDefault();
        console.log(e);
    })*/

    //Handlers
    async function initApp() {
        await locations.init();
        formUI.setAutocompleteData(locations.shortCitiesList);
    }

    async function onFormSubmit() {
        const origin = locations.getCityCodeByKey(formUI.originValue);
        const destination = locations.getCityCodeByKey(formUI.destinationValue);
        const depart_date = formUI.departDateValue;
        const return_date = formUI.returnDateValue;
        const currency = currencyUI.currencyValue;

        await locations.fetchTickets({
            origin,
            destination,
            depart_date,
            return_date,
            currency,
        });
        ticketsUI.renderTickets(locations.lastSearch);
    }
})
