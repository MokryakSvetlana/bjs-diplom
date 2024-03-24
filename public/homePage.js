"use strict";

const logoutButton = new LogoutButton();
logoutButton.action = function() {
    ApiConnector.logout(response => {
        if (response.success) {
           location.reload();
        }
    });
}

ApiConnector.current(response => {
    if (response.success) {
        ProfileWidget.showProfile(response.data);
    }
});

const ratesBoard = new RatesBoard();
ratesBoard.getCurrency = function () {
    ApiConnector.getStocks(response => {
        if (response.success) {
            this.clearTable();
            this.fillTable(response.data);
        }
    })
};

ratesBoard.getCurrency();
setInterval(() => ratesBoard.getCurrency(), 60000)

const moneyManager = new MoneyManager();
moneyManager.addMoneyCallback = function ({currency, amount}) {
    ApiConnector.addMoney({currency, amount}, response => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            this.setMessage(true, 'success');
            return;
        }
        this.setMessage(false, response.error);
    });
}

moneyManager.conversionMoneyCallback = function ({fromCurrency, targetCurrency, fromAmount}) {
    ApiConnector.convertMoney({fromCurrency, targetCurrency, fromAmount}, response => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            this.setMessage(true, 'success');
            return;
        }
        this.setMessage(false, response.error);
    });
}

moneyManager.sendMoneyCallback = function ({to, currency, amount}) {
    ApiConnector.transferMoney({to, currency, amount}, response => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            this.setMessage(true, 'success');
            return;
        }
        this.setMessage(false, response.error);
    });
}

const favoritesWidget = new FavoritesWidget();
ApiConnector.getFavorites(response => {
    if (response.success) {
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(response.data);
        moneyManager.updateUsersList(response.data);
        return;
    }
    this.setMessage(false, response.error);
});

favoritesWidget.addUserCallback = function ({id, name}) {
    ApiConnector.addUserToFavorites({id, name}, response => {
        if (response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            this.setMessage(true, 'success');
            return;
        }
        this.setMessage(false, response.error);
    });
}

favoritesWidget.removeUserCallback = function (id) {
    ApiConnector.removeUserFromFavorites(id, response => {
        if (response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            this.setMessage(true, 'success');
            return;
        }
        this.setMessage(false, response.error);
    });

}