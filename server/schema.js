export const typeDefs = `#graphql
  type RadarItem {
    Name: String
    Quadrant: String
    Status: String
  }

  type Query {
    radarData: [RadarItem]
  }
`;
