const getJSON = async url => {
  const response = await fetch(url);
  if(!response.ok) // check if response worked (no 404 errors etc...)
    throw new Error(response.statusText);

  const data = response.json(); // get JSON from the response
  return data; // returns a promise, which resolves to this data value
}

console.log("Fetching data...");
getJSON("https://www.solaxcloud.com/proxyApp/proxy/api/getRealtimeInfo.do?tokenId=20221026130839175716859&sn=SVT7CYCWCP").then(data => {
  const result = data.result;
  console.log(result);
  console.log("this is the time: "+result.uploadTime);
}).catch(error => {
  console.error(error);
});