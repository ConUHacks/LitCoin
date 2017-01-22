function stock(name, cost, change) {

    this.name = name;
    this.cost = cost;
    this.change = change;

    this.retName = function() {
        return name;
    };
    this.retCost = function() {
        return cost;
    };
    this.retChange = function() {
        return change;
    };

    this.change = function(numberOfshares, neg) {
        this.change = neg * cost * numberOfshares;
        this.cost += neg * this.cost * numberOfshares;
    };

}