// TODO: Implement Challenge model
class Challenge {
  constructor(attrs = {}) {
    this.id = attrs.id || null;
    this.title = attrs.title || '';
  }
}

module.exports = Challenge;
