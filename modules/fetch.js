module.exports  = async function (token,Url,method,payload,next) {
    try {
     
        const options = {
          method: method || 'GET', // Default to GET if method is not provided
          headers: {
            'Content-Type':'application/json', // Set content type to JSON
            "auth": token,
          }
        };
    
        if (payload) {
          options.body = JSON.stringify(payload); // Include payload in request body if provided
        }
    
        const response = await fetch(Url, options);
        const data = await response.json();
        if(response.status === 401){
          next(undefined,response);
        }
        
        next(data,response); // Send data to the next function
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
}
  