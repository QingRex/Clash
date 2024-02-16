var Levi = JSON.parse($response.body);
Levi= {
     "alreadyPurchased": true
  };
$done({body: JSON.stringify(Levi)});