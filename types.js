const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
	GraphQLList
} = require('graphql');

// Define Movie Type
movieType = new GraphQLObjectType({
    name: 'Movie',
    fields: {
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        year: { type: GraphQLInt } ,
        //directorId: { type: GraphQLID }
		synopsis: { type: GraphQLString },
        title: { type: GraphQLString },
		metascore: { type: GraphQLInt },
		link: { type: GraphQLString },
  // metascore: Int
  // synopsis: String
  // title: String
  // year: Int

    }
});
//Define Director Type
// directorType = new GraphQLObjectType({
    // name: 'Director',
    // fields: {
        // id: { type: GraphQLID },
        // name: { type: GraphQLString },
        // age: { type: GraphQLInt },
        // movies: {
            // type: new GraphQLList(movieType),
            // resolve(source, args) {
                // return _.filter(movies, { directorId: source.id });
            // }

        // }

    // }
// });

exports.movieType = movieType;