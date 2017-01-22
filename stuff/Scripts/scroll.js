for (var i = 0; i < 12; i++) {
    $('<h4>').html(listOfStocks[i].retName() + ' ' + listOfStocks[i].retChange() + '\t')
}