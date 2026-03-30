const welcomeTemplate = (data) => {

    return {

        subject: "Welcome to HealthSphere",

        html: `

<h2>Hello ${data.name}</h2>

<p>Your account has been created successfully.</p>

<p>We are happy to have you.</p>

`

    };

};

export default welcomeTemplate;