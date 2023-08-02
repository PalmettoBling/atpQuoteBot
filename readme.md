# Azure Functions ATProto Bots

Collection of Azure Function bots for AT Protocol.

* bsQuoteTimeFunction - Azure Function using a Time Trigger, set to every 3 hours on the hour, that posts a string from a random document from Azure Cosmos DB.

## Requirements

* '@atproto/api' - TypeScript protocol implementation from Bluesky PBLLC
* '@azure/cosmos' - TypeScript protocol implemenation for Azure CosmosDB from Microsoft.

## Instillation

Use npm install to install required libraries.

Include the Environment Variables in the Functions App "Configuration" Settings, as well as your local .env file to test locally

Update the 'function.json' file variable 'schedule' to fit your desired timing configuration using a 6 value cron expression 
* {second} {minute} {hour} {day} {month} {day of the week}


## Learn More At:

XboxPlaydates.org