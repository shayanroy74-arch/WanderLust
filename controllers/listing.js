const Listing = require("../models/listing.js");
module.exports.index=async (req,res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", {allListings});
}

module.exports.renderNewForm = (req,res)=>{
    console.log(req.user);    
    res.render("./listings/new.ejs");
}

module.exports.showListing = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({"path": "reviews", populate: {path: "author"}})
    .populate("owner");
    if(!listing){
        req.flash("error", "Cannot find that listing!");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("./listings/show.ejs",{listing});
    console.log("Show working");
}

module.exports.createListing = async(req,res,next)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    console.log("route running");
    console.log(req.body);
const newListing = new Listing(req.body.listing);
console.log(req.body);
newListing.owner = req.user._id;
newListing.image = {url, filename};
await newListing.save();
req.flash("success", "Successfully made a new listing!");
console.log("creation Success");
res.redirect("/listings");
}

module.exports.renderEditForm = async(req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Cannot find that listing!");
        return res.redirect("/listings");
    }
    let originalUrl = listing.image.url;
    originalUrl = originalUrl.replace("/upload", "/upload/w_100");
    res.render("./listings/edit.ejs", {listing, originalUrl});
    console.log("Edit success");
}

module.exports.updateListing = async(req,res)=>{
    let {id} = req.params;
    
   let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing}); 
   if(typeof req.file !== "undefined"){
    let url = req.file.path;
    listing.image.url = req.file.path;
    listing.image.filename = req.file.filename;
    await listing.save();
   }    
    res.redirect(`/listings/${id}`);
    req.flash("success", "Listing updated successfully!");
    console.log("updation success");
}

module.exports.deleteListing = async(req,res) => {
    let {id}= req.params;
    
    let deletedlisting = await Listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
}