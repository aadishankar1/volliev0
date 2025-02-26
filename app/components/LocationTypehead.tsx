"use client";

import React, { useState, useRef } from "react";
import { LoadScript, StandaloneSearchBox } from "@react-google-maps/api";
import { Input } from "@/components/ui/input";

const libraries: "places"[] = ["places"];
const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GEO_CODING_API_KEY || "";

interface AddressAutocompleteProps {
  onPlaceSelected: (place: google.maps.places.PlaceResult) => void;
  setLocation?: (location: { lat: number; lng: number }) => void | undefined;
  className?: string;
  placeholder?: string;
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  onPlaceSelected,
  setLocation,
  className,
  placeholder,
}) => {
  const [address, setAddress] = useState<string>("");
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);

  const handlePlaceChanged = () => {
    if (searchBoxRef.current) {
      const places = searchBoxRef.current.getPlaces();
      if (places && places.length > 0) {
        const place = places[0];
        onPlaceSelected(place);
        setAddress(place.formatted_address || "");

        const location = place.geometry?.location;
        if (location && setLocation)
          setLocation({ lat: location.lat(), lng: location.lng() });
      }
    }
  };

  return (
    <LoadScript googleMapsApiKey={GOOGLE_API_KEY} libraries={libraries}>
      <StandaloneSearchBox
        onLoad={(ref) => (searchBoxRef.current = ref)}
        onPlacesChanged={handlePlaceChanged}
      >
        <Input
          type="text"
          placeholder={placeholder}
          className={className}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </StandaloneSearchBox>
    </LoadScript>
  );
};

export default AddressAutocomplete;
