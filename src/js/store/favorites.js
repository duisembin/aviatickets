import tickets from "../views/tickets";

class Favorites {
    constructor() {
        this.favoriteTickets = [];
    }
    getAllFavorites () {
        return this.favoriteTickets;
    }
   /* setFavoriteTicket(ticket){
        this.favoriteTickets.forEach(favTickets => {
            console.log(favTickets.flightId)
        });
        console.log(ticket.flightId);
        let ticketExists = this.favoriteTickets.some(favTicket => favTicket.flightId === ticket.flightId);
        if (!ticketExists) {
            this.favoriteTickets.push(ticket);
        }
    }*/

    setFavoriteTicket(ticket) {
        // Проверяем наличие билета с таким же flightId в избранных
        let ticketExists = this.favoriteTickets.some(favTicket => favTicket.flightId === ticket.flightId);

        // Если билет уже существует, выводим сообщение и завершаем функцию
        if (ticketExists) {
            console.log(`Ticket with flightId ${ticket.flightId} already exists in favorites.`);
            return;
        }

        // Добавляем билет в избранные, так как его еще нет в массиве
        this.favoriteTickets.push(ticket);

        // Выводим сообщение об успешном добавлении
        console.log(`Added ticket with flightId ${ticket.flightId} to favorites.`);
    }

    deleteFavoriteTicket(ticket) {
        // Проверяем наличие билета с таким же flightId в избранных
        let ticketExists = this.favoriteTickets.some(favTicket => favTicket.flightId === ticket.flightId);

        if (!ticketExists) {
            return;
        }

        this.favoriteTickets = this.favoriteTickets.filter(favTicket => favTicket.flightId !== ticket.flightId);
    }


}
const favorites = new Favorites();
export default favorites;
