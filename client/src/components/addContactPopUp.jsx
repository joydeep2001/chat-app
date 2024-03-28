import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

export default function GroupCreatePopUp({ onClose, fetchContact }) {
  const { register, handleSubmit } = useForm();

  async function onSubmit(data) {
    const { memberId } = data;
      fetchContact(`/contacts/${memberId}`, {method: "GET"});
      onClose();
   
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
