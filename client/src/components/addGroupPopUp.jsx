import React from 'react';
import { useForm } from 'react-hook-form';
import useAxiosWrapper from '../hooks/useAxiosWrapper';

export default function GroupCreatePopUp({ onClose }) {
  const { register, handleSubmit } = useForm();
    const {fetchData: addGroup} = useAxiosWrapper()
  function handleClose() {
    onClose();
  }

  function onSubmit(data) {
    const groupName = data.groupName;
    const groupId = data.groupId;
    const members = data.memberId.split(",");
    const payload = {
        groupName,
        group_id: groupId,
        member_id: members
    }
    addGroup("/group-create/", {
        method: "POST",
        data: payload
    })
    console.log(payload);
    //handleClose(); 
  }

  return (
    <div className="group-pop-outer">
      <div className="group-create-popup">
        <form onSubmit={handleSubmit(onSubmit)}>
          <input type="text" placeholder="Enter Group Name" {...register('groupName')} />
          <input type="text" placeholder="Enter Group Id" {...register('groupId')} />
          <input type="text" placeholder="Enter coma speareted member id" {...register('memberId')} />
          <button type="submit">Create</button>
          <button type="button" onClick={handleClose}>Close</button>
        </form>
      </div>
    </div>
  );
}
