// TODO: Implement Leaderboard model
class Leaderboard {
  constructor(attrs = {}) {
    this.id = attrs.id || null;
    this.rankings = attrs.rankings || [];
  }
}

module.exports = Leaderboard;
