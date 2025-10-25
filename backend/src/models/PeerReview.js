// TODO: Implement PeerReview model
class PeerReview {
  constructor(attrs = {}) {
    this.id = attrs.id || null;
    this.review = attrs.review || '';
  }
}

module.exports = PeerReview;
