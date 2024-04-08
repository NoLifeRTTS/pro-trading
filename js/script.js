// swiper

const swiper = new Swiper('.section10__content', {
    slidesPerView: 3,
    spaceBetween: 150,
    loop: true,
  
    pagination: {
      el: '.swiper-pagination',
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 100,
      },
      925: {
        slidesPerView: 2,
        spaceBetween: 80,
      },
      1300: {
        slidesPerView: 2,
        spaceBetween: 100,
      },
      1600: {
        slidesPerView: 3,
        spaceBetween: 150,
      },
    }
  
  });

  $('.btn-flag1').click(function(){
    let top = $('.section2').offset().top;
    $("*").animate({scrollTop:top},1000);
  });
  $('.btn-flag2').click(function(){
    let top = $('.section9').offset().top;
    $("*").animate({scrollTop:top},1000);
  });

  $('.btn-1').click(function(){
    localStorage.setItem('amount', '5000');
    localStorage.setItem('product_name', 'Base');
    window.location.href = 'pay.html';
  });
  $('.btn-2').click(function(){
    localStorage.setItem('amount', '10000');
    localStorage.setItem('product_name', 'Con comentarios de Alejandro');
    window.location.href = 'pay.html';
  });
  $('.btn-3').click(function(){
    localStorage.setItem('amount', '50000');
    localStorage.setItem('product_name', 'Curadora + mentoría (VIP)');
    window.location.href = 'pay.html';
  });

  let arrWhite = [];
     let arrBlue = [];
     let arrPurple = [];
     let thisColor;
   
     function pushColors(color) {
       if (color == "white") {
         arrWhite.push(color);
       }
       else if (color == "blue") {
         arrBlue.push(color);
       }
       else if (color == "purple") {
         arrPurple.push(color);
       }
     }
     
     function maxArr(mas1, mas2, mas3) {
       let maxLen = Math.max(mas1.length, mas2.length, mas3.length);
       if (maxLen === mas1.length) {
         return 'blue';
       }
       else if (maxLen === mas2.length) {
         return 'purple';
       }
       else if (maxLen === mas3.length) {
         return 'white';
       }
     }
   
     $('.test__answer').click(function(){
       let thisAnswer = $(this);
       thisColor = $(this).data('color');
   
       $('.test__answer .answer').css('border', 'none');
       $('.test__answer .number h1').css('font-weight', '250');
       $(thisAnswer).children('.answer').css('border', '3px solid #F0C428');
       $(thisAnswer).children('.number').children('h1').css('font-weight', 'bold');
       $(thisAnswer).parent().parent().children('.test__btn').children('.btn-next').prop('disabled', false);
     });
   
     $('.btn-next').click(function(){
       let thisBtn = $(this);
       let testLen = $('.test__block').length;
       let thisTest = $(thisBtn).parent().parent().parent().data('id');
       let numbTest = Number(thisTest.substr(4));
   
       pushColors(thisColor);
       if (numbTest === 10) {
         $('div[data-id=test'+numbTest+']').fadeOut();
         setTimeout(function(){
           $('[data-id=test'+(++numbTest)+']').css('display', 'flex');
           let finalColor = maxArr(arrBlue, arrPurple, arrWhite);
           if (finalColor == 'white') {
             $('.test__result p').text('¡Felicidades! Tienes todo lo necesario para ser un comerciante. Te falta un poco de sistematización y conocimientos financieros, pero estás muy motivado para tener éxito. Seguro que conseguirás tus objetivos. Nuestro curso de formación te ayudará a desarrollar tu potencial.');
           }
           else if (finalColor == 'blue') {
             $('.test__result p').text('Eres creativo, confías en tu intuición y puedes reaccionar rápidamente. Puedes ver el panorama general y arreglártelas bien con grandes cantidades de información. La formación te permitirá aprender a centrarte en la comprensión del mercado para crear nuevas ideas');
           }
           else if (finalColor == 'purple') {
             $('.test__result p').text('¡Tienes talento para el comercio de acciones! Parece que eres un comerciante nato, eres capaz de ganar una importante suma de dinero, utilizando tus habilidades de la mejor manera posible. La formación sólo te fortalecerá.');
           }
         }, 500);
       }
       else if (numbTest !== testLen) {
         $('div[data-id=test'+numbTest+']').fadeOut();
         setTimeout(function(){
           $('[data-id=test'+(++numbTest)+']').css('display', 'flex');
         }, 500);
       }
       else {
         $('.test__bg').fadeOut();
       }
     });
   
     $('.test__close').click(function(){
       let thisBlock = $(this).parent().data('id');
       if (thisBlock == 'test11') {
         $('.test__bg').fadeOut();
         $('.test__block').css('display', 'none');
         $('[data-id=test1]').css('display', 'flex');
         $('.test').fadeOut();
       }
       else {
         $('.test__bg').fadeOut();
         $('.test').fadeOut();
       }
     });
   
     $('.btn-test button').click(function(){
       if (window.screen.width < 450) {
         $('[data-id=test1]').children('.test__left').css('display', 'block');
         $('[data-id=test1]').children('.test__right').css('display', 'none');
       }
       $('.test__bg').fadeIn();
       $('.test').fadeIn();
     });
   
     $('.arrow .block').click(function(){
       $('[data-id=test1]').children('.test__left').css('display', 'none');
       $('[data-id=test1]').children('.test__right').css('display', 'block');
     });

     setTimeout(function(){
      $('.modal').css('display', 'flex');
      $('.modal__bg').fadeIn();
     },40000);
     $('.modal__close').click(function(){
        $('.modal').fadeOut();
        $('.modal__bg').fadeOut();
     });

     $('.btn-popup2 button').click(function(){
        $('.popup').css('display', 'flex');
        $('.popup__bg').fadeIn();
     });
     $('.popup__close').click(function(){
        $('.popup').fadeOut();
        $('.popup__bg').fadeOut();
     });

     $('.btn-form').click(function() {
       let inp = $(this).parent().parent().children('.inp').children('input').val();
       $.ajax({
        url: 'bitrixPopUp.php',
        method: 'post',
        data: {
          telegram: inp,

        },
        success: function() {
            $('.modal').fadeOut();
            $('.modal__bg').fadeOut();
            $('.test').fadeOut();
            $('.test__bg').fadeOut();
            $('.popup').fadeOut();
            $('.popup__bg').fadeOut();
        }
    });
     })