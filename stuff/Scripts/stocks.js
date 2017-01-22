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
