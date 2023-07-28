const { BskyAgent } = require ("@atproto/api");

// process.env.PUBLICKEY

module.exports = async function (context, myTimer) {
    var timeStamp = new Date().toISOString();

    let quote = context.bindings.documents;
    context.log("Quote ID: " + quote.id);
    let id = quote.id;
    context.log("Quote: " + quote.quote);
    let quoteText = quote.quote;
    context.log("Quote Attribution: " + quote.attribution);
    let attribution = quote.attribution;
    context.log("Quote game: " + quote.game);
    let game = quote.game;

    const agent = new BskyAgent({ service: "https://bsky.social" });
    await agent.login({
        identifier: process.env.ACCTNAME,
        password: process.env.ACCTCRED,
    });

    await agent.post( quote.id + `: ` + quote.quote + ` -` + quote.attribution + ` / ` + quote.game)
    
    if (myTimer.isPastDue)
    {
        context.log('JavaScript is running late!');
    }
    context.log('JavaScript timer trigger function ran!', timeStamp);   
};