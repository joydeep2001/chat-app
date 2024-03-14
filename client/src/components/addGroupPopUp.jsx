export default function GroupCreatePopUp() {
    return (
        <div className="group-pop-outer">
             <form className="group-create-popup" action="/api/v1/group-create" method="post">
            <input type="text" placeholder="Enter Group Name" />
            <input type="text" placeholder="Enter Group Id" />
            <input type="text" placeholder="Enter Member ID" />
            <button type="submit">Create</button>
            <button type="">close</button>
        </form>
        </div>
       
    );
}