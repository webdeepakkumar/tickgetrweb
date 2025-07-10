import React, { useState, useRef } from "react";
import PopupDefault from "./PopupDefault";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { GoPlus } from "react-icons/go";

const ImageCropper = ({ onCrop, onClose, aspectRatio }) => {
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [cropper, setCropper] = useState();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          if (file.size <= 2097152 && file.type.startsWith("image/")) {
            setImage(reader.result);
            setIsPopupOpen(true);
          } else {
            alert(
              "Please select an image with a maximum size of 2MB and in a supported format.."
            );
          }
        };
      };
    }
  };
  const cropperRef = useRef(null);

  const handleCrop = (e) => {
    e.preventDefault();
    if (cropperRef.current && cropperRef.current.cropper) {
      const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas();
      croppedCanvas.toBlob((blob) => {
        if (blob) {
          const file = new File(
            [blob],
            `cropped_image_${Date.now()}_${Math.floor(
              Math.random() * 1000
            )}.jpeg`,
            {
              type: "image/jpeg",
            }
          );
          setCroppedImage(file);
          setIsPopupOpen(false);
          onCrop(file);
        } else {
          console.error("Failed to convert cropped canvas to blob.");
        }
      }, "image/jpeg");
    }
  };

  const handleClosePopup = () => {
    setImage(null);
    setCroppedImage(null);
    setCropper(null);
    setIsPopupOpen(false);
    onClose();
  };

  return (
    <>
      <label
        htmlFor="imageUpload"
        className="rcustom-file-upload cursor-pointer"
      >
        <div className="w-full h-full border-2 border-dashed border-zinc-500 rounded-lg flex justify-center items-center text-zinc-500">
          <GoPlus className="text-3xl" />
        </div>
      </label>
      <input
        id="imageUpload"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: "none" }}
      />
      {isPopupOpen && (
        <PopupDefault onClose={handleClosePopup}>
          <Cropper
            ref={cropperRef}
            src={image}
            className="w-full md:w-[400px] h-52 md:h-max justify-center items-center flex"
            aspectRatio={aspectRatio}
            autoCropArea={1}
            guides={false}
            onInitialized={(instance) => setCropper(instance)}
          />
          <button
            onClick={handleCrop}
            className=" mt-7 py-2.5 px-5 rounded-xl bg-orange-400 text-white hover:bg-orange-500 hover:shadow-md transition duration-300"
          >
            Crop Image
          </button>
        </PopupDefault>
      )}
    </>
  );
};

export default ImageCropper;
