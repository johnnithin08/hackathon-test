class CookieJarHandler extends TransactionHandler {
    // Constructor
    constructor(){
      super(CJ_FAMILY_NAME, ['1.0'], [CJ_NAMESPACE]);
    }
  
    // apply function
    apply(txProcessRequest, context) {
      console.log("txprocessrequest",txProcessRequest)
      const payload = txProcessRequest.payload;
      const update = _decodeRequest(payload);
      console.log("payload", update);
      const signerPK = txProcessRequest.header.signerPublicKey;
      let operationToExecute;
      let operationParameters;
      
  
      if(update.action == 'addnewproj') 
       {
        const projectDetails = {
          context : context,
          update, update,
          signerPK : signerPK
        }
        operationToExecute = addnewproject;
        operationParameters = projectDetails;
       }
      else if(update.action == 'addprojtender') 
       {
        const projectDetails = {
          context : context,
          update, update,
          signerPK : signerPK
        }
        operationToExecute = projectfortender;
        operationParameters = projectDetails;
       }
      else if(update.action == 'cbidtender') 
       {
        const projectDetails = {
          context : context,
          update, update,
          signerPK : signerPK
        }
        operationToExecute = bidfortender;
        operationParameters = projectDetails;
       }
      else if(update.action == 'c_upload_bill') 
       {
  
          const projectDetails = {
            context : context,
            update, update,
            signerPK : signerPK
          }
          operationToExecute = contractor_upload_bill;
          operationParameters = projectDetails;
        }
      else if(update.action == 'eapprove') 
        {
         const projectDetails = {
           context : context,
           update, update,
           signerPK : signerPK
         }
         operationToExecute = eapprove;
         operationParameters = projectDetails;
        }
      else if(update.action == 'p_approve_proj') 
        {
   
           const projectDetails = {
             context : context,
             update, update,
             signerPK : signerPK
           }
           operationToExecute = project_approve;
           operationParameters = projectDetails;
         }
      return operationToExecute(operationParameters);
    }
  }
  