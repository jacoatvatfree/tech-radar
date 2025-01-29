import { makeExecutableSchema } from '@graphql-tools/schema';
import { typeDefs } from '../schema.js';

const radarData = [
  { Name: 'React', Quadrant: 'Techniques', Status: 'Trial' },
  { Name: 'GraphQL', Quadrant: 'Techniques', Status: 'Assess' },
  { Name: 'Node.js', Quadrant: 'Platforms', Status: 'Hold' },
  { Name: 'Docker', Quadrant: 'Tools', Status: 'Trial' },
];


const resolvers = {
  Query: {
    radarData: () => radarData,
  },
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
