<?php
## Change next line with path to ini file. Ensure the ini file is not accessible via the public web
$config = parse_ini_file("ini/sherpait.ini");
$baseurl = $config["romeobaseurl"];
$apikey = $config["romeoapikey"];
$issns = explode(",",$_GET["issns"]);
//Need to loop round and create a json entry for each thing returned if not duplicated
//Then return complete JSON to sherpait.js to parse & display
$json_all = array();
foreach ($issns as $issn) {
	$json = array();
	$jtitle = "";
	$jissn = "";
	$sherpa_json = array();
	$name = "";
	$colour = "";
	$url = $baseurl."?versions=all&issn=".$issn."&ak=".$apikey;
	error_log($url);
	$curl_handle=curl_init();
	curl_setopt($curl_handle,CURLOPT_URL,$url);
	curl_setopt($curl_handle,CURLOPT_RETURNTRANSFER,true);
	curl_setopt($curl_handle,CURLOPT_FOLLOWLOCATION,true);
	$xml_data = curl_exec($curl_handle);
	curl_close($curl_handle);

	$xml = simplexml_load_string($xml_data);
	if ($xml->header->numhits[0] > 0) {
		$jtitle = (string) $xml->journals->journal[0]->jtitle;
		$jissn = (string) $xml->journals->journal[0]->issn;
		foreach ($json_all as $journal) {
			if ($jissn == $journal['issn']) {
				break 2;
			}
		}
		$json['jtitle'] = $jtitle;
		$json['issn'] = $jissn;
		foreach($xml->publishers->publisher as $publisher) {
			$name =  (string) $publisher->name;
			$colour = (string) $publisher->romeocolour;
			$sherpa_json =	array(
			              			publisher => $name, 
			              			colour=> $colour
			              		);
			$json[publishers] = array($sherpa_json); 
		}
	} else {
		$json['issn'] = $issn;
		$json['Error'] = "No Sherpa/RoMEO record found for ".$issn;
	}
	$json_all[] = $json;
}

$json_out[journals] = $json_all;
json_out($json_out);

function json_out($json) {
	$json = json_encode($json);
	header("Content-type: application/json");  
	echo $_GET['callback'] . ' (' . $json . ');';	
}


?>
