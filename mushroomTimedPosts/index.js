const { BskyAgent, RichText } = require("@atproto/api");
const { createClient } = require("pexels");
const { axios } = require("axios");

module.exports = async function (context, myTimer) {
    var timeStamp = new Date().toISOString();

    // establishing Pexels agent via atproto using environment secrets
    const client = createClient(`${process.env.PEXELSTOKEN}`);
    const query = 'wild mushrooms';
    
    let randomNumInLimit = Math.floor(Math.random() * (80 - 0 + 1)) + 0;
    context.log('random number:', randomNumInLimit);
    let randomMushroom = await client.photos.search({ query, per_page: 80 });
    let chosenMushroom = randomMushroom.photos[randomNumInLimit];

    context.log('chosen mushroom:', JSON.stringify(chosenMushroom));

    // establishing BlueSky agent via atproto using environment secrets
    const agent = new BskyAgent({service: "https://bsky.social"});
    await agent.login({
        "identifier": process.env.MUSHROOMACCTID,
        "password": process.env.MUSHROOMACCTCRED,
    });

    const imageBlobRefs = [];
    const responseBuffer = await axios.get(chosenMushroom.src.original, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(responseBuffer);
    const imageBlobResponse = await agent.uploadBlob({ blob: imageBuffer, encoding: 'image/png' });
    imageBlobRefs.push(imageBlobResponse.data.blob);

    const imagesEmbed = imageBlobRefs.map(blobRef => {
        let altText = `${chosenMushroom.alt}`;

        return {
            $type: 'app.bsky.embed.image',
            image: blobRef,
            alt: altText
        };
    });

    const postText = `Mushrooms are weird.\n\nPhotographer: ${chosenMushroom.photographer}\nPhotos provided by Pexels.com`
    const rt = new RichText({ text: postText });
    await rt.detectFacets(agent);

    const postRecord = {
        $type: 'app.bsky.feed.post',
        text: rt.text,
        facets: rt.facets,
        embed: {
            $type: 'app.bsky.embed.images',
            images: imagesEmbed
        },
        createdAt: new Date().toISOString()
    };

    const response = await agent.post(postRecord);
    context.log('Posted:', response);
    
    if (myTimer.isPastDue)
    {
        context.log('JavaScript is running late!');
    }
    context.log('JavaScript timer trigger function ran!', timeStamp);   
};