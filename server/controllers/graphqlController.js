import { graphql } from 'graphql';
import { schema } from '../services/graphqlService.js';

export const graphqlController = async (req, res) => {
  const { query } = req.body;

  try {
    const result = await graphql({ schema, source: query });
    res.json(result);
  } catch (error) {
    console.error('GraphQL Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
