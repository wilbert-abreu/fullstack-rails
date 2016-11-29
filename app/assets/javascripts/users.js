/* global $, Stripe */
//Document ready.
document.addEventListener("turbolinks:load", function() {
  var doc = document,
      theForm = doc.querySelector('#pro_form'), 
      submitBtn = doc.querySelector('#form-submit-btn');
  //Set Stripe public key.
  Stripe.setPublishableKey( doc.querySelector('meta[name="stripe-key"]').getAttribute('content') );
  
  if (submitBtn) {
      //When user clicks form submit btn,
      submitBtn.addEventListener('click', function( event ) {
        //prevent default submission behavior.
        event.preventDefault();
        //Collect the credit card fields.
        var ccNum = doc.querySelector('#card_number').value,
            cvcNum = doc.querySelector('#card_code').value,
            expMonth = doc.querySelector('#card_month').value,
            expYear = doc.querySelector('#card_year').value;
        //Send the card info to Stripe.
        Stripe.createToken({
          number: ccNum,
          cvc: cvcNum,
          exp_month: expMonth,
          exp_year: expYear
        }, stripeResponseHandler);
      });
  }
  //Stripe will return a card token.
  //Inject card token as hidden field into form.
  //Submit form to our Rails app.
});