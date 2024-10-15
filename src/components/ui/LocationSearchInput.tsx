"use client"

import { useJsApiLoader, StandaloneSearchBox, Libraries } from "@react-google-maps/api"
import { Input } from "./input"
import { useRef } from "react"

const libraries: Libraries = ["places"]

interface LocationSearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    onLocationSelected: (location: string) => void
}

export default function LocationSearchInput ({onLocationSelected, ...props }: LocationSearchInputProps) {
    const searchBox = useRef<google.maps.places.SearchBox>();
    
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string,
        libraries: libraries
      })

    const handleOnPlacesChange = () => {
        if(searchBox.current){
            const places = searchBox.current.getPlaces()
            if(places){
                onLocationSelected(places[0].formatted_address as string)
            }
        }
    }

    if(!isLoaded) return

    return (
    <StandaloneSearchBox
        onLoad={(ref) => searchBox.current = ref}
        onPlacesChanged={handleOnPlacesChange}
    >
        <Input 
             placeholder="search for a city"
             type="search"
             {...props}
         />
    </StandaloneSearchBox>
    )
}