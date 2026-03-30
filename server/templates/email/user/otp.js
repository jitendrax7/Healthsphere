const otpTemplate = (data) => {

    return {

        subject: "Your OTP Code",

        html: `

<h2>Your OTP: ${data.otp}</h2>

<p>This OTP expires in 5 minutes.</p>

`

    };

};

export default otpTemplate;