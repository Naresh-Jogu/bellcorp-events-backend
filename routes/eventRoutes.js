const express = require("express")
const Event = require("../models/Event")
const User = require("../models/User")
const authMiddleware = require("../middleware/authMiddleware")

const router = express.Router()

// GET /api/events?search=&category=&location=&date=

router.get("/", async(request, response)=>{
    const {search, category, location, date} = request.query
    
    let query = {};

    if(search){
        query.name ={$regex: search, $options:"i"}
    }

    if(category){
        query.category = category
    }

    if(location){
        query.location = location
    }

    if(date){
        const start = new Date(date)
        const end = new Date(date)
        end.setHours(23, 59, 59, 999)
        query.datetime = {$gte: start, $lte: end}
    }

    try {

      const page = parseInt(request.query.page) || 1
      const limit = parseInt(request.query.limit) || 10 

      const skip = (page - 1) * limit

        const events = await Event.find(query).sort({ datetime: 1 }).skip(skip).limit(limit);

        const totalEvents = await Event.countDocuments()

        response.json({
          currentPage : page,
          totalPages: Math.ceil(totalEvents / limit),
          totalEvents,
          events,
        });
    } catch (err) {
        response.status(500).json({ message: "Server Error" });
    }
})



// GET /api/events/:id
router.get("/:id", authMiddleware, async (request, response) => {
  try {
    const event = await Event.findById(request.params.id);
    if (!event) {
      return response.status(404).json({ message: "Event not found" });
    }

    const user = await User.findById(request.user.id);

    const isRegistered = user.registeredEvents.some(
      (eId) => eId.toString() === event._id.toString()
    );

    response.json({
      ...event.toObject(),
      isRegistered,
    });
  } catch (err) {
    response.status(500).json({ message: "Server Error" });
  }
});


// POST /api/events/:id/register

router.post("/:id/register", authMiddleware, async(request, response)=>{
    try{
        const event = await Event.findById(request.params.id)
        const user = await User.findById(request.user.id)

        if(!event){
            return response.status(404).json({message: "Event not found"})
        }

        if(event.registeredCount >= event.capacity){
            return response.status(400).json({message: "Event is full"})
        }

        if(user.registeredEvents.includes(event._id)){
            return response.status(400).json({message: "Already registered"})
        }

        event.registeredCount += 1 
        await event.save()

        user.registeredEvents.push(event._id)
        await user.save()

        response.json({message: "Registered Successfully"})

    }catch(err){
        response.status(500).json({message: "Server Error"})
    }
})

// POST /api/events/:id/cancel

router.post("/:id/cancel", authMiddleware, async(request, response)=>{
    try{
        const event = await Event.findById(request.params.id)
        const user = await User.findById(request.user.id)

        if(!event){
            return response.status(404).json({message: "Event not found"})
        }

        user.registeredEvents = user.registeredEvents.filter(
            (eId) => eId.toString() !== event._id.toString()
        )
        await user.save()


        event.registeredCount = Math.max(0, event.registeredCount - 1);
        await event.save()

        response.json({message: "Registration cancelled" })
    }catch(err){
        response.status(500).json({message: "Server Error"})
    }
})


// GET /api/events/my/registered

router.get("/my/registered", authMiddleware, async(request, response)=>{
    try{
        const user = await User.findById(request.user.id).populate("registeredEvents")
        response.json(user.registeredEvents)

    }catch(err){
        response.status(500).json({message: "Server Error"})
    }
})




// TEMP: Seed sample events (use once, then you can delete it)

// TEMP: Seed sample events (use once)
router.post("/seed", async (req, res) => {
  try {
    await Event.deleteMany();

   const events = await Event.insertMany([{
    name: "MERN Stack Workshop",
    organizer: "NXtwave",
    location: "Hyderabad",
    datetime: new Date("2026-01-02T10:00:00"),
    description: "Learn best practices for MERN stack development",
    capacity: 50,
    category: "Tech",
    registeredCount: 0
  },
  {
    name: "React Conference 2026",
    organizer: "ReactOrg",
    location: "Bangalore",
    datetime: new Date("2026-03-10T11:00:00"),
    description: "Deep dive into React ecosystem",
    capacity: 100,
    category: "Tech",
    registeredCount: 0
  },
  {
    name: "Digital Marketing Bootcamp",
    organizer: "MarketGurus",
    location: "Mumbai",
    datetime: new Date("2026-02-15T09:30:00"),
    description: "Master social media and SEO strategies",
    capacity: 40,
    category: "Marketing",
    registeredCount: 0
  },
  {
    name: "Yoga & Wellness Retreat",
    organizer: "ZenLife",
    location: "Rishikesh",
    datetime: new Date("2026-04-01T06:00:00"),
    description: "Relax, rejuvenate, and learn wellness techniques",
    capacity: 30,
    category: "Health",
    registeredCount: 0
  },
  {
    name: "Photography Masterclass",
    organizer: "ShutterPro",
    location: "Delhi",
    datetime: new Date("2026-05-20T14:00:00"),
    description: "Learn professional photography skills",
    capacity: 25,
    category: "Art",
    registeredCount: 0
  },
  {
    name: "Blockchain Summit",
    organizer: "CryptoWorld",
    location: "Bengaluru",
    datetime: new Date("2026-06-12T10:00:00"),
    description: "Explore blockchain and cryptocurrency innovations",
    capacity: 80,
    category: "Tech",
    registeredCount: 0
  },
  {
    name: "Cooking Workshop: Italian Cuisine",
    organizer: "ChefMaster",
    location: "Pune",
    datetime: new Date("2026-07-05T15:00:00"),
    description: "Learn to cook authentic Italian dishes",
    capacity: 20,
    category: "Food",
    registeredCount: 0
  },
  {
    name: "Startup Pitch Day",
    organizer: "InnovateHub",
    location: "Chennai",
    datetime: new Date("2026-08-18T13:00:00"),
    description: "Pitch your startup ideas to investors",
    capacity: 60,
    category: "Business",
    registeredCount: 0
  },
  {
    name: "AI & Machine Learning Workshop",
    organizer: "TechLabs",
    location: "Hyderabad",
    datetime: new Date("2026-09-10T09:00:00"),
    description: "Hands-on learning of AI & ML techniques",
    capacity: 50,
    category: "Tech",
    registeredCount: 0
  },
  {
    name: "Creative Writing Seminar",
    organizer: "WordSmiths",
    location: "Kolkata",
    datetime: new Date("2026-10-22T11:00:00"),
    description: "Improve your storytelling and writing skills",
    capacity: 35,
    category: "Art",
    registeredCount: 0
  },{
    name: "Frontend Development Bootcamp",
    organizer: "CodeAcademy",
    location: "Bangalore",
    datetime: new Date("2026-02-20T10:00:00"),
    description: "Learn HTML, CSS, and JavaScript in depth",
    capacity: 50,
    category: "Tech",
    registeredCount: 0
  },
  {
    name: "Virtual Reality Workshop",
    organizer: "VRInnovators",
    location: "Pune",
    datetime: new Date("2026-03-15T14:00:00"),
    description: "Hands-on VR app development",
    capacity: 30,
    category: "Tech",
    registeredCount: 0
  },
  {
    name: "Fitness Challenge Camp",
    organizer: "FitLife",
    location: "Delhi",
    datetime: new Date("2026-04-10T06:30:00"),
    description: "A week-long fitness bootcamp",
    capacity: 40,
    category: "Health",
    registeredCount: 0
  },
  {
    name: "Photography for Beginners",
    organizer: "ClickMasters",
    location: "Mumbai",
    datetime: new Date("2026-05-05T10:00:00"),
    description: "Introductory course for photography enthusiasts",
    capacity: 25,
    category: "Art",
    registeredCount: 0
  },
  {
    name: "Entrepreneurship 101",
    organizer: "BizSchool",
    location: "Chennai",
    datetime: new Date("2026-06-22T11:00:00"),
    description: "Learn the basics of starting your own business",
    capacity: 60,
    category: "Business",
    registeredCount: 0
  },
  {
    name: "Advanced Python Programming",
    organizer: "CodeLabs",
    location: "Hyderabad",
    datetime: new Date("2026-07-18T09:00:00"),
    description: "Deep dive into Python for web and AI applications",
    capacity: 50,
    category: "Tech",
    registeredCount: 0
  },
  {
    name: "Meditation & Mindfulness Retreat",
    organizer: "PeaceNow",
    location: "Rishikesh",
    datetime: new Date("2026-08-10T06:00:00"),
    description: "Relax and learn mindfulness techniques",
    capacity: 30,
    category: "Health",
    registeredCount: 0
  },
  {
    name: "Gourmet Baking Workshop",
    organizer: "BakeStudio",
    location: "Kolkata",
    datetime: new Date("2026-09-05T15:00:00"),
    description: "Learn to bake artisan bread and pastries",
    capacity: 20,
    category: "Food",
    registeredCount: 0
  },
  {
    name: "Digital Illustration Masterclass",
    organizer: "Artify",
    location: "Bangalore",
    datetime: new Date("2026-10-12T13:00:00"),
    description: "Learn digital drawing and illustration techniques",
    capacity: 25,
    category: "Art",
    registeredCount: 0
  },
  {
    name: "Social Media Marketing Seminar",
    organizer: "BrandBoost",
    location: "Mumbai",
    datetime: new Date("2026-11-01T11:00:00"),
    description: "Grow your brand online with social media strategies",
    capacity: 40,
    category: "Marketing",
    registeredCount: 0
  },{
    name: "Cybersecurity Essentials",
    organizer: "SecureTech",
    location: "Bangalore",
    datetime: new Date("2026-01-15T10:00:00"),
    description: "Learn how to protect systems and data from cyber threats",
    capacity: 60,
    category: "Tech",
    registeredCount: 0
  },
  {
    name: "Graphic Design Workshop",
    organizer: "DesignHub",
    location: "Mumbai",
    datetime: new Date("2026-02-20T13:00:00"),
    description: "Hands-on learning of Photoshop and Illustrator",
    capacity: 30,
    category: "Art",
    registeredCount: 0
  },
  {
    name: "Entrepreneurship Meetup",
    organizer: "StartUp Connect",
    location: "Chennai",
    datetime: new Date("2026-03-10T11:00:00"),
    description: "Networking and sharing ideas for new entrepreneurs",
    capacity: 50,
    category: "Business",
    registeredCount: 0
  },
  {
    name: "Mobile App Development Bootcamp",
    organizer: "AppMasters",
    location: "Hyderabad",
    datetime: new Date("2026-04-05T09:00:00"),
    description: "Learn to build iOS and Android apps from scratch",
    capacity: 40,
    category: "Tech",
    registeredCount: 0
  },
  {
    name: "Mindfulness & Meditation Workshop",
    organizer: "CalmSpace",
    location: "Rishikesh",
    datetime: new Date("2026-05-12T06:30:00"),
    description: "Learn meditation techniques to reduce stress",
    capacity: 25,
    category: "Health",
    registeredCount: 0
  },
  {
    name: "Creative Writing Bootcamp",
    organizer: "WordCrafters",
    location: "Kolkata",
    datetime: new Date("2026-06-18T10:00:00"),
    description: "Improve your writing, storytelling, and poetry skills",
    capacity: 35,
    category: "Art",
    registeredCount: 0
  },
  {
    name: "Food & Wine Tasting Event",
    organizer: "GourmetLife",
    location: "Pune",
    datetime: new Date("2026-07-22T16:00:00"),
    description: "Experience exquisite food paired with wines",
    capacity: 20,
    category: "Food",
    registeredCount: 0
  },
  {
    name: "AI in Business Seminar",
    organizer: "TechFuture",
    location: "Bangalore",
    datetime: new Date("2026-08-15T11:00:00"),
    description: "How artificial intelligence is transforming industries",
    capacity: 50,
    category: "Tech",
    registeredCount: 0
  },
  {
    name: "Social Media Content Workshop",
    organizer: "ContentCreators",
    location: "Mumbai",
    datetime: new Date("2026-09-10T14:00:00"),
    description: "Learn to create engaging content for social platforms",
    capacity: 40,
    category: "Marketing",
    registeredCount: 0
  },
  {
    name: "Public Speaking Masterclass",
    organizer: "SpeakUp",
    location: "Delhi",
    datetime: new Date("2026-10-05T10:00:00"),
    description: "Develop confidence and communication skills",
    capacity: 30,
    category: "Business",
    registeredCount: 0
  }, {
    name: "Cloud Computing Workshop",
    organizer: "CloudTech",
    location: "Bangalore",
    datetime: new Date("2026-11-12T09:00:00"),
    description: "Learn AWS, Azure, and Google Cloud fundamentals",
    capacity: 50,
    category: "Tech",
    registeredCount: 0
  },
  {
    name: "Illustration & Sketching Bootcamp",
    organizer: "ArtNest",
    location: "Mumbai",
    datetime: new Date("2026-12-05T13:00:00"),
    description: "Hands-on practice in sketching and digital illustration",
    capacity: 30,
    category: "Art",
    registeredCount: 0
  },
  {
    name: "Nutrition & Healthy Eating Seminar",
    organizer: "HealthFirst",
    location: "Delhi",
    datetime: new Date("2026-11-20T10:00:00"),
    description: "Learn nutrition planning and healthy eating habits",
    capacity: 40,
    category: "Health",
    registeredCount: 0
  },
  {
    name: "Video Editing Masterclass",
    organizer: "FilmPro",
    location: "Chennai",
    datetime: new Date("2026-12-18T15:00:00"),
    description: "Edit professional videos using Adobe Premiere Pro",
    capacity: 25,
    category: "Art",
    registeredCount: 0
  },
  {
    name: "E-commerce Strategies Seminar",
    organizer: "ShopSmart",
    location: "Bangalore",
    datetime: new Date("2026-11-25T11:00:00"),
    description: "Boost online sales with proven e-commerce strategies",
    capacity: 60,
    category: "Business",
    registeredCount: 0
  },
  {
    name: "Photography Expedition",
    organizer: "SnapShot",
    location: "Rishikesh",
    datetime: new Date("2026-12-10T06:00:00"),
    description: "Outdoor photography workshop in scenic locations",
    capacity: 20,
    category: "Art",
    registeredCount: 0
  },
  {
    name: "React Native App Workshop",
    organizer: "CodeMobile",
    location: "Hyderabad",
    datetime: new Date("2026-11-30T09:00:00"),
    description: "Build mobile apps for iOS & Android with React Native",
    capacity: 50,
    category: "Tech",
    registeredCount: 0
  },
  {
    name: "Yoga & Mindfulness Camp",
    organizer: "ZenWell",
    location: "Pune",
    datetime: new Date("2026-12-08T06:30:00"),
    description: "Combine yoga and meditation for mental wellness",
    capacity: 30,
    category: "Health",
    registeredCount: 0
  },
  {
    name: "Digital Marketing Advanced Course",
    organizer: "MarketPro",
    location: "Mumbai",
    datetime: new Date("2026-11-15T14:00:00"),
    description: "Advanced techniques for online marketing campaigns",
    capacity: 40,
    category: "Marketing",
    registeredCount: 0
  },
  {
    name: "Leadership & Team Management Workshop",
    organizer: "LeadNow",
    location: "Chennai",
    datetime: new Date("2026-12-12T10:00:00"),
    description: "Develop leadership skills and manage teams effectively",
    capacity: 35,
    category: "Business",
    registeredCount: 0
  }]) ;

    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Seed failed" });
  }
});




module.exports = router


