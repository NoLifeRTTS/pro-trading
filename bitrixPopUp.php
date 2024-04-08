<?php

class bitrixPopUp
{
    public $url = 'https://influencers.bitrix24.ru/rest/28/5pa3ljzdmydxib1x/';

    public function addDealPopUp()
    {
        $queryUrl = 'crm.deal.add.json';

        $telegram = $_POST['telegram'];

        $fields = [
            'TITLE' => "Telegram/whatsapp: $telegram ",
            "STAGE_ID" => "C20:NEW",
            "ASSIGNED_BY_ID" => "186",
            "CATEGORY_ID" => "20",
            "UF_CRM_1645785165546" => $telegram,
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

$bitrixPopUp = new bitrixPopUp();

$response = $bitrixPopUp->addDealPopUp();

echo json_encode($response);
