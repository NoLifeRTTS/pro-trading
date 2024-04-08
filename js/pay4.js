
let price = Number(localStorage.getItem('amount'))/100;
$('.sectionPay__card .tariff').text(`$${price}`);
let pricedel = price;
price *=100;
planPrice = `${price}`;

let prodName = localStorage.getItem('product_name');
$('.sectionPay__vip .vip p').text(`${prodName}`);
$('.product_name').val(prodName);

let isUsd = true;
$('.sectionPay__vip .usd div .text .top').click(function(){
    $('.sectionPay__vip .usd div .text .bot').toggleClass('active');
});
$('.sectionPay__vip .usd div .text .bot').click(function(){
    if (isUsd) {
        let pricePeso = pricedel * 20;
        $('.sectionPay__card .tariff').text(`MXP ${pricePeso}`);
        $('.sectionPay__vip .usd div .text .top span').text('PESO');
        $('.sectionPay__vip .usd div .text .bot').text('USD');
        isUsd = false;
    }
    else {
        $('.sectionPay__card .tariff').text(`$${pricedel}`);
        $('.sectionPay__vip .usd div .text .top span').text('USD');
        $('.sectionPay__vip .usd div .text .bot').text('PESO');
        isUsd = true;
    }
    $('.sectionPay__vip .usd div .text .bot').toggleClass('active');
});

function TimerBlock() {
    let timerHour = $('#clock').data('hour');
    let timeMinutes = $('#clock').data('minutes');
    let time = (timerHour * 60 + timeMinutes) * 60000;
    let fiveSeconds = new Date().getTime() + time;

    $('#clock')
      .countdown(fiveSeconds, {
        elapse: true,
      })
      .on('update.countdown', function (event) {
        let $this = $(this);
        if (event.elapsed) {
          $this.html('00:00');
        } else {
          $this.html(
            event.strftime(
              `<ul>
                                <li><span id="hours">%H h </span></li>
                                <li><sup> :</sup></li>
                                <li><span id="minutes">%M m </span></li>
                                <li><sup> :</sup></li>
                                <li><span id="seconds">%S s </span></li>
                           </ul>`,
            ),
          );
        }
      });
  }
  TimerBlock();


const stripeBtn = document.querySelector('.btn-opl');
const PUBLISHABLE_KEY = 'pk_live_PnXRLRwVcPBYyoaAWWaEJxDK00Fq7wGY8a';

let cardElement;
let cardElement2;
let cardElement3;

const stripe = Stripe(PUBLISHABLE_KEY, {
    locale: 'EN',
    apiVersion: "2020-08-27",
});

//АВТОВЫПОЛНЯЕТСЯ <---------------------------------------------------!!!!!!!!!!!!!!!!!!!!!
(function initStripe() {
    const elements = stripe.elements();

    cardElement = elements.create('cardNumber');
    cardElement2 = elements.create("cardExpiry");
    cardElement3 = elements.create("cardCvc");

    cardElement.mount('#card-element');
    cardElement2.mount('#card-element2');
    cardElement3.mount('#card-element3');

    cardElement.on('change', function (event) {
        const displayError = document.getElementById('card-errors');
        if (event.error) {
            displayError.textContent = 'Your card number is invalid.';
            Object.assign(displayError.style, {
                color: '#f00',
                fontSize: '16px',
                marginBottom: '5px',
            });
            stripeBtn.disabled = true;
        } else {
            displayError.textContent = '';
            Object.assign(displayError.style, {
                color: '#fa755a',
                iconColor: '#fa755a',
            });
            stripeBtn.disabled = false;
        }
    });

})();

async function onPayClick() {
    stripeBtn.disabled = true;
    stripeBtn.style.display = "none"
    $('.modal-loader').css('display', 'flex');
    try {

        const response = await fetch('stripe.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                site: window.location.href,
                amount: `${localStorage.getItem('amount')}`
            })
        }).then(res => res.json()).then(data =>
            stripe
            .confirmCardPayment(data.client_secret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        email: `${$('.yourEmail input').val()}`,
                    }
                },
            })
            .then((result) => {
                if (result.error) {
                    return;
                }
                setTimeout(() => {
                    window.location.href = 'thanks-quiz.html'
                }, 10000)
            }))

    } catch (error) {
        stripeBtn.style.display = "block"
        $('.modal-loader').css('display', 'none');
    }

}

stripeBtn.addEventListener('click', () => {
    $.ajax({
        url: 'bitrixPay.php',
        method: 'post',
        data: {
            product_name: $('.product_name').val(),
            email: $('.email-inp').val(),
            telegram: $('.telegram-inp').val(),
            clientName: $('.name-inp').val(),
        },
        success: function() {
            onPayClick();
        }
    });
})

// создаем объект запроса платежа
var paymentRequest = stripe.paymentRequest({
    country: 'US',
    currency: 'usd',
    total: {
        label: 'BETTERME',
        amount: +planPrice
    },
    requestPayerEmail: true,
});


// создаем нашу кнопку оплаты
const elements = stripe.elements();
const prButton = elements.create('paymentRequestButton', {
    paymentRequest: paymentRequest,
    allow: "paymentmethod",
});

// проверка на возможность оплаты и подлкюченную карту оплаты скрываем открываем кнопку
paymentRequest.canMakePayment().then(function (result) {
    if (result && result.applePay == true) {
        prButton.mount('#payment-request-button-apple');
        prButton.on('click', () => {
        })
    } else if (result && result.googlePay == true) {
        prButton.mount('#payment-request-button');
        prButton.on('click', () => {
        })
    }
});


// subscribe and check payment for Vean
async function quizCheckoutPayment(paymentMethod) {
    let response = await fetch('stripe.php', {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({
                is_agree_research_policy: true,
                stripe_payment_method_id: paymentMethod,
                site: window.location.href
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
        .then((resp) => resp.json())
        .then((json) => json)
        .catch((error) => {
            console.error('Error:', error);
        });

    return response;

}

paymentRequest.on('paymentmethod', async function (ev) {
    stripeBtn.style.display = "none"
    $('.main-loader').css('display', 'flex');
    const response = await fetch('stripe.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            paymentMethodType: 'card',
            currency: 'usd',
            site: window.location.href,
            amount: `${localStorage.getItem('amount')}`
        })
    }).then(res => res.json()).then(data => stripe.confirmCardPayment(
        data.client_secret, {
            payment_method: ev.paymentMethod.id
        }, {
            billing_details: {
                email: `${localStorage.getItem('email')}`,
            }
        }, {
            handleActions: false
        }
    ).then(function (confirmResult) {
        if (confirmResult.error) {
            ev.complete('fail');
        } else {
            ev.complete('success');

            setTimeout(() => {
                window.location.href = 'thanks-quiz.html'
            }, 10000)

            // Check if the PaymentIntent requires any actions and if so let Stripe.js
            // handle the flow. If using an API version older than "2019-02-11"
            // instead check for: `paymentIntent.status === "requires_source_action"`.
            if (confirmResult.paymentIntent.status === "requires_action") {
                // Let Stripe.js handle the rest of the payment flow.
                stripe.confirmCardPayment(clientSecret).then(function (result) {
                    if (result.error) {
                        // The payment failed -- ask your customer for a new payment method.
                    } else {
                        // The payment has succeeded.
                    }
                });
            } else {
                // The payment has succeeded.
            }
        }
    }))
    localStorage.setItem('resp', JSON.stringify(response));
});