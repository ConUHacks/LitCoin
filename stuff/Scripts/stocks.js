function stock(name, cost, change) {

    this.name = name;
    this.cost = cost;
    this.change = change;

    this.retName = function() {
        return this.name;
    };
    this.retCost = function() {
        return this.cost;
    };
    this.retChange = function() {
        return this.change;
    };

    this.change = function(numberOfshares, neg) {
        this.change = neg * this.cost * numberOfshares;
        this.cost += neg * this.cost * numberOfshares;
    };

}