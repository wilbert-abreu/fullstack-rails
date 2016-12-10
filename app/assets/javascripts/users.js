/* global $, Stripe */
//Document ready.
var append = function( el, appendEl ) {
    if ( typeof appendEl === 'string' ) {
      el.insertAdjacentHTML( 'beforeend', appendEl );
    } else {
      el.appendChild( appendEl );
    }
};


document.addEventListener("turbolinks:load", function() {
  var doc = document,
      theForm = doc.querySelector('#pro_form'), 
      submitBtn = doc.querySelector('#form-signup-btn');
  //Set Stripe public key.
  Stripe.setPublishableKey( doc.querySelector('meta[name="stripe-key"]').getAttribute('content') );
  
  if (submitBtn) {
      //When user clicks form submit btn,
      submitBtn.addEventListener('click', function( event ) {
        //prevent default submission behavior.
        event.preventDefault();
        submitBtn.value = "Processing";
        submitBtn.disabled = true;
        //Collect the credit card fields.
        var ccNum = doc.querySelector('#card_number').value,
            cvcNum = doc.querySelector('#card_code').value,
            expMonth = doc.querySelector('#card_month').value,
            expYear = doc.querySelector('#card_year').value;
        //Use Stripe JS library to check for card errors.
        var error = false;
        //Validate card number.
        if(!Stripe.card.validateCardNumber(ccNum)) {
          error = true;
          alert('The credit card number appears to be invalid');
        }
        //Validate CVC number.
        if(!Stripe.card.validateCVC(cvcNum)) {
          error = true;
          alert('The CVC number appears to be invalid');
        }
        //Validate expiration date.
        if(!Stripe.card.validateExpiry(expMonth, expYear)) {
          error = true;
          alert('The expiration date appears to be invalid');
        }
        if (error) {
          //If there are card errors, don't send to Stripe.
          submitBtn.disabled = false;
          submitBtn.value = "Sign Up";
        } else {
          //Send the card info to Stripe.
          Stripe.createToken({
            number: ccNum,
            cvc: cvcNum,
            exp_month: expMonth,
            exp_year: expYear
          }, stripeResponseHandler);
        }
        return false;
      });
  }
  
  //Stripe will return a card token.
  function stripeResponseHandler(status, response) {
    //Get the token from the response.
    var token = response.id;
    //Inject the card token in a hidden field.
    append( theForm, '<input type="hidden" name="user[stripe_card_token]" value="'+ token +'">' );
    //Submit form to our Rails app.
    theForm.submit();
  }
  
});
