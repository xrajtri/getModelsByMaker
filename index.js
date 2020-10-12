const fetch = require("node-fetch");
let api = require("./config/config.json");
let responseModel = require("./models/responseModel.json");

async function getModelData(makerId){
    try{
        console.log("Calling api - "+api+makerId+"?format=json");
        const response = await fetch(api+makerId+"?format=json");
        const modelData = await response.json();
        let modelTempObj = {};
        let modelTempArray = [];
        modelData.Results.forEach(model => {
            modelTempArray.push(model.Model_Name);
        });
        modelTempObj.makerId = modelData.SearchCriteria.split(':')[1];
        modelTempObj.makerName = modelData.Results[0].Make_Name;
        modelTempObj.models = modelTempArray;
        return modelTempObj;
    }
    catch(error){
        console.log("Error occured!");
    }
}

exports.lambdaHandler = async(event) =>{
    if(!event && event != "" && event != null){
        console.log("Valid event submitted.");
        console.log("Event = "+event);
        if(!event.makerId && event.makerId != "" && event.makerId != null){
            console.log("event.makerId submitted. "+event.makerId);
            let makerId = event.makerId;
            let modelData = await getModelData(makerId);
            responseModel.body.status = "success";
            responseModel.body.response.makerId = modelData.makerId;
            responseModel.body.response.makerName = modelData.makerName;
            responseModel.body.response.modelData = modelData.models;
            return responseModel;
        }
        else{
            console.log("event.makerId not submitted.");
        }
    }
    else{
        console.log("Invalid event submitted.");
    }
}