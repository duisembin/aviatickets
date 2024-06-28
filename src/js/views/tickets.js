import currencyUI from './currency';
import NoLogo from '../../images/NoLogo.png';
import locations from "../store/locations";
import favorites from "../store/favorites";
import favoritesDropdownUI from "./favoritesDropdown";

class TicketsUI {
    constructor(currency) {
        this.container = document.querySelector('.tickets-sections .row');
        this.selectedTicket = document.querySelector('.ticket-card');
        this.getCurrencySymbol = currency.getCurrencySymbol.bind(currency);
    }

    renderTickets(tickets) {
        this.clearContainer();

        if (!tickets.length) {
            this.showEmptyMsg();
            return;
        }

        let fragment = '';
        const currency = this.getCurrencySymbol();

        tickets.forEach(ticket => {
            let template = TicketsUI.ticketTemplate(ticket, currency);
            fragment += template;
        });

        this.container.insertAdjacentHTML('afterbegin', fragment);

        tickets.forEach(ticket => {
            this.addEventListenerToTicket(ticket.flightId);
        });
    }

    addEventListenerToTicket(flightId) {
        const ticketCard = document.getElementById(flightId);

        if (ticketCard) {
            ticketCard.addEventListener('click', (event) => {

                let isFavorite = favorites.favoriteTickets.some(favTickets => favTickets.flightId === flightId);

                if (isFavorite) {
                    ticketCard.classList.remove("star-icon-active");
                    ticketCard.classList.add("star-icon-no-active");
                    favorites.deleteFavoriteTicket(locations.getTicketByFlightId(flightId));
                    favoritesDropdownUI.renderFavoriteTicket();
                }  else {
                    ticketCard.classList.remove("star-icon-no-active");
                    ticketCard.classList.add("star-icon-active");
                    favorites.setFavoriteTicket(locations.getTicketByFlightId(flightId));
                    favoritesDropdownUI.renderFavoriteTicket();
                }


                console.log('ticketCard: ',ticketCard.classList.contains("star-icon-no-active"));
                console.log('allFavorites: ',favorites);
            });
        }
    }

    clearContainer() {
        this.container.innerHTML = '';
    }

    showEmptyMsg() {
        const template = TicketsUI.emptyMsgTemplate();
        this.container.insertAdjacentHTML('afterbegin', template);
    }

    static emptyMsgTemplate() {
        return `
    <div class="tickets-empty-res-msg">
      По вашему запросу билетов не найдено.
    </div>
    `;
    }

    static ticketTemplate(ticket, currency) {
        const airlineLogo = ticket.airline_logo ? ticket.airline_logo : NoLogo;
        return `
    <div class="col s12 m6">
      <div class="card ticket-card">
        <div class="ticket-airline d-flex align-items-center">
          <img
            src="${airlineLogo}"
            class="ticket-airline-img"
            onerror="this.onerror=null;this.src='${NoLogo}';"
          />
          <span class="ticket-airline-name"
            >${ticket.airline_name}</span
          >
          <div class="favorite-icon d-flex align-items-center ml-auto ">
          <i class="medium material-icons star-icon-no-active" id="${ticket.flightId}">star</i>
          </div>
        </div>
        <div class="ticket-destination d-flex align-items-center">
          <div class="d-flex align-items-center mr-auto">
            <span class="ticket-city">${ticket.origin_name}</span>
            <i class="medium material-icons">flight_takeoff</i>
          </div>
          <div class="d-flex align-items-center">
            <i class="medium material-icons">flight_land</i>
            <span class="ticket-city">${ticket.destination_name}</span>
          </div>
        </div>
        <div class="ticket-time-price d-flex align-items-center">
          <span class="ticket-time-departure">${ticket.departure_at}</span>
          <span class="ticket-price ml-auto">${currency}${ticket.price}</span>
        </div>
        <div class="ticket-additional-info">
          <span class="ticket-transfers">Пересадок: ${ticket.transfers}</span>
          <span class="ticket-flight-number">Номер рейса: ${ticket.flight_number}</span>
        </div>
      </div>
    </div>
    `;
    }
}

const ticketsUI = new TicketsUI(currencyUI);

export default ticketsUI;
