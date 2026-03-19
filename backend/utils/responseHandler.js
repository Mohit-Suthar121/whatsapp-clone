const response = (res,message,statusCode,data=null)=>{
    if(!res){
        console.log("No response!");
        return;
    }
     const responseObject ={
        status:statusCode<400?"success":"error",
        message,
        data
     }

     return res.status(statusCode).json(responseObject);

}

export default response;



