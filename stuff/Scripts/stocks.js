function stock(name, cost, change) {

    this.name = name;
    this.cost = cost;
    this.change = change;

    this.retName = function(this) {
        return this.name;
    };
    this.retCost = function(this) {
        return this.cost;
    };
    this.retChange = function(this) {
        return this.change;
    };

    this.change = function(this, numberOfshares, neg) {
        this.change = neg * this.cost * numberOfshares;
        this.cost += neg * this.cost * numberOfshares;
    };

}

var listOfStocks = [
    new stock("Google", 10),
    new stock("Yellow Pages", 10),
    new stock("SAP", 10),
    new stock("Vigilant: A DRW Company", 10),
    new stock("Nuance", 10),
    new stock("Spiria", 10),
    new stock("Morgan Stanley", 10),
    new stock("Dr. Constantinides", 10),
    new stock("CAE", 10),
    new stock("Microsoft", 10)
];