// TODO: Implement User model
class User {
  constructor(attrs = {}) {
    this.id = attrs.id || null;
    this.email = attrs.email || '';
  }
}

module.exports = User;
