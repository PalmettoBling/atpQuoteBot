const { BskyAgent } = require("@atproto/api");
const { CosmosClient } = require('@azure/cosmos');

const endpoint = process.env.AccountEndpoint;
const key = process.env.AccountKey;
const databaseName = process.env.DatabaseName;
const containerName = process.env.ContainerName; 
const cosmosClient = new CosmosClient({ endpoint, key });

module.exports = async function (context, myTimer) {
    var timeStamp = new Date().toISOString();

    const database = cosmosClient.database(databaseName);
    const container = database.container(containerName);

    // Query number of documents in database
    let quoteCount;
    let querySpec = {
        query: 'SELECT VALUE COUNT(1) FROM c'
    };
    let { resources } = await container.items.query(querySpec, {enableCrossPartitionQuery: true}).fetchAll().catch((error) => { Error(`Completed with error ${JSON.stringify(error)}`) });
    // verify there are documents in the database
    if (!resources) {
        quoteCount = 0;
    } else {
        quoteCount = resources[0];
    }
    //Generate random number from number of documents
    let randomNumInLimit = Math.floor(Math.random() * (quoteCount - 0 + 1)) + 0;
    // query the random document id generated
    querySpec = {
        query: `SELECT * FROM c WHERE c.id = '${randomNumInLimit}'`
    };
    let quoteData = await container.items.query(querySpec, {enableCrossPartitionQuery: true}).fetchAll().catch((error) => { Error(`Completed with error ${JSON.stringify(error)}`) });
    quoteData = quoteData.resources[0];

    // establishing BlueSky agent via atproto using environment secrets
    const agent = new BskyAgent({service: "https://bsky.social"});
    await agent.login({
        "identifier": process.env.ACCTID,
        "password": process.env.ACCTCRED,
    });
    // text formatting quote data from query
    let text = quoteData.id + `: ` + quoteData.quote + ` -` + quoteData.attribution + ` / ` + quoteData.game;

    // posting text to agent
    await agent.post( {text} )
    
    //documenting run
    if (myTimer.isPastDue)
    {
        context.log('JavaScript is running late!');
        context.log("This quote didn't run: ");
        context.log(text);
    }
    context.log("This quote ran: " + text + " at ", timeStamp);   
};