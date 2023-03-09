// const getJSON = async url => {
//   const response = await fetch(url);
//   if(!response.ok) // check if response worked (no 404 errors etc...)
//     throw new Error(response.statusText);

//   const data = response.json(); // get JSON from the response
//   return data; // returns a promise, which resolves to this data value
// }

// console.log("Fetching data...");
// getJSON("https://www.solaxcloud.com/proxyApp/proxy/api/getRealtimeInfo.do?tokenId=20221026130839175716859&sn=SVT7CYCWCP").then(data => {
//   const result = data.result;
//   console.log(result);
//   console.log("this is the time: "+result.uploadTime);
// }).catch(error => {
//   console.error(error);
// });

let solar = {
  fetchSolar: function () {
    fetch(
      "https://corsproxy.io/?https%3A%2F%2Fwww.solaxcloud.com%2FproxyApp%2Fproxy%2Fapi%2FgetRealtimeInfo.do%3FtokenId%3D20221026130839175716859%26sn%3DSVT7CYCWCP", 
      {credentials: "omit"}
      )
      .then((response) => {
        if (!response.ok) {
          alert("Failed to get result.");
          throw new Error("Failed to get result.");
        }
        return response.json();
      })
      .then((data) => this.displaySolar(data));
  },
  displaySolar: function (data) {
    const { uploadTime, yieldtotal, feedinenergy, consumeenergy } = data.result;
    //monthly variables
    let importprev = 1159.49 
    let exportprev = 554.76 
    let yieldprev = 1098.5 
    let savingsprev = 9523.52
    let importrate = 11.26 
    let exportrate = 6.92 

    let currentimport = consumeenergy - importprev;
    let currentexport = feedinenergy - exportprev;
    let bill = currentimport * importrate;
    let exportsavings = currentexport * exportrate;
    let totalbill = bill - exportsavings;
    let selfusesavings = (yieldtotal - yieldprev - currentexport) * importrate;
    let monthlysavings = selfusesavings + exportsavings;

    let totalsavings = selfusesavings + exportsavings + savingsprev;

    const monthname = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    
    const d = new Date();
    let month = monthname[d.getMonth()];
    let day = d.getDate();
    let time = d.getHours();

    console.log(`day: ${day} time: ${time}`);

    if (day >=9){
      if (d.getMonth()<11){
        month = monthname[d.getMonth() + 1];
        }
        else{
          month = monthname[d.getMonth() - 11];
        }
    }


    document.querySelector(".bill").innerText =
      "₱ " + Math.round(totalbill * 100) / 100;
    document.querySelector(".meralco").innerText = "Meralco Bill for " + month;
    document.querySelector(".uptime").innerText = "Updated: " + uploadTime;
    document.querySelector(".prebill").innerText =
      "Import Cost: " +"\n" + "₱ " + Math.round(bill * 100) / 100;
    document.querySelector(".export").innerText =
      "Export Savings: " +"\n" + "₱ " + Math.round(exportsavings * 100) / 100;
    document.querySelector(".selfuse").innerText =
      "Self-Use Savings: " +"\n" + "₱ " + Math.round(selfusesavings * 100) / 100;
    document.querySelector(".monthly").innerText =
      "Monthly Savings: " +"\n" + "₱ " + Math.round(monthlysavings * 100) / 100;
    document.querySelector(".overall").innerText =
      "Overall Savings: " +"\n" + "₱ " + Math.round(totalsavings * 100) / 100;
    document.querySelector(".solar").classList.remove("loading");
    //   document.body.style.backgroundImage =
    //     "url('https://source.unsplash.com/1600x900/?" + name + "')";
  },
};

solar.fetchSolar();
