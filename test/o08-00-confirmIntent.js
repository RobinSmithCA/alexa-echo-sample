/* Copyright 2017 S & G Consulting - http://computingdreams.com/ */
/* Version : 0.0.1 */

var expect = require( 'chai' ).expect,
    lambda = require( '../src/index.js' )

const context = require( 'aws-lambda-mock-context' );
const ctx = context();

describe( 'O8 - 00 - When testing confirmations', function() {  
    var speechResponse = null
    var speechError = null

    // Fires once for the group of tests, done is mocha's callback to 
    // let it know that an   async operation has completed before running the rest 
    // of the tests, 2000ms is the default timeout though
    before( function( done ) {
        //This fires the event as if a Lambda call was being sent in
        lambda.handler( {
           "session": {
              "new": true,
              "sessionId": "session1234",
              "attributes": {
                 "sessionCount": 30,
                 "firstSession": "Wed, 17 May 2017 11:44:57 GMT",
                 "lastSession": "Mon, 12 Jun 2017 01:43:28 GMT",
                 "name": " ",
                 "nextState" : " ",
              },
              "user": {
                 "userId": "testUser"
              },
              "application": {
                 "applicationId": "amzn1.ask.skill.94faefe4-49dd-4ec2-8bf9-2a18fa4b8024"
              }
           },
           "version": "1.0",
           "request": {
              "locale": "en-US",
              "type": "IntentRequest",
              "requestId": "request5678",
              "intent": {
                 "name": "ConfirmIntent",
                 "confirmationStatus": "NONE",
                 "slots": {}
              }
           }
       },ctx )

       //Captures the response and/or errors
       ctx.Promise
           .then( resp => { speechResponse = resp; done(); } )
           .catch( err => { speechError = err; done();} )
    } )


    describe( 'The response is structurally correct for Alexa Speech Services', function() {
        it( 'should not have errored',function() { expect ( speechError ).to.be.null } )

        it( 'should have a version', function() { expect( speechResponse.version ).not.to.be.null } )

        it( 'should have a speechlet response', function() { expect( speechResponse.response ).not.to.be.null } )

        it( 'should have session attributes', function() { expect( speechResponse.sessionAttributes ).not.to.be.null } )

        it( 'should leave the Alexa session open', function() {
            expect( speechResponse.response.shouldEndSession ).not.to.be.null
            expect( speechResponse.response.shouldEndSession ).to.be.false
        } )
    } )

    describe( 'Attributes are completely defined', function() {
        it( 'sessionCount is 30', function() {
            expect( speechResponse.sessionAttributes.sessionCount ).not.to.be.undefined
            expect( speechResponse.sessionAttributes.sessionCount ).to.equal( 30 )
        } )

        it( 'lastSession has value', function() {
            expect( speechResponse.sessionAttributes.lastSession ).not.to.be.undefined
            expect( speechResponse.sessionAttributes.lastSession ).not.to.be.null
        } )

        it( 'firstSession has value', function() {
            expect( speechResponse.sessionAttributes.firstSession ).not.to.be.undefined
            expect( speechResponse.sessionAttributes.firstSession ).not.to.be.null
        } )

        it( 'name is blank', function() {
            expect( speechResponse.sessionAttributes.name ).not.to.be.undefined
            expect( speechResponse.sessionAttributes.name ).to.equal( ' ' )
        } )

        it( 'nextState exists', function() {
            expect( speechResponse.sessionAttributes.nextState ).not.to.be.undefined
            expect( speechResponse.sessionAttributes.nextState ).to.equal( ' ' )
        } )
    } )

    describe( 'Directives response is as expected', function() {
        it( 'directives exists', function() {
            expect( speechResponse.response.directives ).not.to.be.undefined
            expect( speechResponse.response.directives ).not.to.be.null
        } )

        it( 'directives has length 1', function() {
            expect( speechResponse.response.directives ).to.have.lengthOf( 1 )
        } )

        it( 'directives[ 0 ] type is Dialog.ConfirmIntent', function() {
            expect( speechResponse.response.directives[ 0 ].type ).not.to.be.undefined
            expect( speechResponse.response.directives[ 0 ].type ).not.to.be.null
            expect( speechResponse.response.directives[ 0 ].type ).equals( 'Dialog.ConfirmIntent' )
        } )
    } )

    describe( 'Speech response is as expected', function() {
        it( 'output speech exists', function() {
            expect( speechResponse.response.outputSpeech ).not.to.be.undefined
            expect( speechResponse.response.outputSpeech ).not.to.be.null
        } )

        it( 'output speech is ssml', function() {
            expect( speechResponse.response.outputSpeech.type ).not.to.be.undefined
            expect( speechResponse.response.outputSpeech.type ).to.equal( 'SSML' )
        } )

        it( 'output ssml contains new game empty player message', function() {
            expect( speechResponse.response.outputSpeech.ssml ).not.to.be.undefined
            expect( speechResponse.response.outputSpeech.ssml ).not.to.be.null
            expect( speechResponse.response.outputSpeech.ssml ).equals( "<speak> Do you want to continue? </speak>" )
        } )
    } )

    describe( 'Speech reprompt response is as expected', function() {
        it( 'output speech exists', function() {
            expect( speechResponse.response.reprompt.outputSpeech ).not.to.be.undefined
            expect( speechResponse.response.reprompt.outputSpeech ).not.to.be.null
        } )

        it( 'reprompt output speech is ssml', function() {
            expect( speechResponse.response.reprompt.outputSpeech.type ).not.to.be.undefined
            expect( speechResponse.response.reprompt.outputSpeech.type ).to.equal( 'SSML' )
        } )

        it( 'reprompt output ssml contains new game empty player message', function() {
            expect( speechResponse.response.reprompt.outputSpeech.ssml ).not.to.be.undefined
            expect( speechResponse.response.reprompt.outputSpeech.ssml ).not.to.be.null
            expect( speechResponse.response.reprompt.outputSpeech.ssml ).equals( "<speak> Continue, yes or no? </speak>" )
        } )
    } )
} )
