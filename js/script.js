// 1- Fetch, load and show categories on html
function getTimeString(time){
    const hour = parseInt(time / 3600);
    let remainingSecond = time % 3600;
    const minute = parseInt(remainingSecond / 60);
    return `${hour}hrs ${minute} min ago`
}

const removeActiveClass = () =>{
  const buttons = document.getElementsByClassName('category-btn');
  for (const btn of buttons) {
    btn.classList.remove("active");
  }
}
// create loadCategories
const loadCategories = () => {
  fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
    .then((res) => res.json())
    .then((data) => displayCategories(data.categories))
    .catch((error) => console.log(error));
};
                                 
// create loadVideos
const loadVideos = (searchText = '') => {
  fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`)
    .then((res) => res.json())
    .then((data) => displayVideos(data.videos))
    .catch((error) => console.log(error));
};

// create displayCategories
const displayCategories = (categories) => {
  const categoryConteiner = document.getElementById("categories");
  categories.forEach((item) => {
    console.log(item);
    // create a button
    const buttonContainer = document.createElement("div");
    buttonContainer.innerHTML = 
    `
    <button id="btn-${item.category_id}" onclick="loadCategoryVideos(${item.category_id})" class="btn category-btn">
    ${item.category}
    </button>
    
    `


    categoryConteiner.append(buttonContainer);
  });
};

const loadCategoryVideos = (id) =>{
    fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
    .then((res) => res.json())
    .then((data) => {
      removeActiveClass()
      const activeBtn = document.getElementById(`btn-${id}`)
      activeBtn.classList.add("active")
      displayVideos(data.category)
    })
    .catch((error) => console.log(error));
}

const loadDetails = async(videoID) => {
  const uri = `https://openapi.programming-hero.com/api/phero-tube/video/${videoID}`
  const res = await fetch(uri);
  const data = await res.json();
  displayDetails(data.video)
}

const displayDetails = (video) =>{
  console.log(video)
  const detailContainer = document.getElementById("modal_content");
  // way 1⬇️
  // document.getElementById('showModalData').click();
  // way 2⬇️
  document.getElementById('customModal').showModal();
  detailContainer.innerHTML = `
  <img src=${video.thumbnail} />
  <p>${video.description}</p>
  `
}


// demo card
// const cardDemo = {
//   category_id: "1003",
//   video_id: "aaak",
//   thumbnail: "https://i.ibb.co/ZNggzdm/cake.jpg",
//   title: "Beyond The Pale",
//   authors: [
//     {
//       profile_picture: "https://i.ibb.co/MZ2vbXR/jimm.jpg",
//       profile_name: "Jim Gaffigan",
//       verified: false,
//     },
//   ],
//   others: {
//     views: "2.6K",
//     posted_date: "15400",
//   },
//   description:
//     "'Beyond The Pale' by Jim Gaffigan, with 2.6K views, is a comedic gem that explores everyday observations and family life with a light-hearted and witty approach. Jim's humor is accessible and delightful, making this show perfect for anyone who enjoys clean, observational comedy.",
// };

const displayVideos = (videos) => {
  const videoConteiner = document.getElementById("videos");
  videoConteiner.innerHTML = "";

  if (videos.length == 0) {
    videoConteiner.classList.remove('grid')
    videoConteiner.innerHTML = `
    
    <div class="w-h-[300px] flex flex-col gap-5 justify-center items-center">
        <img src="img/icon.png" />
        <h2 class="text-center text-xl font-bold">No Content Here in this Category</h2>
    </div>
    
    `;
    return;
  }else{
    videoConteiner.classList.add('grid')
  }

  videos.forEach((video) => {
    console.log(video);
    const card = document.createElement("div");
    card.classList = "card card-compact";
    card.innerHTML = `
    <figure class="h-[200px] relative">
        <img src=${video.thumbnail} class="h-full w-full object-cover" />
        ${
            video.others.posted_date?.length == 0 ? '' : `<span class="absolute text-xs bg-black rounded p-1 right-2 bottom-2 text-gray-200">${getTimeString(video.others.posted_date)}</span>`
        }
    </figure>

    <div class="px-0 py-2 flex gap-2">
        <div>
            <img class="w-10 h-10 rounded-full object-cover" src=${video.authors[0].profile_picture} alt="">
        </div>
        <div>
            <h2 class="font-bold">${video.title}</h2>
            <div class="flex items-center gap-1">
            <p class="text-sm text-gray-500">${video.authors[0].profile_name}</p>
            ${video.authors[0].verified == true ? `<img class="w-4" src="https://img.icons8.com/?size=48&id=D9RtvkuOe31p&format=png" alt=""></img>` : ''}
            </div>
            <p>${video.others.views} views</p>
            <p><button onclick="loadDetails('${video.video_id}')" class="btn btn-sm btn-error">details</button></p>
        </div>
    </div>
         `;

    videoConteiner.append(card);
  });
};

document.getElementById("searchInput").addEventListener("keyup", (e)=>{
  loadVideos(e.target.value)
})

loadCategories();
loadVideos();
