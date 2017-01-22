function stock(name, cost, diff) {

    this.name = name;
    this.cost = cost;
    this.diff = diff;

    this.change = function(numberOfshares, neg) {
        this.change = neg * cost * numberOfshares;
        this.cost += neg * this.cost * numberOfshares;
    };

}