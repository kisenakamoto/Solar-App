let solar = {
  fetchSolar: async function () {
    const response = await fetch(
      "https://corsproxy.io/?https%3A%2F%2Fwww.solaxcloud.com%2FproxyApp%2Fproxy%2Fapi%2FgetRealtimeInfo.do%3FtokenId%3D20221026130839175716859%26sn%3DSVT7CYCWCP",
      { credentials: "omit" }
    );
    if (!response.ok) {
      alert("Failed to get result.");
      throw new Error("Failed to get result.");
    }
    return await response.json();
  },

  fetchBin: async function () {
    const response = await fetch("https://api.jsonbin.io/v3/b/640af76bebd26539d08c35d6/latest", {
      headers: {
        "X-Master-Key": "$2b$10$C0BFb/UlbWDerSGQdx9vquHOxkKBJRjWWz80GqpqMpfLPU2IbJqey",
      },
    });
    return await response.json();
  },

  updateBin: async function (requestData) {
    const binId = "640af76bebd26539d08c35d6";
    const apiKey = "$2b$10$C0BFb/UlbWDerSGQdx9vquHOxkKBJRjWWz80GqpqMpfLPU2IbJqey";
    // const requestData = JSON.stringify({"sample": "123"});

    const response1 = await fetch(`https://api.jsonbin.io/v3/b/${binId}/latest`, {
      headers: {
        "X-Master-Key": apiKey,
      },
    });

    if (response1.ok) {
      const existingData = await response1.json();
      const mergedData = Object.assign(existingData.record, JSON.parse(requestData));
      const response2 = await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Master-Key": apiKey,
        },
        body: JSON.stringify(mergedData),
      });
      if (response2.ok) {
        console.log("Data saved successfully!");
      } else {
        console.log("Failed to save data.");
      }
    } else {
      console.log("Failed to get existing data.");
    }
  },

  displaySolar: function () {
    Promise.all([this.fetchSolar(), this.fetchBin()])
      .then(([solarData, binData]) => {
    const result = binData.record;
    const { uploadTime, yieldtotal, feedinenergy, consumeenergy } = solarData.result;
  
    //monthly variables
    let importprev = result.importprev;
    let exportprev = result.exportprev; 
    let yieldprev = result.yieldprev;
    let savingsprev = result.savingsprev;
    let importrate = result.importrate; 
    let exportrate = result.exportrate; 
    let billupdated = result.billupdated;

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

    //Change Bill month
    if (day >=9){
      if (d.getMonth()<11){
        month = monthname[d.getMonth() + 1];
        }
        else{
          month = monthname[d.getMonth() - 11];
        }
    }
    
    //Change billupdated value every 9th
    if (day>=9 && billupdated==true){
      const requestData = JSON.stringify({"billupdated": false});
      this.updateBin(requestData);
      alert(`Bill updated: False`);
      
  }

    //Update the variable values every 8th
    if (day==8 && time>11 && billupdated==false){
      const requestData = JSON.stringify({
        "billupdated": true,
        "importprev": consumeenergy,
        "exportprev": feedinenergy,
        "yieldprev": yieldtotal,
        "savingsprev": (savingsprev + monthlysavings)
      });
      this.updateBin(requestData);
      alert("Variables updated!");
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

      })
      .catch((error) => {
        console.error(error);
      });
  },
    
};

solar.displaySolar();
