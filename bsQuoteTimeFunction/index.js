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
    
    let min = 0;
    let quoteCount;
    let resource; 
    let querySpec = {
        query: 'SELECT VALUE COUNT(1) FROM c'
    };
    let { resources } = await container.items.query(querySpec, {enableCrossPartitionQuery: true}).fetchAll().catch((error) => { Error(`Completed with error ${JSON.stringify(error)}`) });
    context.log("Resource: ");
    
    if (!resources) {
        quoteCount = 0;
    } else {
        quoteCount = resources[0];
    }

    let randomNumInLimit = Math.floor(Math.random() * (quoteCount - min + 1)) + min;
    context.log("Random Number? " + randomNumInLimit);
    
    querySpec = {
        query: `SELECT * FROM c WHERE c.id = '${randomNumInLimit}'`
    };
    let quoteData = await container.items.query(querySpec, {enableCrossPartitionQuery: true}).fetchAll().catch((error) => { Error(`Completed with error ${JSON.stringify(error)}`) });
    quoteData = quoteData.resources[0];
    context.log(JSON.stringify(quoteData));
    
    const agent = new BskyAgent({service: "https://bsky.social"});
    await agent.login({
        "identifier": process.env.ACCTID,
        "password": process.env.ACCTCRED,
    });
    let text = quoteData.id + `: ` + quoteData.quote + ` -` + quoteData.attribution + ` / ` + quoteData.game;

    await agent.post( {text} )
    
    if (myTimer.isPastDue)
    {
        context.log('JavaScript is running late!');
    }
    context.log('JavaScript timer trigger function ran!', timeStamp);   
};