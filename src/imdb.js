const cheerio = require('cheerio');
const fetch = require('node-fetch');
const pLimit = require('p-limit');
const pSettle = require('p-settle');
const {IMDB_NAME_URL, IMDB_URL, P_LIMIT} = require('./constants');

const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

const CONNECTION_URL = "mongodb+srv://Lala:Hiba@cluster0-nkn7j.mongodb.net/test?retryWrites=true";
const DATABASE_NAME = "movies";

var app = Express();

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

app.listen(9292, () => {
    MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
        if(error) {
            throw error;
        }
        database = client.db(DATABASE_NAME);
        collection = database.collection(DATABASE_NAME);
        console.log("Connected to `" + DATABASE_NAME + "`!");
    });
});

app.post("/movies", (request, response) => {
    collection.insert(request.body, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result.result);
    });
});


app.get("/movies", (request, response) => {
    collection.find({}).toArray((error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});


/**
 * Get filmography for a given actor
 * @param  {String}  actor - imdb id
 * @return {Array}
 */
const getFilmography = async actor => {
  const response = await fetch(`${IMDB_NAME_URL}/${actor}`);
  const body = await response.text();
  const $ = cheerio.load(body);

  return $('#filmo-head-actor + .filmo-category-section .filmo-row b a')
    .map((i, element) => {
      return {
        'link': `${IMDB_URL}${$(element).attr('href')}`,
        'title': $(element).text()
      };
    })
    .get();
};

const getMovie = async link => {
  const response = await fetch(link);
  const body = await response.text();
  const $ = cheerio.load(body);

  return {
    link,
    'id': $('meta[property="pageId"]').attr('content'),
    'metascore': Number($('.metacriticScore span').text()),
    'poster': $('.poster img').attr('src'),
    'rating': Number($('span[itemprop="ratingValue"]').text()),
    'synopsis': $('.summary_text').text().trim(),
    'title': $('.title_wrapper h1').text().trim(),
    'votes': Number($('span[itemprop="ratingCount"]').text().replace(',', '.')),
    'year': Number($('#titleYear a').text())
  };
};

module.exports = async actor => {
  const limit = pLimit(P_LIMIT);
  const filmography = await getFilmography(actor);

  const promises = filmography.map(filmo => {
    return limit(async () => {
      return await getMovie(filmo.link);
    });
  });

  const results = await pSettle(promises);
  const isFulfilled = results.filter(result => result.isFulfilled).map(result => result.value);

  return [].concat.apply([], isFulfilled);
};
