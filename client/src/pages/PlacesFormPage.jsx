import React, { useEffect, useState } from "react";
import PhotosUploader from "../PhotosUploader";
import Perks from "../Perks";
import AccountNav from "../AccountNav";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";

const PlacesFormPage = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/places/" + id).then((response) => {
      const { data } = response;
      setTitle(data.title);
      setAddress(data.address);
      setAddedPhotos(data.photos);
      setDescription(data.description);
      setPerks(data.perks);
      setExtraInfo(data.extraInfo);
      setCheckOut(data.checkOut);
      setCheckIn(data.checkIn);
      setMaxGuests(data.maxGuests);
    });
  }, [id]);

  function inputDescription(text) {
    return <p className="text-gray-500 text-sm">{text}</p>;
  }
  function inputHeader(text) {
    return <h2 className="text-2xl mt-4">{text}</h2>;
  }

  function preInput(header, description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  }

  async function savePlace(ev) {
    ev.preventDefault();
    const placeData = {
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
    };
    if (id) {
      // update
      await axios.put("/places", {
        id,
        ...placeData,
      });
      setRedirect(true);
    } else {
      await axios.post("/places", placeData);
      setRedirect(true);
    }

  }

  if (redirect) {
    return <Navigate to={"/account/places"} />;
  }
  return (
    <div>
      <AccountNav />
      <form onSubmit={savePlace}>
        {preInput(
          "Title",
          "Title for your place, should be short and catchy as in advertisement"
        )}
        <input
          type="text"
          placeholder="title, for example: My lovely appartment"
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
        />
        {preInput("Address", "Address to this place")}
        <input
          type="text"
          placeholder="address"
          value={address}
          onChange={(ev) => setAddress(ev.target.value)}
        />

        {preInput("Photos", "Add only jpeg/jpg images")}
        <PhotosUploader
          addedPhotos={addedPhotos}
          onChange={setAddedPhotos}
        ></PhotosUploader>

        {preInput("Description", "Description of the place")}
        <textarea
          value={description}
          onChange={(ev) => setDescription(ev.target.value)}
        ></textarea>

        {preInput("Perks", "Select all the relevent perks")}
        <Perks selected={perks} onChange={setPerks} />

        {preInput("Extra Info", "House rules or etc")}
        <textarea
          value={extraInfo}
          onChange={(ev) => setExtraInfo(ev.target.value)}
        ></textarea>

        {preInput(
          "Check in & out times, max guests!",
          "add arrival and departure time for maximum cleaning"
        )}
        <div className="grid gap-2 sm:grid-cols-3 ">
          <div>
            <h3 className="mt-2 -mb-1">Check In time</h3>
            <input
              type="text"
              placeholder="14:00"
              value={checkIn}
              onChange={(ev) => setCheckIn(ev.target.value)}
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Check out time</h3>
            <input
              type="text"
              placeholder="18:30"
              value={checkOut}
              onChange={(ev) => setCheckOut(ev.target.value)}
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Maximum guests</h3>
            <input
              type="number"
              placeholder="6"
              value={maxGuests}
              onChange={(ev) => setMaxGuests(ev.target.value)}
            />
          </div>
        </div>
        <button className="primary my-4 max-w-48">Save</button>
      </form>
    </div>
  );
};

export default PlacesFormPage;
