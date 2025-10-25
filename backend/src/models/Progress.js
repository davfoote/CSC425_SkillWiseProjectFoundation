// TODO: Implement Progress model
class Progress {
  constructor(attrs = {}) {
    this.id = attrs.id || null;
    this.percent = attrs.percent || 0;
  }
}

module.exports = Progress;
