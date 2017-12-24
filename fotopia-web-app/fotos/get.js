import  dynamodb from './lib/dynamodb';

export const getItem = (event, context, callback) => {
  console.log('get', event, context);
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      userid: event.pathParameters.userid,
      birthtime: event.pathParameters.birthtime * 1
    },
  };

  // fetch foto from the database
  dynamodb.get(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the foto item.',
      });
      return;
    }
    console.log('get response', result);
    const body =  result.Item ? JSON.stringify(result.Item) : JSON.stringify(`No item found for ${event.pathParameters.userid} & ${event.pathParameters.birthtime}`);

    // create a response
    const response = {
      statusCode: 200,
      body
    };
    callback(null, response);
  });
};
