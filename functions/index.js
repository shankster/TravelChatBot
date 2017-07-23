

process.env.DEBUG = 'actions-on-google:*';
const app = require('actions-on-google').ApiAiApp;
const functions = require('firebase-functions');
const requestGoogle = require('request');
const Promise = require('es6-promise').Promise;

exports.troute = functions.https.onRequest((request, response,tdata) => {

    const resp = 'This is just a reply from FireBase Function';
    const reqDat = request.body;
    const reLength=reqDat.result.parameters;
    const origin = reqDat.result.parameters.geo_city[0];
    const destination = reqDat.result.parameters.geo_city[1];
    const travelMode = 'driving';

    if(reLength.length < 2){
        console.log('Please enter in this format');
    }

    reqG(origin,destination).then((output) => {
    	console.log("In the returned promise "+output);
	    response.setHeader('Content-Type', 'application/json');
	    response.send(JSON.stringify({ 'speech': output, 'displayText': output }));
        //Demo Code
        app.ask(app.buildRichResponse()
    // Create a basic card and add it to the rich response

    .addSimpleResponse('Math and prime numbers it is!')
    .addBasicCard(app.buildBasicCard(`42 is an even composite number. It 
      is composed of three distinct prime numbers multiplied together. It 
      has a total of eight divisors. 42 is an abundant number, because the 
      sum of its proper divisors 54 is greater than itself. To count from 
      1 to 42 would take you about twenty-one…`)
      .setTitle('Math & prime numbers')
      .addButton('Read more')
      .setImage('https://example.google.com/42.png', 'Image alternate text')
    )
  );
        //End Demo Code








    }).catch((error) => {
    	response.setHeader('Content-Type', 'application/json');
	    response.send(JSON.stringify({ 'speech': error, 'displayText': error }));
    });
    });


    function reqG(orgD,destD){
    	return new Promise((resolve,reject) =>{
	    	var org=orgD;
	    	var dest=destD;
            

	    	const reqURL = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${org}&destinations=${dest}&key=AIzaSyDe1qSyIPvrhPcoNnVwU7Udehd5weN-6sI`;
			requestGoogle(reqURL, function(error, respon, body){

	        console.log('Making a request to Google Distance Matrix API');
	        const gJson = JSON.parse(body);

	        console.log(`Google JSON :${JSON.stringify(gJson)}`);
	        var distance = gJson.rows[0].elements[0].distance.text;
	        var duration = gJson.rows[0].elements[0].duration.text;

	        console.log(`Distance: ${distance}`);
	        console.log(`Duration: ${duration}`);

            var totText='It would take about '+duration+' to cover a distance of '+distance+' between '+org+' and '+dest;
	        console.log(totText);
	        if(error){
	        	return reject(error);
	        }
	        resolve(totText);
    	})

    });  
      	
    }

function basicCard (app) {
  app.ask(app.buildRichResponse()
    // Create a basic card and add it to the rich response

    .addSimpleResponse('Math and prime numbers it is!')
    .addBasicCard(app.buildBasicCard(`42 is an even composite number. It 
      is composed of three distinct prime numbers multiplied together. It 
      has a total of eight divisors. 42 is an abundant number, because the 
      sum of its proper divisors 54 is greater than itself. To count from 
      1 to 42 would take you about twenty-one…`)
      .setTitle('Math & prime numbers')
      .addButton('Read more')
      .setImage('https://example.google.com/42.png', 'Image alternate text')
    )
  );
}

