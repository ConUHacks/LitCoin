function stock(name, cost) {

    this.name = name;
    this.cost = cost;

    this.retName = function(this) {
        return this.name;
    };
    this.cost = function(this) {
        return this.cost;
    };

    this.change = function(this, numberOfshares, neg) {
        this.cost += neg * this.cost * numberOfshares;
    };

}