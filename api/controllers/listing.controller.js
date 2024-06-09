import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";


export const createListing = async (req, res, next) => {
    try {
      const listing = await Listing.create(req.body);
      return res.status(201).json(listing);
    } catch (error) {
      next(error);
    }
  };

  export const deleteListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
  
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
  
    if (req.user.id !== listing.userRef) {
      return next(errorHandler(401, 'You can only delete your own listings!'));
    }
  
    try {
      await Listing.findByIdAndDelete(req.params.id);
      res.status(200).json('Listing has been deleted!');
    } catch (error) {
      next(error);
    }
  };


  export const updateListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
    if (req.user.id !== listing.userRef) {
      return next(errorHandler(401, 'You can only update your own listings!'));
    }
  
    try {
      const updatedListing = await Listing.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.status(200).json(updatedListing);
    } catch (error) {
      next(error);
    }
  };

  export const getListing = async (req, res, next) => {
    try {
      const listing = await Listing.findById(req.params.id);
      if (!listing) {
        return next(errorHandler(404, 'Listing not found!'));
      }
      res.status(200).json(listing);
    } catch (error) {
      next(error);
    }
  };


  export const getListings = async (req, res, next) => {
    try {
      const limit = parseInt(req.query.limit) || 9;
      const startIndex = parseInt(req.query.startIndex) || 0;
      let offer = req.query.offer;
  
      if (offer === undefined || offer === 'false') {
        offer = { $in: [false, true] };
      }
  
      let furnished = req.query.furnished;
  
      if (furnished === undefined || furnished === 'false') {
        furnished = { $in: [false, true] };
      }
  
      let parking = req.query.parking;
  
      if (parking === undefined || parking === 'false') {
        parking = { $in: [false, true] };
      }
  
      let type = req.query.type;
  
      if (type === undefined || type === 'all') {
        type = { $in: ['sale', 'rent'] };
      }
  
      const searchTerm = req.query.searchTerm || '';
  
      const sort = req.query.sort || 'createdAt';
  
      const order = req.query.order || 'desc';
  
      const listings = await Listing.find({
        name: { $regex: searchTerm, $options: 'i' },
        offer,
        furnished,
        parking,
        type,
      })
        .sort({ [sort]: order })
        .limit(limit)
        .skip(startIndex);
  
      return res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  };

  export const getListingWithUser = async (req, res, next) => {
    try {
      const listingId = req.params.id;
  
      // Find the listing by its ID
      const listing = await Listing.findById(listingId);
  
      if (!listing) {
        return next(errorHandler(404, 'Listing not found!'));
      }
  
      // Find the user who owns the listing
      const user = await User.findById(listing.userRef);
  
      if (!user) {
        return next(errorHandler(404, 'User not found!'));
      }
  
      // Construct the response object
      const listingWithUser = {
        listing,
        user
      };
  
      // Send the response
      res.status(200).json(listingWithUser);
    } catch (error) {
      next(error);
    }
  };


  export const updateRentedField = async (req, res, next) => {
    const listingId = req.params.id;
    const { rented } = req.body; // Extract rented field from request body
    console.log(rented);

    try {
      const listing = await Listing.findById(listingId);
      if (!listing) {
        return next(errorHandler(404, 'Listing not found!'));
      }
      
      // Update rented field
      listing.rented = true;
      const updatedListing = await listing.save();
  
      res.status(200).json(updatedListing);
    } catch (error) {
      next(error);
    }
  };

  export const updateRentedFieldFalse = async (req, res, next) => {
    const listingId = req.params.id;
    const { rented } = req.body; // Extract rented field from request body
    console.log(rented);

    try {
      const listing = await Listing.findById(listingId);
      if (!listing) {
        return next(errorHandler(404, 'Listing not found!'));
      }
      
      // Update rented field
      listing.rented = false;
      const updatedListing = await listing.save();
  
      res.status(200).json(updatedListing);
    } catch (error) {
      next(error);
    }
  };