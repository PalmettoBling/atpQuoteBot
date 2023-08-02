# TimerTrigger - JavaScript

The `TimerTrigger` makes it incredibly easy to have your functions executed on a schedule. This sample demonstrates a simple use case of calling your function every 5 minutes.

## How it works

For a `TimerTrigger` to work, you provide a schedule in the form of a [cron expression](https://en.wikipedia.org/wiki/Cron#CRON_expression)(See the link for full details). A cron expression is a string with 6 separate expressions which represent a given schedule via patterns. The pattern we use to represent every 5 minutes is `0 */5 * * * *`. This, in plain text, means: "When seconds is equal to 0, minutes is divisible by 5, for any hour, day of the month, month, day of the week, or year".

First we establish our constant variables.  Then we connect to the Azure Cosmos DB Container and set up the ATProto agent using atuorization from our environment variables.  Then we query the number of documents in the Database container and select a random number between that count and zero.  We query the container for that ID number, then format the string and post to the agent.


## Learn more

<TODO> Documentation