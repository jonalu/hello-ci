module.exports = {

  context: __dirname,

  entry: {
    javascript: "./app/client.js"
  },

  output: {
    filename: "pling.js",
    path: __dirname + "/public",
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ["babel-loader"],
        exclude: /node_modules/
      }
    ]
  }

}
