

function User() {

    const image = ["/manIcon.svg", "/girlIcon.svg"];
    const gender = "f";

    const icon = (gender : string) => {
        return gender === "f" ? image[0] : image[1];
    }   



return(
    <div>
        <img src={icon(gender)}/>
        <h1>ciao</h1>
        

    </div>

)

}

export default User;