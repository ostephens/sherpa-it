<?php
$issn = $_GET["issn"];
$url = 'http://www.sherpa.ac.uk/romeo/api29/issn/'.$issn.'/';
error_log($url);
$curl_handle=curl_init();
curl_setopt($curl_handle,CURLOPT_URL,$url);
curl_setopt($curl_handle,CURLOPT_RETURNTRANSFER,true);
curl_setopt($curl_handle,CURLOPT_FOLLOWLOCATION,true);
$xml_data = curl_exec($curl_handle);
curl_close($curl_handle);

$xml = simplexml_load_string($xml_data);
error_log($xml);
if ($xml->header->numhits[0] > 0) {
	$jtitle = (string) $xml->journals->journal[0]->jtitle;
	$json['jtitle'] = $jtitle;
	foreach($xml->publishers->publisher as $publisher) {
		$name =  (string) $publisher->name;
		$colour = (string) $publisher->romeocolour;
		error_log(gettype($name));
		$sherpa_json =	array(
							publisher => $name, 
							colour=> $colour
						);
		$json[publishers] = array($sherpa_json); 
	}
} else {
	$json['Error'] = "No Sherpa/RomEO record found for ".$issn;
}

json_out($json);

function json_out($json) {
	$json = json_encode($json);
	header("Content-type: application/json");  
	echo $_GET['callback'] . ' (' . $json . ');';	
}


?>
