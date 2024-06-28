import favorites from "../store/favorites";
import locations from "../store/locations";

class FavoritesDropdownUI {
    constructor() {
        this.container = document.querySelector('.dropdown-content');
    }

    renderFavoriteTicket (){
        let fragment = '';

        let favoriteTickets = favorites.getAllFavorites();
        console.log('favoriteTickets: ', favoriteTickets);

        favoriteTickets.forEach(ticket => {
            let template = FavoritesDropdownUI.favoriteDropdownTemplate(ticket)
            fragment += template;
        });

        this.container.innerHTML = ''; // Clear existing content
        this.container.insertAdjacentHTML('afterbegin', fragment);

        favoriteTickets.forEach(ticket => {
          this.addEventListenerToFavorite(ticket.flightId);
        });
    }

    static favoriteDropdownTemplate (favoriteTicket){
        return `
        <div class="favorite-item  d-flex align-items-start">
                        <img src="${favoriteTicket.airline_logo}" class="favorite-item-airline-img"/>
                        <div class="favorite-item-info d-flex flex-column">
                            <div class="favorite-item-destination d-flex align-items-center">
                                <div class="d-flex align-items-center mr-auto">
                                    <span class="favorite-item-city">${favoriteTicket.origin_name}</span>
                                    <i class="medium material-icons">flight_takeoff</i>
                                </div>
                                <div class="d-flex align-items-center">
                                    <i class="medium material-icons">flight_land</i>
                                    <span class="favorite-item-city">${favoriteTicket.destination_name}</span>
                                </div>
                            </div>
                            <div class="ticket-time-price d-flex align-items-center">
                                <span class="ticket-time-departure">${favoriteTicket.departure_at}</span>
                                <span class="ticket-price ml-auto">${favoriteTicket.price}</span>
                            </div>
                            <div class="ticket-additional-info">
                                <span class="ticket-transfers">Пересадок: ${favoriteTicket.transfers}</span>
                                <span class="ticket-flight-number">Номер рейса: ${favoriteTicket.flight_number}</span>
                            </div>
                        </div>
                        <a class="waves-effect waves-light btn-small pink darken-3 delete-favorite ml-auto" id="delete-${favoriteTicket.flightId}">Delete</a>
                    </div>
        `
    }

    addEventListenerToFavorite(flightId) {
        const deleteButton = document.getElementById(`delete-${flightId}`);

        if (deleteButton) {
            deleteButton.addEventListener('click', (event) => {
                    favorites.deleteFavoriteTicket(locations.getTicketByFlightId(flightId));
                    console.log('delete ',favorites.getAllFavorites());
                    this.renderFavoriteTicket();
            });
        }
    }

}

const favoritesDropdownUI = new FavoritesDropdownUI();
export default favoritesDropdownUI;
