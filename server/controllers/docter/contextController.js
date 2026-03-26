



export const getcontext = async (req, res) => {

  try { 
    const userId = req.user._id;

    res.json({
            _id: userId,

            location:  {

                city: "satna",
                latitude: null,
                longitude: null,
            },

            theme: "system",

            language: "en",

            timezone: "Asia/Kolkata",

            notificationCount: 5  
        });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch settings"
    });

  }
};
 