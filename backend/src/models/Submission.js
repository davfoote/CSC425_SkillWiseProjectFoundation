// TODO: Implement Submission model
class Submission {
  constructor(attrs = {}) {
    this.id = attrs.id || null;
    this.challengeId = attrs.challengeId || null;
  }
}

module.exports = Submission;
