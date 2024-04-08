<?php

class Stripe
{
    const SECRET_KEY = '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';
    const AMOUNT = '1.49';
    const CURRENCY = 'usd';
    const API_URL = 'https://api.stripe.com/v1/payment_intents';

    public function createPayment(string $method, string $contentType)
    {
        if ($method !== 'POST' || $contentType !== 'application/json') {
            return [
                'code' => '422',
                'message' => 'Invalid data',
            ];
        }

        $jsonData = file_get_contents('php://input');
        $data = json_decode($jsonData, true);

        $params = [
            'amount' => $data['amount'],
            'currency' => self::CURRENCY,
            'payment_method_types[]' => 'card',
            'metadata' => $data,
        ];

        $query = http_build_query($params);

        $ch = curl_init(self::API_URL);

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer " . self::SECRET_KEY]);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $query);

        $response = curl_exec($ch);
        $info = curl_getinfo($ch);
        $error = curl_error($ch);

        if ($info['http_code'] !== 200) {
            return [
                'code' => $info['http_code'],
                'message' => 'Error',
                'apiResponse' => json_decode($response, true),
            ];
        } else {
            $responseData = json_decode($response, true);

            return [
                'code' => '200',
                'message' => 'Success',
                'client_secret' => $responseData['client_secret'],
                'apiResponse' => $responseData,
            ];
        }
    }
}

header('Content-Type: application/json');
http_response_code(200);

$stripe = new Stripe();
$response = $stripe->createPayment($_SERVER['REQUEST_METHOD'], $_SERVER['HTTP_CONTENT_TYPE']);

echo json_encode($response);