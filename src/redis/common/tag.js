

module.exports = (methods, tag) => Object.keys(methods).reduce((p, c) => Object.assign(p, { [c]: methods[c](tag) }), {})