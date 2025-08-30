const mongoose = require("mongoose");
const Listing = require("./models/listing"); // adjust path if needed

const dbUrl = process.env.MONGO_URL || "mongodb+srv://lohithakopanathi:882005@cluster0.3uwt7wu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

async function updateListings() {
  const listings = await Listing.find({});
  console.log(`Found ${listings.length} listings`);

  for (let listing of listings) {
    if (!listing.geometry || !listing.geometry.coordinates) {
      // hardcoding dummy coords (replace with maptierl geocoding API if available)
      listing.geometry = {
        type: "Point",
        coordinates: [80.0, 16.5], // lng, lat
      };
      await listing.save();
      console.log(`Updated listing: ${listing.title}`);
    }
  }
  console.log("All missing coordinates updated!");
  mongoose.connection.close();
}

updateListings();
