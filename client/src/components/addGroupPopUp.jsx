import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useAxiosWrapper from '../hooks/useAxiosWrapper';

export default function GroupCreatePopUp({ onClose, createGroup }) {
  const { register, handleSubmit } = useForm();
    const {data, fetchData: addGroup} = useAxiosWrapper();
    useEffect(() => {
      if(!data) return;
      createGroup(data.data.name);
    }, [data])
  function handleClose() {
    onClose();
  }

  function onSubmit(data) {
    const groupName = data.groupName;
    const members = data.memberId.split(",");
    const payload = {
        group_name: groupName,
        members
    }
    addGroup("/group/", {
        method: "POST",
        data: payload
    });
    console.log(payload);
    //handleClose(); 
  }

  return (
    <div className="group-pop-outer">
      <div className="group-create-popup">
        <form onSubmit={handleSubmit(onSubmit)}>
          <input type="text" placeholder="Enter Group Name" {...register('groupName')} />
          <input type="text" placeholder="Enter coma speareted member id" {...register('memberId')} />
          <button type="submit">Create</button>
          <button type="button" onClick={handleClose}>Close</button>
        </form>
      </div>
    </div>
  );
}
