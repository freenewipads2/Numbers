//Extend array prototype too see if arrays are unique

Array.prototype.unique = function() {
    var r = new Array();
    o: for (var i = 0, n = this.length; i < n; i++) {
        for (var x = 0, y = r.length; x < y; x++) {
            if (r[x] == this[i]) {
                return false;
            }
        }
        r[r.length] = this[i];
    }
    return true;
}
