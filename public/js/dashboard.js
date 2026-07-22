function updateClock(){

    const clock=document.getElementById("liveClock");

    if(clock){

        clock.innerHTML=new Date().toLocaleTimeString();

    }

}

document.addEventListener("DOMContentLoaded",()=>{

    updateClock();

    setInterval(updateClock,1000);

    // Initialize every Bootstrap Dropdown

    document.querySelectorAll(".dropdown-toggle").forEach(btn=>{

        bootstrap.Dropdown.getOrCreateInstance(btn);

    });

});

// ================================
// Admin Profile Dropdown
// ================================

document.addEventListener("DOMContentLoaded",()=>{

    const profileBtn=document.getElementById("profileBtn");

    const profileMenu=document.getElementById("profileMenu");

    if(profileBtn && profileMenu){

        profileBtn.addEventListener("click",(e)=>{

            e.stopPropagation();

            profileMenu.classList.toggle("show");

        });

        document.addEventListener("click",()=>{

            profileMenu.classList.remove("show");

        });

    }

});