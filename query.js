const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
	GraphQLList
} = require('graphql');
const _ = require('lodash');
const {movieType} = require('./types.js');
//let {movies} = require('./data.js');

//Define the Query
const queryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
        // hello: {
            // type: GraphQLString,

            // resolve: function () {
                // return "Hello World";
            // }
        // }
		moviesid: { //find a movie by id
            type: movieType,
            args: {
                id: { type: GraphQLString }
            },
            resolve: function (source, args) {
                return _.find(moviesid, { id: args.id });
            }
        },
		moviespopulate:{//populate the whole table
          type: GraphQLString,
          resolve: async () => {
            const movies = await imdb('nm0000243');
            collection.insertMany(movies, (error, result) => {
                if(error) {
                    return response.status(500).send(error);
                }

            });
            return result;
          }
        },
        movies:{//get juste one element
          type: movieType,
          resolve: async () => {
                  const res = await collection.aggregate([{ $match: { "metascore": {$gt:70}}}, { $sample: { size: 1 }}]).toArray()
                  return res //res[0]
          },
        },
		search:{
          type: GraphQLList(movieType),
          args:{
            limit: {type : GraphQLInt},
            metascore: {type : GraphQLInt}
          },
          resolve : async (source, args) => {
                
			  var limit = 5, metascore = 0;
				if(args.limit != undefined){
				  limit = args.limit;
				  // console.log(typeof(limit));
				// console.log(limit);
				}
				if(args.metascore != undefined){
				  metascore = args.metascore;
				  // console.log(typeof(metascore));
				  // console.log(metascore);
				}
				var result = collection.aggregate([ {$match : {metascore : {$gt:Number(metascore)} }},{$sort : {"metascore" : -1}} ] ).limit(Number(limit)).toArray((error, result) => {
					if(error) {
						return response.status(500).send(error);
					}
					return result;
				});
        }
		// director: {
            // type: directorType,
            // args: {
                // id: { type: GraphQLInt }
            // },
            // resolve: function (source, args) {
                // return _.find(directors, { id: args.id });
            // }
        // }
    }
}
});

exports.queryType = queryType;