export default function GroupCreatePopUp() {
    return (
        <div className="add-contact-outer">
             <form className="add-contact-popup" action="/api/v1/group-create" method="post">
            <input type="text" placeholder="Enter Member ID" />
            <button type="submit">Add</button>
            <button type="">close</button>
        </form>
        </div>
       
    );
}