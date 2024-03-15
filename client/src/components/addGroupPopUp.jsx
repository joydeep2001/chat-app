export default function GroupCreatePopUp({onClose}) {
   function handleClose() {
    onClose();
   }
    return (
    <div className="group-pop-outer">
      <div className="group-create-popup">
        <input type="text" placeholder="Enter Group Name" />
        <input type="text" placeholder="Enter Group Id" />
        <input type="text" placeholder="Enter Member ID" />
        <button type="submit">Create</button>
        <button onClick={handleClose} type="">Close</button>
      </div>
    </div>
  );
}
