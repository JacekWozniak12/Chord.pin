const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = {
    watch: true,
    mode: "production",

    resolve: {
        modules: 
        [path.resolve(__dirname, './node_modules/tone/*'), 'node_modules'],
        extensions: [".tsx", ".ts", ".js", ".json"]
    },
    
    entry: path.resolve(__dirname, 'src') + "/ts/app.ts",
    
    output:{
        filename: "index.js",
        path: path.resolve(__dirname, './docs')
    },

    plugins: [
        new CopyPlugin({
            patterns:
            [
            { from: "src/*.html",
              to: "",
              flatten: true}
            ]
        })
    ],

    devtool: "inline-source-map",

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: ["ts-loader"],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                  // Creates `style` nodes from JS strings
                  {
                    loader: "style-loader"
                    // options: {
                    //   // injectType: "singletonStyleTag"
                    //   // injectType: "linkTag"
                    // }
                  },
                  // Translates CSS into CommonJS
                  "css-loader",
                  // Compiles Sass to CSS
                  "sass-loader"
                ]
            },    
        ]
    },
  };