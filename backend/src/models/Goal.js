// TODO: Implement Goal model
class Goal {
  constructor(attrs = {}) {
    this.id = attrs.id || null;
    this.title = attrs.title || '';
  }
}

module.exports = Goal;
