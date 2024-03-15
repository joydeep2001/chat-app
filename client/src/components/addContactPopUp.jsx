import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

export default function GroupCreatePopUp({ onClose }) {
  const { register, handleSubmit } = useForm();

  async function onSubmit(data) {
    const { memberId } = data;
    try {
      // Assuming you're sending memberId to your backend API
      const response = await axios.post("/api/v1/group-create", { memberId });
      console.log(response.data); // Log the response from the API if needed
      onClose(); // Close the popup on successful submission
    } catch (error) {
      console.error("Error:", error);
      // Handle error
    }
  }

  return (
    <div className="add-contact-outer">
      <form className="add-contact-popup" onSubmit={handleSubmit(onSubmit)}>
        <input type="text" placeholder="Enter Member ID" {...register('memberId')} />
        <button type="submit">Add</button>
        <button type="button" onClick={onClose}>Close</button>
      </form>
    </div>
  );
}
