// Copyright 2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

// Alexa SDK
const Alexa = require('ask-sdk');
const util = require('./util.js');
const constants = require('./constants');

/*
 * Common handler for informational requests, such as checking for the wifi password.
 */
function handleInfoRequest(handlerInput, intentName, outputPromptName) {
    const { attributesManager, responseBuilder } = handlerInput;
    const requestAttributes = attributesManager.getRequestAttributes();
    let sessionAttributes = attributesManager.getSessionAttributes();

    console.info(`${sessionAttributes[constants.STATE]}, intentName`);

    let repromptOutput = `${requestAttributes.t('PROMPT_MAIN_MENU')} ${requestAttributes.t('PROMPT_WHAT_CAN_I_HELP')}`;
    let speakOutput = `${requestAttributes.t(outputPromptName)} `;

    if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
        let template = require('./apl/headline.json');

        // Add the RenderDocument directive to the response
        handlerInput.responseBuilder.addDirective({
            type: 'Alexa.Presentation.APL.RenderDocument',
            document: template.document,
            datasources: {
                "headlineTemplateData": {
                    "backgroundImage": util.getS3PreSignedUrl(constants.IMAGES.LOBBY),
                    "text": "Welcome to My Hospital.",
                    "sub": " ",
                    "logoUrl": "",
                    "hintText": "Try, \"Alexa, start my day.\""
                }
            }
        });
    }

    let bEndSession = false;
    if (Alexa.isNewSession(handlerInput.requestEnvelope)) {
        bEndSession = true;
    }
    else {
        responseBuilder.reprompt(repromptOutput);
        speakOutput = speakOutput + " " + requestAttributes.t('PROMPT_WHAT_CAN_I_HELP');
    }
    return responseBuilder
        .withShouldEndSession(bEndSession)
        .speak(speakOutput)
        .getResponse();
}

/*
 * Common handler for requests that require a ticket to the hospital staff, such as a call for help.
 */
function handleStaffRequest(handlerInput, intentName, outputPromptName, outputPromptStaffMessageName) {
    const { attributesManager, responseBuilder } = handlerInput;
    const requestAttributes = attributesManager.getRequestAttributes();
    let sessionAttributes = attributesManager.getSessionAttributes();

    console.info(`${sessionAttributes[constants.STATE]}, intentName`);

    let repromptOutput = `${requestAttributes.t('PROMPT_MAIN_MENU')} ${requestAttributes.t('PROMPT_WHAT_CAN_I_HELP')}`;
    let speakOutput = `${requestAttributes.t(outputPromptName)}`;
    if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
        let template = require('./apl/headline.json');

        // Add the RenderDocument directive to the response
        handlerInput.responseBuilder.addDirective({
            type: 'Alexa.Presentation.APL.RenderDocument',
            document: template.document,
            datasources: {
                "headlineTemplateData": {
                    "backgroundImage": util.getS3PreSignedUrl(constants.IMAGES.NURSE),
                    "text": "The staff is on the way to help.",
                    "sub": " ",
                    "logoUrl": "",
                    "hintText": "Try, \"Alexa, play calming music.\""
                }
            }
        });
    } 
    notifyStaffByPrompt(handlerInput, outputPromptStaffMessageName);

    let bEndSession = false;
    if (Alexa.isNewSession(handlerInput.requestEnvelope)) {
        bEndSession = true;
    } else {
        responseBuilder.reprompt(repromptOutput);
        speakOutput = speakOutput + " " + requestAttributes.t('PROMPT_WHAT_CAN_I_HELP');
    }
    return responseBuilder
        .withShouldEndSession(bEndSession)
        .speak(speakOutput)
        .getResponse();
}

/*
 * Implement these functions so that a request can be sent to your property's staff. For example, it can be an 
 * API call to your facility's Emergency Medical Services (EMS); a text message to the nurse; etc.
 */
function notifyStaffByPrompt(handlerInput, outputPromptStaffMessageName) {
    const { attributesManager, responseBuilder } = handlerInput;
    const requestAttributes = attributesManager.getRequestAttributes();
    let sessionAttributes = attributesManager.getSessionAttributes();

    notifyStaffByMessage(handlerInput, `${requestAttributes.t(outputPromptStaffMessageName)}`);
}
function notifyStaffByMessage(handlerInput, outputStaffMessage) {
    // To be implemented
    console.info("Your specific notification logic would be sent here");
}


module.exports = {

    InfoAccessibilityIntentHandler: {
        canHandle(handlerInput) {
            return util.parseIntent(handlerInput) === 'InfoAccessibilityIntent';
        },
        handle(handlerInput) {
            return handleInfoRequest(handlerInput, 'InfoAccessibilityIntent', 'PROMPT_INFO_ACCESSIBILITY')
        }
    },

    InfoAddressIntentHandler: {
        canHandle(handlerInput) {
            return util.parseIntent(handlerInput) === 'InfoAddressIntent';
        },
        handle(handlerInput) {
            return handleInfoRequest(handlerInput, 'InfoAddressIntent', 'PROMPT_INFO_ADDRESS')
        }
    },

    InfoPhoneNumberIntentHandler: {
        canHandle(handlerInput) {
            return util.parseIntent(handlerInput) === 'InfoPhoneNumberIntent';
        },
        handle(handlerInput) {
            return handleInfoRequest(handlerInput, 'InfoPhoneNumberIntent', 'PROMPT_INFO_PHONE')
        }
    },

    InfoServicesIntentHandler: {
        canHandle(handlerInput) {
            return util.parseIntent(handlerInput) === 'InfoServicesIntent';
        },
        handle(handlerInput) {
            return handleInfoRequest(handlerInput, 'InfoServicesIntent', 'PROMPT_SERVICES')
        }
    },

    InfoWifiIntentHandler: {
        canHandle(handlerInput) {
            return util.parseIntent(handlerInput) === 'InfoWifiIntent';
        },
        handle(handlerInput) {
            return handleInfoRequest(handlerInput, 'InfoWifiIntent', 'PROMPT_INFO_WIFI')
        }
    },

    IntroductionIntentHandler: {
        canHandle(handlerInput) {
            return util.parseIntent(handlerInput) === 'IntroductionIntent';
        },
        handle(handlerInput) {
            return handleInfoRequest(handlerInput, 'IntroductionIntent', 'PROMPT_WHAT_CAN_I_HELP')
        }
    },

    BleedingIntentHandler: {
        canHandle(handlerInput) {
            return util.parseIntent(handlerInput) === 'BleedingIntent';
        },
        handle(handlerInput) {
            return handleStaffRequest(handlerInput, 'BleedingIntent', 'PROMPT_BLEEDING', 'PROMPT_STAFF_BLEEDING_MESSAGE')
        }
    },

    BloodPressureIntentHandler: {
        canHandle(handlerInput) {
            return util.parseIntent(handlerInput) === 'BloodPressureIntent';
        },
        handle(handlerInput) {
            return handleStaffRequest(handlerInput, 'BloodPressureIntent', 'PROMPT_BLOOD_PRESSURE', 'PROMPT_STAFF_BLOOD_PRESSURE_MESSAGE')
        }
    },

    BoredomIntentHandler: {
        canHandle(handlerInput) {
            return util.parseIntent(handlerInput) === 'BoredomIntent';
        },
        handle(handlerInput) {
            return handleStaffRequest(handlerInput, 'BoredomIntent', 'PROMPT_BOREDOM', 'PROMPT_STAFF_BOREDOM_MESSAGE')
        }
    },

    ToiletingIntentHandler: {
        canHandle(handlerInput) {
            return util.parseIntent(handlerInput) === 'ToiletingIntent';
        },
        handle(handlerInput) {
            return handleStaffRequest(handlerInput, 'ToiletingIntent', 'PROMPT_TOILETING', 'PROMPT_STAFF_BATHROOM_MESSAGE')
        }
    },

    TalkIntentHandler: {
        canHandle(handlerInput) {
            return util.parseIntent(handlerInput) === 'TalkIntent';
        },
        handle(handlerInput) {
            return handleStaffRequest(handlerInput, 'TalkIntent', 'PROMPT_TALK', 'PROMPT_STAFF_TALK_MESSAGE')
        }
    },

    SymptonsIntentHandler: {
        canHandle(handlerInput) {
            return util.parseIntent(handlerInput) === 'SymptonsIntent';
        },
        handle(handlerInput) {
            return handleStaffRequest(handlerInput, 'SymptonsIntent', 'PROMPT_SYMPTOMS', 'PROMPT_STAFF_UNWELL_MESSAGE')
        }
    },

    PainIntentHandler: {
        canHandle(handlerInput) {
            return util.parseIntent(handlerInput) === 'PainIntent';
        },
        handle(handlerInput) {
            return handleStaffRequest(handlerInput, 'PainIntent', 'PROMPT_PAIN', 'PROMPT_STAFF_PAIN_MESSAGE')
        }
    },

    RespirationIntentHandler: {
        canHandle(handlerInput) {
            return util.parseIntent(handlerInput) === 'RespirationIntent';
        },
        handle(handlerInput) {
            return handleStaffRequest(handlerInput, 'RespirationIntent', 'PROMPT_RESPIRATION', 'PROMPT_STAFF_RESPIRATION_MESSAGE')
        }
    },

    MedicationIntentHandler: {
        canHandle(handlerInput) {
            return util.parseIntent(handlerInput) === 'MedicationIntent';
        },
        handle(handlerInput) {
            return handleStaffRequest(handlerInput, 'MedicationIntent', 'PROMPT_MEDICATION', 'PROMPT_STAFF_MEDICATION_MESSAGE')
        }
    },

    MobilityIntentHandler: {
        canHandle(handlerInput) {
            return util.parseIntent(handlerInput) === 'MobilityIntent';
        },
        handle(handlerInput) {
            return handleStaffRequest(handlerInput, 'MobilityIntent', 'PROMPT_MOBILITY', 'PROMPT_STAFF_MOBILITY_MESSAGE')
        }
    },

    HelpEscortIntentHandler: {
        canHandle(handlerInput) {
            return util.parseIntent(handlerInput) === 'HelpEscortIntent';
        },
        handle(handlerInput) {
            return handleStaffRequest(handlerInput, 'HelpEscortIntent', 'PROMPT_ESCORT', 'PROMPT_STAFF_ESCORT_MESSAGE')
        }
    },

    HelpFallIntentHandler: {
        canHandle(handlerInput) {
            return util.parseIntent(handlerInput) === 'HelpFallIntent';
        },
        handle(handlerInput) {
            return handleStaffRequest(handlerInput, 'HelpFallIntent', 'PROMPT_FALL', 'PROMPT_STAFF_FALL_MESSAGE')
        }
    },

    HelpGeneralIntentHandler: {
        canHandle(handlerInput) {
            return util.parseIntent(handlerInput) === 'HelpGeneralIntent';
        },
        handle(handlerInput) {
            return handleStaffRequest(handlerInput, 'HelpGeneralIntent', 'PROMPT_HELP', 'PROMPT_STAFF_HELP_MESSAGE')
        }
    },

    HelpNeedBackupIntentHandler: {
        canHandle(handlerInput) {
            return util.parseIntent(handlerInput) === 'HelpNeedBackupIntent';
        },
        handle(handlerInput) {
            return handleStaffRequest(handlerInput, 'HelpNeedBackupIntent', 'PROMPT_HELP_NEED_BACKUP', 'PROMPT_STAFF_NURSE_BACKUP_MESSAGE')
        }
    },
    
    /*
     * Maintenance request for an object in the room (e.g. lights).
     */
    MaintenanceIntentHandler: {
        canHandle(handlerInput) {
            return util.parseIntent(handlerInput) === 'MaintenanceIntent';
        },
        handle(handlerInput) {
            const { attributesManager, responseBuilder } = handlerInput;
            const requestAttributes = attributesManager.getRequestAttributes();
            let sessionAttributes = attributesManager.getSessionAttributes();

            console.info(`${sessionAttributes[constants.STATE]}, MaintenanceIntent`);
            let apartmentItem = util.getSlotResolution(handlerInput, 'Room_Item');
            let repromptOutput = `${requestAttributes.t('PROMPT_MAIN_MENU')} ${requestAttributes.t('PROMPT_WHAT_CAN_I_HELP')}`;
            let speakOutput = `${requestAttributes.t('PROMPT_MAINTENANCE')} `;
            let messageBody = `${requestAttributes.t('PROMPT_STAFF_MAINTENANCE_MESSAGE')}`;

            // fix the item in the output string
            if ((apartmentItem) && (apartmentItem.length > 0)) {
                speakOutput = speakOutput.replace('APARTMENTITEM', apartmentItem);
                messageBody = messageBody .replace('APARTMENTITEM', apartmentItem);
            } else {
                speakOutput = speakOutput.replace('APARTMENTITEM', 'household item');
                messageBody = messageBody .replace('APARTMENTITEM', 'household item');
            }

            if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
                let template = require('./apl/headline.json');
            
                // Add the RenderDocument directive to the response
                handlerInput.responseBuilder.addDirective({
                    type: 'Alexa.Presentation.APL.RenderDocument',
                    document: template.document,
                    datasources: {
                        "headlineTemplateData": {
                            "backgroundImage": util.getS3PreSignedUrl(constants.IMAGES.REPAIR),
                            "text": "The maintenance staff is on the way to help.",
                            "sub": " ",
                            "logoUrl": "",
                            "hintText": "Try, \"Alexa, play calming music.\""
                        }
                    }
                });
            }
            notifyStaffByMessage(handlerInput, messageBody);

            let bEndSession = false;
            if (Alexa.isNewSession(handlerInput.requestEnvelope)) {
                bEndSession = true;
            }
            else {
                responseBuilder.reprompt(repromptOutput);
                speakOutput = speakOutput + " " + requestAttributes.t('PROMPT_WHAT_CAN_I_HELP');
            }
            return responseBuilder
                .withShouldEndSession(bEndSession)
                .speak(speakOutput)
                .getResponse();
        }
    }
};