<?php

class bitrixPay
{
    public $url = 'https://influencers.bitrix24.ru/rest/28/5pa3ljzdmydxib1x/';

    public function addDealPay()
    {
        $queryUrl = 'crm.deal.add.json';

        $productName = $_POST['product_name'];
        $email = $_POST['email'];
        $telegram = $_POST['telegram'];
        $clientName = $_POST['client_name'];

        $fields = [
            'TITLE' => "Email: $email",
            "STAGE_ID" => "C20:WON",
            "ASSIGNED_BY_ID" => "186", 
            "CATEGORY_ID" => "20",
            "UF_CRM_1610625458001" => $productName,
            "UF_CRM_1645785139839" => $email,
            "UF_CRM_1645785165546" => $telegram,
            "UF_CRM_1648214601924" => $clientName,
        ];

        $queryData = http_build_query(
            [
                'fields' => $fields,
                'params' => [
                    'REGISTER_SONET_EVENT' => 'Y'
                ]
            ]
        );

        $data = $this->getCurl($queryUrl, $queryData);
        return $data['result'];
    }

    public function getCurl($queryUrl, $queryData)
    {
        $curl = curl_init();
        curl_setopt_array($curl, array(
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_POST => 1,
            CURLOPT_HEADER => 0,
            CURLOPT_RETURNTRANSFER => 1,
            CURLOPT_URL => $this->url . $queryUrl,
            CURLOPT_POSTFIELDS => $queryData,
        ));

        $result = curl_exec($curl);
        curl_close($curl);

        return json_decode($result, true);
    }
}

$bitrixPay = new bitrixPay();

$response = $bitrixPay->addDealPay();

echo json_encode($response);