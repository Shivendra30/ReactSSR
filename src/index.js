// We can use ES6 syntax on our server since we are using webpack and babel
import "babel-polyfill";
import express from "express";
import renderer from "./helpers/renderer";
import { matchRoutes } from "react-router-config";
import Routes from "./client/Routes";
import createStore from "./helpers/createStore";
import proxy from "express-http-proxy";

const app = express();
//All /api requests from the browser will be sent to our API server
app.use(
  "/api",
  proxy("http://react-ssr-api.herokuapp.com/", {
    proxyReqOptDecorator(opts) {
      //change any request options before proxying the request
      // eg - header, method, etc
      opts.headers["x-forwarded-host"] = "localhost:3000"; //for the google oauth flow
      return opts;
    }
  })
);

app.use(express.static("public"));

app.get("*", async (req, res) => {
  const store = createStore(req);

  const promises = matchRoutes(Routes, req.path)
    .map(({ route }) => {
      return route.loadData ? route.loadData(store) : null;
    })
    .map(promise => {
      if (promise) {
        //resolve the promise no matter what
        return new Promise((resolve, reject) =>
          promise.then(resolve).catch(resolve)
        );
      }
    });

  await Promise.all(promises);

  const context = {};
  const content = renderer(req, store, context);
  if (context.url) return res.redirect(301, context.url);
  if (context.notFound) res.status(404);

  res.send(content);
});

app.listen(3000, () => {
  console.log("App listening on port 3000");
});
