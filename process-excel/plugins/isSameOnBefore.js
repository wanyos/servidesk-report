export default (o, c, d) => {
    c.prototype.isSameOrBefore = function (date, unit) {
      return this.isBefore(d(date), unit) || this.isSame(d(date), unit);
    };
  };
  